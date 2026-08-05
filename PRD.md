# Product Requirements Document (PRD)
# Codrithm Audit AI
Version: 1.0 (MVP)

## 1. Overview
Codrithm Audit AI is an AI-assisted website auditing platform designed to help businesses understand the quality of their website while helping Codrithm generate qualified leads through value-first audits.

## 2. Problem Statement
Many small and medium businesses have outdated, slow, or poorly optimized websites but do not know what is wrong or how to improve them. Existing audit tools focus on technical metrics and rarely provide actionable business recommendations.

## 3. Goals

### Business Goals
- Generate qualified leads.
- Demonstrate Codrithm's technical expertise.
- Reduce manual audit time.
- Create a repeatable client acquisition process.

### Product Goals
- Analyze websites in under 60 seconds.
- Produce clear and actionable recommendations.
- Export professional PDF reports.
- Support future automation workflows.

## 4. Target Users
- Small & Medium Businesses
- Startup Founders
- Agencies
- Marketing Teams
- Internal Codrithm Sales Team

## 5. MVP Scope

### Input
- Website URL

### Output
- Overall Website Score
- Performance Summary
- SEO Summary
- Accessibility Summary
- Best Practices Summary
- Homepage Screenshot
- AI Recommendations
- Downloadable PDF Report

## 6. Functional Requirements

### URL Validation
- Validate format.
- Reject invalid URLs.
- Handle edge cases: unreachable sites, anti-bot protection, auth-required pages, timeout after 30s.

### Error Handling
- Return clear error messages for blocked/inaccessible sites.
- Log failure reasons for debugging.
- Provide retry option for transient failures.

### Screenshot Engine
- Capture full-page homepage screenshot.

### Lighthouse Analysis
Collect:
- Performance
- Accessibility
- Best Practices
- SEO

### Metadata
Collect:
- Title
- Meta Description
- HTTPS Status

### AI Analysis
Generate:
- Executive Summary
- Design Review
- UX Review
- CTA Review
- Trust Signals
- Branding Review
- Actionable Recommendations

### Report
Display:
- Scores
- Findings
- Recommendations
- Overall Grade

Export as PDF.

## 7. Non-Functional Requirements
- Responsive UI
- Secure URL validation
- Modular architecture
- Fast processing (target: 60s, but validate with spike test)
- Easy maintenance
- Rate limiting (max 10 audits/hour per IP to prevent abuse)
- Basic logging & observability (audit success/failure, processing time)
- Cost controls (set OpenAI token limits per audit, track API spend)

## 8. User Flow
1. User enters website URL.
2. System validates URL.
3. Capture screenshot.
4. Run Lighthouse.
5. Collect metadata.
6. Generate AI insights.
7. Calculate score.
8. Display report.
9. Allow PDF export.

## 9. Success Metrics
- Audit completion rate
- Average processing time
- PDF downloads
- Leads generated
- Meetings booked
- Client conversions

## 10. Cost Model (MVP Estimates)
| Component | Cost Driver | Estimate |
|-----------|-------------|----------|
| OpenAI API | Tokens per audit | ~$0.05–0.15/audit |
| Vercel | Hosting & serverless | Free tier → Pro ($20/mo) |
| Supabase | Database reads/writes | Free tier → Pro ($25/mo) |
| Lighthouse | Runs locally | Free |
| Playwright | Screenshot capture | Free |

**Budget cap:** Set monthly OpenAI spend limit. Monitor cost per lead.

## 10. Future Features
- User accounts
- Audit history
- White-label reports
- Industry-specific audits
- Competitor comparison
- Scheduled audits
- Email delivery
- CRM integration
- n8n automation
- Public API

## 11. Recommended Technology
Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:
- Next.js API Routes

Database (Supabase PostgreSQL):
- `audits` table: id, url, scores, ai_insights, pdf_url, created_at
- `usage` table: ip, audit_count, last_audit_at (for rate limiting)

Automation:
- n8n

AI:
- OpenAI API (gpt-4o-mini for cost efficiency)

Screenshot:
- Playwright

Performance:
- Lighthouse

Deployment:
- Vercel

## 12. Out of Scope (MVP)
- Authentication
- Billing
- Team workspaces
- Multi-language support
- Browser extension
- Mobile app

## 13. Risks
- AI hallucinations → Mitigate with structured prompts and output validation
- Slow third-party analysis → Run Playwright/Lighthouse in parallel, not sequentially
- Rate limiting → Implement per-IP limits in MVP
- Large websites increasing processing time → Cap at top 5 pages for MVP
- 60-second target may be ambitious → Validate with spike test before full build

## 14. Definition of Done
- User can submit a URL.
- Audit completes successfully.
- Report is displayed.
- PDF can be downloaded.
- Recommendations are useful and actionable.
