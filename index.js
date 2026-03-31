const express = require("express");
const { loadEnvFile } = require("./lib/loadEnv");

loadEnvFile();

const { isValidEmail, sendContactEmail, getRecaptchaConfig, verifyRecaptchaToken, debugEmailLog } = require("./lib/siteUtils");
const {
  services,
  renderHome,
  renderServicesPage,
  renderServiceDetail,
  renderProductsPage,
  renderSurfkitPage,
  renderVisionTrapPage,
  renderVisionTrapInstallationPage,
  renderVisionTrapStockistsPage,
  renderAboutPage,
  renderReviewsPage,
  renderContactPage,
  renderNotFound,
} = require("./lib/siteRenderer");

const app = express();
const port = process.env.PORT || 3000;
const recaptchaConfig = getRecaptchaConfig();

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.type("html").send(renderHome()));
app.get("/services", (req, res) => res.type("html").send(renderServicesPage()));
app.get("/services/:slug", (req, res) => {
  const service = services.find((item) => item.slug === req.params.slug);
  if (!service) {
    res.status(404).type("html").send(renderNotFound());
    return;
  }

  res.type("html").send(renderServiceDetail(service));
});

app.get("/products", (req, res) => res.type("html").send(renderProductsPage()));
app.get("/products/surfkit", (req, res) => {
  res.type("html").send(renderSurfkitPage(req.query.status, { recaptchaSiteKey: recaptchaConfig.siteKey }));
});
app.get("/products/vision-trap", (req, res) => res.type("html").send(renderVisionTrapPage()));
app.get("/products/vision-trap/installation", (req, res) => {
  res.type("html").send(renderVisionTrapInstallationPage());
});
app.get("/products/vision-trap/stockists", (req, res) => {
  res.type("html").send(renderVisionTrapStockistsPage());
});
app.get("/about", (req, res) => res.type("html").send(renderAboutPage()));
app.get("/reviews", (req, res) => res.type("html").send(renderReviewsPage()));
app.get("/contact", (req, res) => {
  res.type("html").send(renderContactPage(req.query.status, { recaptchaSiteKey: recaptchaConfig.siteKey }));
});

app.post("/contact", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const companyName = String(req.body.companyName || "").trim();
  const email = String(req.body.email || "").trim();
  const message = String(req.body.message || "").trim();
  const honeypot = String(req.body.faxNumber || "").trim();
  const formStartedAt = Number(req.body.formStartedAt || 0);
  const recaptchaToken = String(req.body["g-recaptcha-response"] || "").trim();
  const enquiryType = String(req.body.enquiryType || "General website enquiry").trim();
  const sourcePage = String(req.body.sourcePage || "/contact").trim();
  const requestedReturnTo = String(req.body.returnTo || "/contact").trim();
  const returnTo = requestedReturnTo.startsWith("/") ? requestedReturnTo : "/contact";

  debugEmailLog("[contact-form] Submission received", {
    enquiryType,
    sourcePage,
    returnTo,
    email,
    hasCompanyName: Boolean(companyName),
    formAgeMs: formStartedAt ? Date.now() - formStartedAt : null,
  });

  if (honeypot) {
    debugEmailLog("[contact-form] Honeypot triggered, treating submission as spam", {
      sourcePage,
      email,
    });
    res.redirect(`${returnTo}?status=success`);
    return;
  }

  if (formStartedAt && Date.now() - formStartedAt < 1500) {
    debugEmailLog("[contact-form] Submission arrived too quickly, treating as suspicious", {
      sourcePage,
      email,
      formAgeMs: Date.now() - formStartedAt,
    });
    res.redirect(`${returnTo}?status=success`);
    return;
  }

  if (!name || !email || !message) {
    debugEmailLog("[contact-form] Missing required fields", {
      hasName: Boolean(name),
      hasEmail: Boolean(email),
      hasMessage: Boolean(message),
    });
    res.redirect(`${returnTo}?status=missing`);
    return;
  }

  if (!isValidEmail(email)) {
    debugEmailLog("[contact-form] Invalid email submitted", { email });
    res.redirect(`${returnTo}?status=invalid_email`);
    return;
  }

  if (recaptchaConfig.enabled) {
    if (!recaptchaToken) {
      debugEmailLog("[contact-form] Missing reCAPTCHA token");
      res.redirect(`${returnTo}?status=captcha_required`);
      return;
    }

    try {
      const verification = await verifyRecaptchaToken({
        token: recaptchaToken,
        remoteIp: req.ip,
      });

      if (!verification.ok) {
        debugEmailLog("[contact-form] reCAPTCHA verification failed", {
          reason: verification.reason || "unknown",
          score: verification.result?.score ?? null,
          action: verification.result?.action || null,
        });
        res.redirect(`${returnTo}?status=captcha_failed`);
        return;
      }
    } catch (error) {
      console.error("reCAPTCHA verification failed", error);
      res.redirect(`${returnTo}?status=captcha_failed`);
      return;
    }
  }

  try {
    const result = await sendContactEmail({
      name,
      companyName,
      email,
      message,
      enquiryType,
      sourcePage,
    });

    if (!result.ok) {
      debugEmailLog("[contact-form] Email send returned non-success status", {
        reason: result.reason,
      });
      res.redirect(`${returnTo}?status=${result.reason}`);
      return;
    }

    debugEmailLog("[contact-form] Email send completed successfully", { email, sourcePage });
    res.redirect(`${returnTo}?status=success`);
  } catch (error) {
    console.error("Contact form send failed", error);
    res.redirect(`${returnTo}?status=failed`);
  }
});

app.use((req, res) => {
  res.status(404).type("html").send(renderNotFound());
});

app.listen(port, () => {
  console.log(`PSP Engineering site listening on port ${port}`);
});
