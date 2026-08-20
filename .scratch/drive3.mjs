import { chromium } from "playwright-core";
import path from "node:path";
import fs from "node:fs/promises";

const shotDir = path.resolve(".scratch/shots");
await fs.mkdir(shotDir, { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGE ERR:", err.message));
page.on("requestfailed", (req) => console.log("REQ FAILED:", req.url(), req.failure()?.errorText));

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForSelector("text=Stop losing website visitors", { timeout: 30000 });

const btn = page.getByRole("button", { name: "Sign in", exact: true });
console.log("button count:", await btn.count());
console.log("button visible:", await btn.first().isVisible());
const box = await btn.first().boundingBox();
console.log("box:", box);

await btn.first().click();
await page.waitForTimeout(500);

console.log("dialog count in DOM:", await page.locator('[role="dialog"]').count());
console.log("html has Welcome back:", (await page.locator("body").innerText()).includes("Welcome back"));

await page.screenshot({ path: path.join(shotDir, "debug3.png") });

await browser.close();
