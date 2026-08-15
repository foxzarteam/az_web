---
domain: apnizaroorat.com
origin: https://apnizaroorat.com
source_render: false
generated_at: 2026-08-15T16:43:14.690Z
findings: 2
source_evidence: .seoagent/audit/evidence.md
note: >-
  MACHINE-GENERATED findings report derived from the live-crawl evidence.
  The audit (audit/latest.md) BUILDS ON this file — it must carry every
  finding below forward (adding GSC context and prioritization on top),
  never re-derive or truncate the list. Do not hand-edit; re-run
  `seoagent crawl` to regenerate.
---

# Technical findings — apnizaroorat.com (from the live crawl)

Derived by code from `.seoagent/audit/evidence.md` (crawled https://apnizaroorat.com at 2026-08-15T16:43:14.690Z). Every finding below is **Confirmed** against that evidence. Reporting every one of these is non-negotiable — session economy trims bookkeeping, never findings.

## [Medium] 3 crawled pages are missing from sitemap.xml (12 URLs listed vs 15 pages discovered live)

**Confirmed** · Evidence: evidence.md § sitemap.xml — 12 URLs

These pages are live and reachable (the crawl fetched them via nav links or discovery) but sitemap.xml does not list them.

Affected URLs:
- https://apnizaroorat.com/customer/login
- https://apnizaroorat.com/agent
- https://apnizaroorat.com/customer/dashboard

**Why it matters:** Pages absent from the sitemap depend entirely on link discovery, get crawled less often, and signal an unmaintained sitemap to search engines.

**Suggested fix:** Regenerate the sitemap to include every canonical public URL (prefer a framework-generated sitemap so it stays current), then resubmit it to Search Console.

## [Medium] 3 pages serve no structured data (zero JSON-LD)

**Confirmed** · Evidence: evidence.md § Site-wide rollup — Pages with no structured data (zero JSON-LD)

The server HTML of these pages contains no `<script type="application/ld+json">` block at all.

Affected URLs:
- https://apnizaroorat.com/customer/login
- https://apnizaroorat.com/agent
- https://apnizaroorat.com/customer/dashboard

**Why it matters:** Structured data powers rich results and gives AI search engines an unambiguous machine-readable summary of the page; pages without it compete on prose alone.

**Suggested fix:** Add the JSON-LD type matching each page (Organization/WebSite on the homepage, Article/BlogPosting on posts, etc.) — only on the pages listed here; other crawled pages already serve schema.

## Already present on the live site — never recommend adding these

The crawl confirms the following already exist in the live server HTML. If the repo source lacks any of them, the **repo source is stale — the live page already serves it; reconcile the source** with what is live. Never phrase these as "add X".

- https://apnizaroorat.com/ — <title>, meta description, canonical, Open Graph tags, Twitter card, JSON-LD schema (Organization, FinancialService, WebSite, ItemList, WebPage, BreadcrumbList, OfferCatalog, LocalBusiness, FAQPage)
- https://apnizaroorat.com/products/personal-loan — <title>, meta description, canonical, Open Graph tags, Twitter card, JSON-LD schema (Organization, FinancialService, WebSite, ItemList, WebPage, BreadcrumbList, OfferCatalog, LoanOrCredit, FAQPage)
- https://apnizaroorat.com/products/insurance — <title>, meta description, canonical, Open Graph tags, Twitter card, JSON-LD schema (Organization, FinancialService, WebSite, ItemList, WebPage, BreadcrumbList, OfferCatalog, FAQPage)
- https://apnizaroorat.com/check-eligibility — <title>, meta description, canonical, Open Graph tags, Twitter card, JSON-LD schema (Organization, FinancialService, WebSite, ItemList, WebPage, BreadcrumbList, FAQPage)
- https://apnizaroorat.com/emi-calculator — <title>, meta description, canonical, Open Graph tags, Twitter card, JSON-LD schema (Organization, FinancialService, WebSite, ItemList, WebPage, BreadcrumbList, FAQPage)
- https://apnizaroorat.com/about — <title>, meta description, canonical, Open Graph tags, Twitter card, JSON-LD schema (Organization, FinancialService, WebSite, ItemList, AboutPage, BreadcrumbList, OfferCatalog)
- https://apnizaroorat.com/contact — <title>, meta description, canonical, Open Graph tags, Twitter card, JSON-LD schema (Organization, FinancialService, WebSite, ItemList, ContactPage, BreadcrumbList, LocalBusiness)
- https://apnizaroorat.com/become-partner — <title>, meta description, canonical, Open Graph tags, Twitter card, JSON-LD schema (Organization, FinancialService, WebSite, ItemList, WebPage, BreadcrumbList, OfferCatalog)
- https://apnizaroorat.com/terms-and-conditions — <title>, meta description, canonical, Open Graph tags, Twitter card, JSON-LD schema (Organization, FinancialService, WebSite, ItemList, WebPage, BreadcrumbList)
- https://apnizaroorat.com/privacy-policy — <title>, meta description, canonical, Open Graph tags, Twitter card, JSON-LD schema (Organization, FinancialService, WebSite, ItemList, WebPage, BreadcrumbList)
- https://apnizaroorat.com/refund-policy — <title>, meta description, canonical, Open Graph tags, Twitter card, JSON-LD schema (Organization, FinancialService, WebSite, ItemList, WebPage, BreadcrumbList)
- https://apnizaroorat.com/disclaimer — <title>, meta description, canonical, Open Graph tags, Twitter card, JSON-LD schema (Organization, FinancialService, WebSite, ItemList, WebPage, BreadcrumbList)
- https://apnizaroorat.com/customer/login — <title>, meta description, canonical, Open Graph tags, Twitter card
- https://apnizaroorat.com/agent — <title>, meta description, canonical, Open Graph tags, Twitter card
- https://apnizaroorat.com/customer/dashboard — <title>, meta description, canonical, Open Graph tags, Twitter card
