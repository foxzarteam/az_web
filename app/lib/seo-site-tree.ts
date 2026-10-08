export type SiteTreeNode = {
  name: string;
  path: string;
  description: string;
  children?: SiteTreeNode[];
};

/** Canonical site tree for sitelinks, JSON-LD, footer map. */
export const SITE_TREE: SiteTreeNode[] = [
  {
    name: "Home",
    path: "/",
    description: "Apni Zaroorat — apply for personal loans and insurance online in India.",
  },
  {
    name: "Products",
    path: "/products",
    description: "Personal loans and insurance — compare and apply online with Apni Zaroorat.",
    children: [
      {
        name: "Personal Loan",
        path: "/products/personal-loan",
        description:
          "Apply for personal loan online up to ₹50 lakh — quick digital process with Apni Zaroorat.",
      },
      {
        name: "Insurance",
        path: "/products/insurance",
        description:
          "Compare life, health and motor insurance online with guided digital applications.",
      },
    ],
  },
  {
    name: "Banking Partners",
    path: "/banking-partners",
    description: "Banks and lenders partnered with Apni Zaroorat for personal loans.",
  },
  {
    name: "Tools",
    path: "/emi-calculator",
    description: "Free financial tools — EMI, eligibility and tax saving calculators.",
    children: [
      {
        name: "EMI Calculator",
        path: "/emi-calculator",
        description: "Free personal loan EMI calculator — monthly EMI, interest, and total repayment.",
      },
      {
        name: "Check Eligibility",
        path: "/check-eligibility",
        description: "Free personal loan eligibility check online — no credit score impact.",
      },
      {
        name: "Tax Saving Calculator",
        path: "/tax-saving-calculator",
        description:
          "Free tax saving calculator — compare New vs Old regime for FY 2025-26 with 80C, 80D and more.",
      },
    ],
  },
  {
    name: "About Us",
    path: "/about",
    description: "About Us — Apni Zaroorat’s mission, team, and finance services across India.",
    children: [
      {
        name: "About Us",
        path: "/about",
        description: "Know Apni Zaroorat — mission, team, and A to Z finance solutions across India.",
      },
      {
        name: "Contact Us",
        path: "/contact",
        description:
          "Get support for loans, insurance and applications across India. Call, email, or visit our Jaipur office.",
      },
      {
        name: "Become a Partner",
        path: "/become-partner",
        description: "Join Apni Zaroorat as a partner — earn by referring personal loan and insurance leads.",
      },
    ],
  },
];

function flattenSiteTree(nodes: SiteTreeNode[]): SiteTreeNode[] {
  const out: SiteTreeNode[] = [];
  for (const node of nodes) {
    const samePathAsChild = node.children?.some((child) => child.path === node.path);
    if (!samePathAsChild && (node.path !== "/" || node.name !== "Home")) {
      out.push(node);
    }
    if (node.children?.length) {
      out.push(...flattenSiteTree(node.children));
    }
  }
  return out;
}

export const INDEXABLE_ROUTES = [
  { path: "/", changeFrequency: "daily" as const, priority: 1 },
  { path: "/products", changeFrequency: "daily" as const, priority: 0.99 },
  { path: "/products/personal-loan", changeFrequency: "daily" as const, priority: 0.98 },
  { path: "/products/insurance", changeFrequency: "daily" as const, priority: 0.97 },
  { path: "/check-eligibility", changeFrequency: "daily" as const, priority: 0.96 },
  { path: "/emi-calculator", changeFrequency: "daily" as const, priority: 0.96 },
  { path: "/tax-saving-calculator", changeFrequency: "daily" as const, priority: 0.96 },
  { path: "/banking-partners", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/about", changeFrequency: "weekly" as const, priority: 0.92 },
  { path: "/contact", changeFrequency: "weekly" as const, priority: 0.92 },
  { path: "/become-partner", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/terms-and-conditions", changeFrequency: "monthly" as const, priority: 0.35 },
  { path: "/privacy-policy", changeFrequency: "monthly" as const, priority: 0.35 },
  { path: "/refund-policy", changeFrequency: "monthly" as const, priority: 0.3 },
  { path: "/disclaimer", changeFrequency: "monthly" as const, priority: 0.3 },
] as const;

export const SITELINK_PAGES = flattenSiteTree(SITE_TREE);
