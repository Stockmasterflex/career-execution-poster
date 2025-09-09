import puppeteer from "puppeteer";

// Parse command line arguments
const args = process.argv.slice(2);
const url = args.find(arg => arg.startsWith('--url='))?.split('=')[1] || "http://localhost:8080/poster/";
const out = args.find(arg => arg.startsWith('--out='))?.split('=')[1] || "./_site/poster.pdf";
const size = args.find(arg => arg.startsWith('--size='))?.split('=')[1] || "24x36";

// Parse size parameter
let width, height;
if (size === "24x36") {
  width = "24";
  height = "36";
} else if (size === "12x18") {
  width = "12";
  height = "18";
} else {
  // Fallback to individual width/height parameters
  width = args.find(arg => arg.startsWith('--width='))?.split('=')[1] || "24";
  height = args.find(arg => arg.startsWith('--height='))?.split('=')[1] || "36";
}

const browser = await puppeteer.launch({ headless: "new", args: ["--disable-dev-shm-usage"] });
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle0" });

// ensure background colors
await page.emulateMediaType('print');

await page.pdf({
  path: out,
  width: `${width}in`,
  height: `${height}in`,
  printBackground: true,
  pageRanges: "1"
});

await browser.close();
console.log("Saved PDF →", out);
