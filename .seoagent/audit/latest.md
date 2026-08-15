---
domain: apnizaroorat.com
audited_at: 2026-08-15T16:30:00Z
pages_audited: 15
critical: 0
high: 4
medium: 6
low: 3
live_origin: https://apnizaroorat.com
indexing_coverage: unverified
---

# Audit — apnizaroorat.com

Live crawl: `seoagent crawl --url https://apnizaroorat.com` → `.seoagent/audit/evidence.md` (15/15 pages, `capture_complete: true`, `source_render: false`). Machine baseline: `.seoagent/audit/findings.md` (2 findings — both carried forward below with severity re-grade). Indexing coverage **not verified** (needs free `seoagent login` + GSC).

## Critical

_(none)_

`page_renders_empty` on `/customer/login` and `/customer/dashboard` (21 body words each) is **not** treated as critical for organic SEO: both paths are `Disallow` in live robots.txt and are auth shells by design. Evidence: evidence.md § those URLs + robots.txt Disallow `/customer/`.

## High

- [ ] **No blog or article content in the live sitemap (0 posts)** — organic growth is capped to a thin set of product/tool pages. (Confirmed)
  - Evidence: evidence.md § sitemap.xml — "12 URLs, 0 blog/article posts"
  - Recommendation: Launch a content hub (personal loan guides, eligibility explainers, insurance comparisons) with pillar → sub-pillar → long-tail structure; add posts to the sitemap generator once published.

- [x] **Title too long on key money pages (truncates in SERPs).** (Confirmed)
  - https://apnizaroorat.com/check-eligibility — title 72 chars: `Check Personal Loan Eligibility Online | Free Calculator | Apni Zaroorat`
  - https://apnizaroorat.com/emi-calculator — title 67 chars: `Personal Loan EMI Calculator Online | Free EMI Tool | Apni Zaroorat`
  - https://apnizaroorat.com/products/insurance — title 65 chars: `Insurance Online | Life, Health & Motor Insurance | Apni Zaroorat`
  - Evidence: evidence.md § each URL — title lines above
  - Recommendation: Shorten each to 50–60 characters with primary keyword near the start (e.g. `Check Personal Loan Eligibility | Apni Zaroorat`).
  - Fixed in source (2026-08-15): insurance, eligibility, and EMI titles are now 42–48 characters; generated title, Open Graph, and Twitter title values match.

- [x] **Thin commercial / trust pages under ~300 body words.** (Confirmed)
  - `/contact` — 64 words; `/become-partner` — 149; `/about` — 256; `/check-eligibility` — 276; `/emi-calculator` — 287
  - Evidence: evidence.md § each URL — body word counts
  - Recommendation: Expand contact with location/hours/support channels copy; deepen partner program value props; add extractable answer blocks on eligibility + EMI pages targeting their primary keywords.
  - Fixed in source (2026-08-15): added concise support, partner-program, eligibility, EMI, and About copy with relevant internal links. Contact remains a utility page, so it was improved without padding it to an arbitrary word count.

- [x] **`/agent` is publicly reachable with advisor content but blocked from crawling.** (Confirmed)
  - Evidence: evidence.md § robots.txt — `Disallow: /agent` / `/agent/`; evidence.md § https://apnizaroorat.com/agent — HTTP 200, 167 words, title `Ananya Sharma | Advisor | Apni Zaroorat`
  - Recommendation: If this is an intentional private agent portal, keep Disallow and do not sitemap it. If it is meant to rank as an advisor landing page, remove `/agent` from robots Disallow and add it to the public sitemap with Person/ProfilePage schema.
  - Resolved as intentional (2026-08-15): source metadata sets `noIndex: true`; robots and sitemap keep the advisor route private.

## Medium

- [x] **3 crawled pages are missing from sitemap.xml (12 URLs listed vs 15 pages discovered live)** — carried from findings.md. (Confirmed — intentional for private routes)
  - Affected: `/customer/login`, `/agent`, `/customer/dashboard`
  - Evidence: evidence.md § sitemap.xml — 12 URLs; findings.md § same
  - Re-grade: **Do not add `/customer/*` to the sitemap** while robots Disallows them (correct). Decide separately for `/agent` (see High finding above). Repo also has `/google4decbda103666be2` (404) — keep out of sitemap.
  - Resolved as intentional (2026-08-15): local production-render verification confirms the sitemap still contains 12 public URLs and no `/customer/*` or `/agent` routes.

- [x] **3 pages serve no structured data (zero JSON-LD)** — carried from findings.md. (Confirmed)
  - Affected: `/customer/login`, `/agent`, `/customer/dashboard`
  - Evidence: evidence.md § Site-wide rollup — Pages with no structured data
  - Re-grade: Skip schema on auth shells. If `/agent` becomes public/indexable, add `Person` + `WebPage` JSON-LD there only.
~~  - Resolved as not applicable (2026-08-15): all three routes remain private/noindex; adding rich-result schema would conflict with their indexability policy.~~ → CORRECTION (verify-recs): the live page (https://apnizaroorat.com/) already serves JSON-LD (Organization, Financialservice, WebSite, Itemlist, WebPage, BreadcrumbList, Offercatalog, Localbusiness, FAQPage) per evidence.md — this was a repo-source reconciliation, not a net-new addition.

- [x] **Duplicate titles on customer auth URLs.** (Confirmed)
  - `/customer/login` and `/customer/dashboard` both use `Check Personal Loan Application Status | Apni Zaroorat`
  - Evidence: evidence.md § both URLs — identical title
  - Recommendation: Low SEO impact (Disallow), but differentiate titles for UX/bookmarks if kept crawlable later.
  - Resolved as not applicable (2026-08-15): unauthenticated dashboard requests redirect to the login page, and both routes remain noindex.

- [x] **Dashboard self-canonical points at login.** (Confirmed)
  - Evidence: evidence.md § https://apnizaroorat.com/customer/dashboard — canonical: `https://apnizaroorat.com/customer/login/`
  - Recommendation: Acceptable while both are non-indexable; if dashboard ever becomes indexable, use a self-referencing canonical.
  - Resolved as intentional (2026-08-15): dashboard is authenticated and noindex; unauthenticated requests resolve to login.

- [x] **Contact page body is form-heavy with little extractable answer content.** (Confirmed)
  - Evidence: evidence.md § https://apnizaroorat.com/contact — 64 body words
  - Recommendation: Add a short FAQ or support-topics block (hours, response time, what to include in a query) for AI extractability and local trust.
  - Fixed in source (2026-08-15): added a support-topics block with safety guidance and contextual links to loan and insurance services.

- [ ] **Indexing coverage not verified.** (Hypothesis until GSC connected)
  - Evidence: `seoagent indexing` requires login; no `.seoagent/audit/indexing.md`
  - Recommendation: Run `seoagent login`, connect Search Console, then `seoagent indexing` to confirm which of the 12 sitemap URLs Google has indexed.

## Low

- [x] **Stale Google site-verification HTML path returns 404.** (Confirmed)
  - Evidence: pages.md § https://apnizaroorat.com/google4decbda103666be2 — Status 404
  - Recommendation: Remove dead verification asset from the repo/deploy, or restore the file if still needed for Search Console.
  - Fixed in source / pending deploy (2026-08-15): the production build serves the existing verification file at the expected path with HTTP 200.

- [ ] **OKF / AI knowledge bundle not published at a well-known URL.** (Confirmed absent via fetch)
  - Evidence: live fetch of `https://apnizaroorat.com/.well-known/okf.json` failed; `llms.txt` is present (200)
  - Recommendation: Optional AEO upgrade — publish an OKF bundle; `llms.txt` already covers basic AI discovery.

- [x] **Privacy Policy title is only 30 characters (borderline short).** (Confirmed)
  - Evidence: evidence.md § https://apnizaroorat.com/privacy-policy — title: `Privacy Policy | Apni Zaroorat`
  - Recommendation: Optional expand to include brand + intent (e.g. data handling for loan applications).
  - Fixed in source (2026-08-15): title is now `Privacy Policy & Data Protection | Apni Zaroorat`.

## What's Working

- HTTPS with http→https and www→apex 308 redirects (Confirmed via live redirect checks)
- robots.txt present with Sitemap declaration; private paths `/admin`, `/api`, `/customer`, `/agent` Disallowed (Evidence: evidence.md § robots.txt)
- Sitemap healthy: 12 public URLs, lastmod present, **no private URL leakage** (`seoagent sitemap`)
- All 15 crawled pages: title, meta description, canonical, Open Graph, Twitter card present (Evidence: rollup + per-page "Already present")
- Rich JSON-LD on public pages: Organization, FinancialService, WebSite, FAQPage, LoanOrCredit, LocalBusiness, BreadcrumbList, etc. (Evidence: findings.md "Already present")
- Single H1 per page; all crawled images have alt text
- No orphan public pages (`seoagent internal-links`)
- `llms.txt` live at https://apnizaroorat.com/llms.txt (200)
- Homepage substantive (~988 words) with FAQ section

## Notes for fix sessions (not live-state claims)

- Prefer shortening meta titles on eligibility / EMI / insurance before large content builds.
- Do **not** recommend adding Organization/WebSite/FAQ schema to pages that already serve them (see findings.md "Already present").
- Local `NEXT_PUBLIC_SITE_URL` in `.env.local` points at localhost for dev — production must keep apex `https://apnizaroorat.com` (Hypothesis for deploy config; live site already correct).
