import puppeteer from "puppeteer";
import { renderTemplate } from "../templates/resumeTemplates.js";

export const generateResumePDF = async (template, data) => {
  let browser;

  try {
    console.log("=========== PDF START ===========");

    const html = renderTemplate(template, data);

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    console.log("=========== PDF CREATED ==========");

    return pdfBuffer;

  } catch (error) {

    console.log("=========== PDF ERROR ==========");
    console.log(error);

    throw error;

  } finally {

    if (browser) {
      await browser.close();
    }

    console.log("=========== BROWSER CLOSED ==========");
  }
};