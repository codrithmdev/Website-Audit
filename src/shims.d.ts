declare module "@trigger.dev/sdk/v3";
declare module "@supabase/supabase-js";
declare module "ai";
declare module "@ai-sdk/openai";
declare module "@/lib/schemas/audit";
declare module "@react-pdf/renderer";
declare module "@/components/pdf/AuditPDFDocument";

declare module "playwright-core" {
  export const chromium: {
    connectOverCDP(endpointURL: string): Promise<{
      newContext(options: {
        viewport: { width: number; height: number };
        deviceScaleFactor: number;
      }): Promise<{
        newPage(): Promise<{
          goto(url: string, options: { waitUntil: string; timeout: number }): Promise<void>;
          evaluate(fn: () => void): Promise<void>;
          title(): Promise<string>;
          getAttribute(selector: string, attribute: string): Promise<string | null>;
          textContent(selector: string): Promise<string | null>;
          screenshot(options: { fullPage: boolean; type: string }): Promise<Buffer>;
        }>;
        close(): Promise<void>;
      }>;
      close(): Promise<void>;
    }>;
  };
}

declare module "lighthouse" {
  interface LighthouseResult {
    categories: {
      performance?: { score: number | null };
      accessibility?: { score: number | null };
      seo?: { score: number | null };
    };
    audits: Record<string, { displayValue?: string }>;
  }
  interface RunnerResult {
    lhr: LighthouseResult;
  }
  export default function lighthouse(
    url: string,
    options: { logLevel: string; output: string; onlyCategories: string[]; port: number },
  ): Promise<RunnerResult | null>;
}

declare module "chrome-launcher" {
  export interface LaunchedChrome {
    port: number;
    kill(): Promise<void>;
  }
  export function launch(options: { chromeFlags: string[] }): Promise<LaunchedChrome>;
}
