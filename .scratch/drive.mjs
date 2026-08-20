import { chromium } from "playwright-core";
import path from "node:path";

const shotDir = path.resolve(
  "C:\\Users\\Umais\\AppData\\Local\\Temp\\claude\\C--Users-Umais-OneDrive-Desktop-Codrithm-Projects-Web-Auditor\\b9487344-ccca-4b55-b345-bd9d47029966\\scratchpad\\shots",
);
await import("node:fs/promises").then((fs) => fs.mkdir(shotDir, { recursive: true }));

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

async function shot(name) {
  await page.screenshot({ path: path.join(shotDir, name), fullPage: false });
  console.log("shot:", name);
}

console.log("nav landing");
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForSelector("text=Stop losing website visitors", { timeout: 30000 });
await shot("1-landing.png");

console.log("open sign-in dialog");
await page.getByRole("button", { name: "Sign in" }).first().click({ force: true });
await page.waitForSelector("text=Welcome back", { timeout: 10000 });
await shot("2-auth-dialog.png");

console.log("switch to create account");
await page.getByRole("button", { name: "Create an account" }).click();
await page.waitForSelector("text=Create your account", { timeout: 10000 });
await shot("3-auth-signup.png");

// Close dialog, open upgrade modal via pricing "Choose Starter"
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
console.log("scroll to pricing, open upgrade modal");
await page.locator("#pricing").scrollIntoViewIfNeeded();
await page.getByRole("button", { name: /Choose Starter/i }).click();
await page.waitForSelector("text=Keep the insights coming", { timeout: 10000 });
await shot("4-upgrade-modal.png");
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

console.log("errors so far:", errors);

await browser.close();
