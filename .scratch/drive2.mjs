import { chromium } from "playwright-core";
import path from "node:path";
import fs from "node:fs/promises";

const shotDir = path.resolve(".scratch/shots");
await fs.mkdir(shotDir, { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
page.on("console", (msg) => { if (msg.type() === "error") console.log("CONSOLE ERR:", msg.text()); });
page.on("pageerror", (err) => console.log("PAGE ERR:", err.message));

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForSelector("text=Stop losing website visitors", { timeout: 30000 });

await page.getByRole("button", { name: "Sign in", exact: true }).click();
await page.waitForTimeout(1000);
await page.screenshot({ path: path.join(shotDir, "debug-after-click.png") });
const bodyText = await page.locator("body").innerText();
console.log("BODY SNIPPET:", bodyText.slice(0, 500));

await browser.close();
