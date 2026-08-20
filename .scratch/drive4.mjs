import { chromium } from "playwright-core";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGE ERR:", err.message));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForSelector("text=Stop losing website visitors", { timeout: 30000 });

await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll("button")).filter((b) =>
    b.textContent?.trim() === "Sign in",
  );
  console.log("MATCHED BUTTONS:", btns.length);
  btns.forEach((b) => console.log("outerHTML:", b.outerHTML.slice(0, 200)));
});

const btn = page.getByRole("button", { name: "Sign in", exact: true }).first();
await btn.click({ force: true });
await page.waitForTimeout(800);

const dialogCount = await page.locator('[role="dialog"]').count();
console.log("dialog count after click:", dialogCount);

// check react fiber props directly
const hasHandler = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll("button")).filter((b) =>
    b.textContent?.trim() === "Sign in",
  );
  if (!btns[0]) return "no button";
  const key = Object.keys(btns[0]).find((k) => k.startsWith("__reactProps$"));
  if (!key) return "no react props key found";
  const props = btns[0][key];
  return typeof props.onClick;
});
console.log("onClick type:", hasHandler);

await browser.close();
