const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PSP Engineering Limited</title>
    <style>
      :root {
        color-scheme: dark;
        --navy: #d6e6ff;
        --blue: #6cb5ff;
        --ink: #ecf3fb;
        --muted: #a4b7cb;
        --line: rgba(144, 185, 230, 0.2);
        --panel: rgba(8, 17, 31, 0.88);
        --panel-strong: rgba(12, 24, 43, 0.96);
        --shadow: rgba(0, 0, 0, 0.42);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(68, 143, 220, 0.22), transparent 26%),
          radial-gradient(circle at bottom right, rgba(19, 73, 140, 0.28), transparent 32%),
          linear-gradient(180deg, #04070d 0%, #09111e 48%, #03060b 100%);
      }

      .wrap {
        max-width: 860px;
        margin: 0 auto;
        padding: 40px 20px 56px;
      }

      .card {
        background: rgba(7, 15, 27, 0.9);
        border: 1px solid rgba(144, 185, 230, 0.14);
        border-radius: 24px;
        box-shadow: 0 24px 60px var(--shadow);
        overflow: hidden;
      }

      .hero {
        padding: 36px 28px 24px;
        text-align: center;
        background: linear-gradient(135deg, rgba(27, 56, 96, 0.5), rgba(9, 22, 40, 0.3));
      }

      .hero img {
        width: min(221px, 100%);
        height: auto;
      }

      h1 {
        margin: 20px 0 10px;
        font-size: clamp(2rem, 5vw, 3rem);
        line-height: 1.05;
        color: var(--navy);
      }

      .hero p {
        margin: 0 auto;
        max-width: 540px;
        color: var(--muted);
        font-size: 1.05rem;
      }

      .content {
        padding: 28px;
        display: grid;
        gap: 24px;
      }

      .panel {
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 22px 20px;
        background: var(--panel-strong);
      }

      h2 {
        margin: 0 0 14px;
        font-size: 1.2rem;
        color: var(--navy);
      }

      .contact-block {
        white-space: pre-line;
        line-height: 1.7;
      }

      .website-link {
        color: var(--blue);
        text-decoration: none;
      }

      .website-link:hover {
        text-decoration: underline;
      }

      .note {
        margin-top: 18px;
        padding-top: 18px;
        border-top: 1px solid var(--line);
      }

      @media (max-width: 640px) {
        .wrap {
          padding: 20px 14px 32px;
        }

        .hero,
        .content {
          padding-left: 18px;
          padding-right: 18px;
        }

        .panel {
          padding: 18px 16px;
        }
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <section class="card">
        <header class="hero">
          <img src="/logo.png" alt="PSP Engineering Limited logo" />
          <h1>Website Maintenance</h1>
          <p>Our new website is currently being prepared. Please use the contact details below in the meantime.</p>
        </header>

        <section class="content">
          <div class="panel">
            <h2>Contact</h2>
            <div class="contact-block">PSP Engineering Limited
Physical Address
44 Carr Road
Mount Roskill
Auckland City
Auckland 1041

Postal Address
P O Box 27085
Mount Roskill
Auckland City
Auckland 1440

Website: <a class="website-link" href="https://www.pspeng.co.nz">www.pspeng.co.nz</a>

General Enquiries
Tony Slimo, Managing Director
Brent Airey, Senior Engineer

Ph (09) 624-1004
Fax (09) 624-2449

Hours of Operation
Mon - Fri 7:30am - 5:00pm</div>

            <div class="contact-block note">International Enquiries
PSP provides our full range of services internationally as well.

To contact us from overseas:

Ph +64 9 624 1004
Fax +64 9 624 2449</div>
          </div>
        </section>
      </section>
    </main>
  </body>
</html>`);
});

app.listen(port, () => {
  console.log("PSP placeholder site running on port " + port);
});
