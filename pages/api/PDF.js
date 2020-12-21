const puppeteer = require("puppeteer");

// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const exportPDF = async ({ html }) => {
  // Launch a new browser session.
  const browser = await puppeteer.launch();
  // Open a new Page.
  const page = await browser.newPage();

  // Go to our invoice page that we serve on `localhost:8000`.
  // await page.goto(`data:text/html,${html}`, { waitUntil: "networkidle2" });
  await page.goto("https://apple.com/", { waitUntil: "networkidle2" });
  // Store the PDF in a file named `invoice.pdf`.
  // await delay(5000);
  await page.pdf({ path: "invoice.pdf", format: "A4" });

  await browser.close();
};

const PDF = async (req, res) => {
  const { type } = req.body;
  let result;
  switch (type) {
    case "EXPORT_PDF":
      result = exportPDF(req.body);
      break;
    default:
      result = "Error: No such type in /api/PDF: " + type;
      console.error(result);
  }
  const json = JSON.stringify(result);
  res.end(json);
};

export default PDF;
