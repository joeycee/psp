const { company, formStatusContent } = require("./siteData");

function stars(count) {
  return "&#9733;".repeat(count) + "&#9734;".repeat(5 - count);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildFlashMarkup(status) {
  const content = formStatusContent[status];
  if (!content) {
    return "";
  }

  return `
    <div class="shell">
      <div class="flash flash-${content.tone}" role="status" aria-live="polite">
        <strong>${escapeHtml(content.title)}</strong>
        <p>${escapeHtml(content.copy)}</p>
      </div>
    </div>
  `;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isDebugEmailEnabled(env = process.env) {
  return String(env.DEBUG_EMAIL || "").toLowerCase() === "true";
}

function debugEmailLog(message, payload, env = process.env) {
  if (!isDebugEmailEnabled(env)) {
    return;
  }

  if (payload === undefined) {
    console.log(message);
    return;
  }

  console.log(message, payload);
}

function getMailerConfig(env = process.env) {
  return {
    apiKey: env.SMTP2GO_API_KEY || "",
    from: env.SMTP2GO_SENDER || env.SMTP_FROM || company.email,
    to: env.CONTACT_TO || company.email,
    enabled: Boolean(env.SMTP2GO_API_KEY && (env.SMTP2GO_SENDER || env.SMTP_FROM || company.email)),
  };
}

function getRecaptchaConfig(env = process.env) {
  const minScoreValue = Number(env.RECAPTCHA_MIN_SCORE || "0.5");

  return {
    siteKey: env.RECAPTCHA_SITE_KEY || "",
    secretKey: env.RECAPTCHA_SECRET_KEY || "",
    action: env.RECAPTCHA_ACTION || "contact_form",
    minScore: Number.isFinite(minScoreValue) ? minScoreValue : 0.5,
    enabled: Boolean(env.RECAPTCHA_SITE_KEY && env.RECAPTCHA_SECRET_KEY),
  };
}

async function verifyRecaptchaToken({ token, remoteIp, env = process.env, fetchImpl = global.fetch }) {
  const config = getRecaptchaConfig(env);

  if (!config.enabled) {
    return { ok: true, skipped: true };
  }

  if (!token || !fetchImpl) {
    return { ok: false };
  }

  const params = new URLSearchParams({
    secret: config.secretKey,
    response: token,
  });

  if (remoteIp) {
    params.set("remoteip", remoteIp);
  }

  const response = await fetchImpl("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    return { ok: false };
  }

  const result = await response.json();

  if (!result.success) {
    return { ok: false, result, reason: "challenge_failed" };
  }

  if (result.action && result.action !== config.action) {
    return { ok: false, result, reason: "action_mismatch" };
  }

  if (typeof result.score === "number" && result.score < config.minScore) {
    return { ok: false, result, reason: "low_score" };
  }

  return { ok: true, result };
}

async function sendContactEmail({ name, companyName, email, message, enquiryType, sourcePage, env = process.env, fetchImpl = global.fetch }) {
  const config = getMailerConfig(env);

  if (!config.enabled || !fetchImpl) {
    debugEmailLog("[contact-email] Email sending unavailable: missing SMTP2GO config", undefined, env);
    return { ok: false, reason: "unavailable" };
  }

  debugEmailLog("[contact-email] Sending via SMTP2GO", {
    to: config.to,
    from: config.from,
    enquiryType: enquiryType || "General enquiry",
    sourcePage: sourcePage || "/contact",
    senderEmail: email,
  }, env);

  const response = await fetchImpl("https://api.smtp2go.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Smtp2go-Api-Key": config.apiKey,
    },
    body: JSON.stringify({
      sender: config.from,
      to: [config.to],
      subject: `PSP Website Enquiry: ${enquiryType || "General enquiry"}`,
      text_body: [
        `Name: ${name}`,
        `Company: ${companyName || "Not provided"}`,
        `Email: ${email}`,
        `Enquiry type: ${enquiryType || "General enquiry"}`,
        `Source page: ${sourcePage || "/contact"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      custom_headers: [
        {
          header: "Reply-To",
          value: email,
        },
      ],
    }),
  });

  if (!response.ok) {
    debugEmailLog("[contact-email] SMTP2GO HTTP error", {
      status: response.status,
      statusText: response.statusText,
    }, env);
    return { ok: false, reason: "failed" };
  }

  const result = await response.json();

  if (result.data?.failed > 0 || result.data?.succeeded === 0) {
    debugEmailLog("[contact-email] SMTP2GO reported failure", {
      succeeded: result.data?.succeeded,
      failed: result.data?.failed,
    }, env);
    return { ok: false, reason: "failed", result };
  }

  debugEmailLog("[contact-email] SMTP2GO send success", {
    succeeded: result.data?.succeeded,
    failed: result.data?.failed,
  }, env);

  return { ok: true };
}

function linkButton(href, label, kind = "primary") {
  return `<a class="button button-${kind}" href="${href}">${escapeHtml(label)}</a>`;
}

function cardLink(href, image, eyebrow, title, copy) {
  return `
    <a class="card-link" href="${href}">
      <div class="card-media">
        <img src="${image}" alt="${escapeHtml(title)}" />
        <div class="card-media-overlay"></div>
      </div>
      <div class="card-copy">
        <span class="card-eyebrow">${escapeHtml(eyebrow)}</span>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(copy)}</p>
        <span class="card-cta">
          <span>View details</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </div>
    </a>
  `;
}

module.exports = {
  stars,
  escapeHtml,
  buildFlashMarkup,
  isValidEmail,
  isDebugEmailEnabled,
  debugEmailLog,
  sendContactEmail,
  getRecaptchaConfig,
  verifyRecaptchaToken,
  linkButton,
  cardLink,
};
