import QRCode from "qrcode";
import fs from "fs/promises";

const targets = [
  { text: process.env.SITE_URL || "https://kyleholthaus.com", out: "src/assets/qr-site.png" },
  { text: process.env.SHEET_URL || "https://docs.google.com/spreadsheets/d/your-tracker-sheet", out: "src/assets/qr-tracker.png" }
];

for (const t of targets) {
  await fs.mkdir("src/assets", { recursive: true });
  await QRCode.toFile(t.out, t.text, { width: 280, margin: 1 });
  console.log("QR saved:", t.out);
}
