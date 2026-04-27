const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

// ================= TEMPLATE 1 (MODERN) =================
function templateOne(data, photoBase64) {
  return `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        display: flex;
      }

      .sidebar {
        width: 30%;
        background: #2c3e50;
        color: white;
        padding: 25px;
        text-align: center;
      }

      .photo {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 15px;
        border: 3px solid white;
      }

      .sidebar h3 {
        margin-top: 20px;
        border-bottom: 1px solid #fff;
        padding-bottom: 5px;
      }

      .sidebar ul {
        padding-left: 15px;
        text-align: left;
      }

      .main {
        width: 70%;
        padding: 30px;
      }

      h2 {
        border-bottom: 2px solid #3498db;
        padding-bottom: 5px;
        margin-top: 20px;
      }

      p {
        font-size: 14px;
        line-height: 1.6;
      }
    </style>
  </head>

  <body>
    <div class="sidebar">
      ${photoBase64 ? `<img src="${photoBase64}" class="photo" />` : ""}

      <h2>${data.name || ""}</h2>
      <p>${data.email || ""}</p>
      <p>${data.phone || ""}</p>
      <p>${data.linkedin || ""}</p>

      <h3>Skills</h3>
      <ul>
        ${(data.skills || []).map(s => `<li>${s}</li>`).join("")}
      </ul>
    </div>

    <div class="main">
      <h2>Professional Summary</h2>
      <p>${data.summary || ""}</p>

      <h2>Experience</h2>
      <ul>
        ${(data.experience || []).map(e => `<li>${e}</li>`).join("")}
      </ul>

      <h2>ATS Keywords</h2>
      <p>${(data.keywords || []).join(", ")}</p>
    </div>
  </body>
  </html>
  `;
}

// ================= TEMPLATE 2 (SIMPLE) =================
function templateTwo(data, photoBase64) {
  return `
  <html>
  <body style="font-family: Arial; padding: 30px;">

    ${photoBase64 ? `<img src="${photoBase64}" style="width:100px;border-radius:50%;margin-bottom:10px;" />` : ""}

    <h1>${data.name || ""}</h1>
    <p>${data.email || ""} | ${data.phone || ""} | ${data.linkedin || ""}</p>

    <h2>Summary</h2>
    <p>${data.summary || ""}</p>

    <h2>Skills</h2>
    <ul>
      ${(data.skills || []).map(s => `<li>${s}</li>`).join("")}
    </ul>

    <h2>Experience</h2>
    <ul>
      ${(data.experience || []).map(e => `<li>${e}</li>`).join("")}
    </ul>

    <h2>Keywords</h2>
    <p>${(data.keywords || []).join(", ")}</p>

  </body>
  </html>
  `;
}

// ================= TEMPLATE SWITCH =================
function generateHTML(data, template, photoBase64) {
  if (template === "simple") return templateTwo(data, photoBase64);
  return templateOne(data, photoBase64);
}

// ================= MAIN FUNCTION =================
async function generatePDF(data, template = "modern") {
  console.log("PHOTO PATH:", data.photo);

  // 🔥 CONVERT IMAGE TO BASE64
  let photoBase64 = "";

  if (data.photo) {
    try {
      const imageBuffer = fs.readFileSync(data.photo);
      const ext = path.extname(data.photo).replace(".", "");
      photoBase64 = `data:image/${ext};base64,${imageBuffer.toString("base64")}`;
    } catch (err) {
      console.error("Image read error:", err);
    }
  }

  const html = generateHTML(data, template, photoBase64);

  // 🚀 Launch browser
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();

  // ✅ SAFE LOAD
  await page.setContent(html, { waitUntil: "domcontentloaded" });

  // ⏳ allow image render
  await new Promise(resolve => setTimeout(resolve, 1000));

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  return pdf;
}

module.exports = { generatePDF };