import { chromium } from "playwright-core";

export interface CapturedPageData {
  title: string;
  description: string;
  h1Text: string;
  imageBuffer: Buffer;
}

export async function capturePageData(targetUrl: string): Promise {
  const BROWSERLESS_TOKEN = process.env.BROWSERLESS_API_KEY;
  if (!BROWSERLESS_TOKEN) {
    throw new Error("Missing BROWSERLESS_API_KEY in environment variables.");
  }

  // Connect via WebSocket to Browserless.io
  const browser = await chromium.connectOverCDP(
    `wss://chrome.browserless.io?token=${BROWSERLESS_TOKEN}`
  );

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  try {
    // Navigate and wait until network reaches idle state
    await page.goto(targetUrl, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // Dismiss generic cookie banners if present
    await page.evaluate(() => {
      const selectors = [
        '#onetrust-accept-btn-handler',
        '[aria-label="Accept cookies"]',
        'button:has-text("Accept")',
        'button:has-text("Allow all")',
      ];
      for (const selector of selectors) {
        const btn = document.querySelector(selector) as HTMLButtonElement;
        if (btn) {
          btn.click();
          break;
        }
      }
    });

    // Extract Page Metadata
    const title = await page.title();
    const description = (await page.getAttribute('meta[name="description"]', 'content')) || "";
    const h1Text = (await page.textContent('h1')) || "";

    // Capture Full-Page Screenshot
    const imageBuffer = await page.screenshot({
      fullPage: true,
      type: "png",
    });

    return {
      title: title.trim(),
      description: description.trim(),
      h1Text: h1Text.trim(),
      imageBuffer,
    };
  } finally {
    await context.close();
    await browser.close();
  }
}