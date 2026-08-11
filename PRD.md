# Product Requirements Document (PRD)

# Codrithm Audit AI

**Version:** 1.1 (Differentiated MVP)
**Purpose:** Define the product requirements for an AI-assisted website growth audit platform that is clearly differentiated from generic SEO crawlers and lead-magnet audit tools.

---

## 1. Product Overview

Codrithm Audit AI is an AI-assisted website growth audit platform that helps businesses understand why their website is underperforming and what to fix first. Unlike traditional SEO tools that mainly surface technical issues, Codrithm focuses on **business impact, buyer psychology, conversion friction, and sales-ready recommendations**.

The product is designed to produce a fast, professional audit report that can be used both by website owners and by Codrithm's sales team to generate qualified leads.

---

## 2. Problem Statement

Most website audit tools fall into one of two categories:

1. Technical crawlers that expose many issues but do not explain business impact.
2. Lead-gen audit tools that generate simple reports but do not provide deep, actionable insights.

Small and medium businesses often do not know:

- why visitors leave without converting,
- what is hurting trust on the homepage,
- whether their messaging is clear,
- which fixes matter most right now.

There is a gap for a product that combines technical analysis with conversion and trust analysis, then presents the result in a concise, sales-ready format.

---

## 3. Product Positioning

### 3.1 Unique Positioning Statement

Codrithm Audit AI is a **website growth audit** tool that turns a URL into a prioritized action plan focused on conversions, trust, UX, and SEO.

### 3.2 Differentiation Goals

The product must be clearly different from competitors by:

- emphasizing **business outcomes** instead of only scores,
- using **evidence-backed recommendations** tied to screenshots and page content,
- prioritizing only the **most important fixes**,
- generating a **premium PDF report** suitable for sales and client sharing,
- speaking in plain language that founders and marketers can understand.

### 3.3 Non-Negotiable Uniqueness Rules

The MVP should not feel like a generic crawler dashboard. It must:

- explain the issue,
- show evidence,
- state the business impact,
- recommend the next best action.

---

## 4. Goals

### Business Goals

- Generate qualified leads.
- Demonstrate Codrithm's expertise in website growth and conversion strategy.
- Reduce manual audit time.
- Create a repeatable client acquisition process.

### Product Goals

- Analyze websites in under 60 seconds.
- Produce clear, actionable recommendations.
- Export professional PDF reports.
- Support future automation workflows.

### Differentiation Goals

- Deliver a report that is more useful than a standard SEO audit.
- Highlight conversion, trust, and messaging issues in addition to technical issues.
- Make the audit feel like a consultant review, not a crawler dump.

---

## 5. Target Users

- Small and medium businesses.
- Startup founders.
- Agencies.
- Marketing teams.
- Internal Codrithm sales team.

---

## 6. MVP Scope

### Input

- Website URL.

### Output

- Overall Website Growth Score.
- Performance Summary.
- SEO Summary.
- Accessibility Summary.
- Best Practices Summary.
- Trust Signals Summary.
- UX / Conversion Summary.
- Homepage Screenshot.
- AI Recommendations.
- Downloadable PDF Report.

### Deliberate MVP Focus

The first version should focus on one website landing experience, preferably the homepage or top landing page, rather than full-site crawling.

---

## 7. Core Differentiators

### 7.1 Business-First Analysis

The audit should explain how website issues affect leads, trust, and conversion probability.

### 7.2 Evidence-Backed Findings

Each recommendation should reference visible evidence such as:

- screenshot annotation,
- missing CTA,
- weak headline,
- broken trust signals,
- accessibility issue,
- slow-loading element.

### 7.3 Prioritized Recommendations

The system should return only the top issues that matter most, ranked by likely impact and urgency.

### 7.4 Plain-Language Reporting

The report should avoid overly technical language and present findings in terms that founders, marketers, and sales teams can act on immediately.

### 7.5 Sales-Ready PDF

The PDF should look polished enough to send directly to a prospect or include in a sales follow-up.

---

## 8. Functional Requirements

### 8.1 URL Validation

- Validate URL format.
- Reject invalid URLs.
- Handle unreachable sites.
- Handle anti-bot protection.
- Handle auth-required pages.
- Timeout after 30 seconds.

### 8.2 Error Handling

- Return clear error messages for blocked or inaccessible sites.
- Log failure reasons for debugging.
- Provide retry option for transient failures.

### 8.3 Screenshot Engine

- Capture full-page homepage screenshot.
- Support annotation of key visual areas in the report.

### 8.4 Lighthouse Analysis

Collect:

- Performance.
- Accessibility.
- Best Practices.
- SEO.

### 8.5 Metadata Collection

Collect:

- Title.
- Meta Description.
- HTTPS Status.
- Primary CTA presence.
- Trust signal presence.

### 8.6 AI Analysis

Generate:

- Executive Summary.
- Design Review.
- UX Review.
- CTA Review.
- Trust Signals Review.
- Branding Review.
- Actionable Recommendations.
- Business Impact Notes.

### 8.7 Report Generation

Display:

- Scores.
- Findings.
- Recommendations.
- Overall Grade.
- Business Impact Summary.
- Export as PDF.

---

## 9. Report Structure

The report must follow this structure:

1. Executive Summary.
2. Overall Website Growth Score.
3. Top 5 Issues.
4. Evidence Screenshots.
5. SEO Findings.
6. UX and Conversion Findings.
7. Trust and Branding Findings.
8. Accessibility Findings.
9. Priority Fix List.
10. Next Step / CTA.

### Report Differentiation Rules

- Do not overwhelm the user with too many issues.
- Do not present raw technical data without interpretation.
- Do not hide business recommendations inside technical jargon.
- Each issue should have a fix recommendation and expected value.

---

## 10. User Flow

1. User enters a website URL.
2. System validates the URL.
3. System captures screenshot.
4. System runs Lighthouse.
5. System collects metadata.
6. System generates AI insights.
7. System calculates growth score.
8. System displays report.
9. User downloads PDF.

---

## 11. Success Metrics

- Audit completion rate.
- Average processing time.
- PDF downloads.
- Leads generated.
- Meetings booked.
- Client conversions.
- Percent of users who find the report actionable.

---

## 12. Non-Functional Requirements

### 12.1 Responsive UI

The interface must work well on desktop and mobile.

### 12.2 Secure URL Validation

Protect against invalid input and unsafe URL handling.

### 12.3 Modular Architecture

Separate capture, analysis, AI, scoring, and reporting into independent modules.

### 12.4 Fast Processing

Target processing time is 60 seconds. Validate with spike testing.

### 12.5 Easy Maintenance

Use maintainable code, clear contracts, and reusable components.

### 12.6 Rate Limiting

Limit to 10 audits per hour per IP.

### 12.7 Logging and Observability

Track audit success/failure, processing time, and major failure reasons.

### 12.8 Cost Controls

Set token limits per audit and monitor API spend.

---

## 13. Success Criteria for Uniqueness

The product will be considered differentiated if users say:

- "This tells me what to fix and why it matters."
- "This feels like a consultant review."
- "I can send this to a client or prospect."
- "This is more useful than a standard SEO audit."

---

## 14. Cost Model (MVP Estimates)

| Component  |            Cost Driver |                 Estimate |
| ---------- | ---------------------: | -----------------------: |
| OpenAI API |       Tokens per audit |    ~$0.05–0.15 per audit |
| Vercel     | Hosting and serverless | Free tier → Pro ($20/mo) |
| Supabase   |  Database reads/writes | Free tier → Pro ($25/mo) |
| Lighthouse |           Runs locally |                     Free |
| Playwright |     Screenshot capture |                     Free |

Budget cap: set a monthly OpenAI spend limit and monitor cost per lead.

---

## 15. Future Features

- User accounts.
- Audit history.
- White-label reports.
- Industry-specific audits.
- Competitor comparison.
- Scheduled audits.
- Email delivery.
- CRM integration.
- n8n automation.
- Public API.

---

## 16. Recommended Technology

### Frontend

- Next.js.
- TypeScript.
- Tailwind CSS.
- shadcn/ui.

### Backend

- Next.js API Routes.

### Database

- Supabase PostgreSQL.
- `audits` table: id, url, scores, ai_insights, pdf_url, created_at.
- `usage` table: ip, audit_count, last_audit_at.

### Automation

- n8n.

### AI

- OpenRouter AI using `google/gemma-4-26b-a4b-it:free` (free vision model).

### Screenshot

- Playwright.

### Performance

- Lighthouse.

### Deployment

- Vercel.

---

## 17. Out of Scope (MVP)

- Authentication.
- Billing.
- Team workspaces.
- Multi-language support.
- Browser extension.
- Mobile app.

---

## 18. Risks

- AI hallucinations, mitigate with structured prompts and output validation.
- Slow third-party analysis, run Playwright and Lighthouse in parallel.
- Rate limiting, implement per-IP limits in MVP.
- Large websites increasing processing time, cap to one page for MVP.
- 60-second target may be ambitious, validate with a spike test before full build.

---

## 19. Definition of Done

- User can submit a URL.
- Audit completes successfully.
- Report is displayed.
- PDF can be downloaded.
- Recommendations are useful, actionable, and evidence-backed.
- The report clearly feels different from a generic SEO crawler.
