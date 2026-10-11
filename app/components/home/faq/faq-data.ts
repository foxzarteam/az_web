export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-personal-loan",
    question: "What is a Personal Loan?",
    answer:
      "A Personal Loan is money you can borrow to manage personal expenses such as medical emergencies, weddings, education, home renovation, travel, or any other financial need — without providing property or security as collateral.",
  },
  {
    id: "what-is-insurance",
    question: "What is Insurance?",
    answer:
      "Insurance is a financial protection plan that helps you manage unexpected expenses related to health, life, or vehicles. By paying a premium, you stay financially secure during emergencies and protect your family from sudden costs.",
  },
  {
    id: "who-can-apply",
    question: "Who can apply for a loan or insurance?",
    answer:
      "Any salaried or self-employed individual who meets our partner lenders' or insurers' eligibility criteria can apply through Apni Zaroorat. Requirements may vary by product, income, age, and credit profile.",
  },
  {
    id: "why-choose-apni-zaroorat",
    question: "Why should I choose Apni Zaroorat?",
    answer:
      "Apni Zaroorat is an A to Z finance solution for personal loans and insurance online — secure process, quick support, and minimal documentation. Check eligibility, calculate EMI, and find suitable solutions from one simple place.",
  },
];

/** Hub `/products` FAQ — unique copy (not the homepage set). */
export const PRODUCTS_HUB_FAQ_ITEMS: FaqItem[] = [
  {
    id: "hub-which-product",
    question: "Should I apply for a personal loan or insurance from this page?",
    answer:
      "Use this page to pick the product you need. Choose Personal Loan if you want funds for a personal expense. Choose Insurance if you want life, health, or motor cover. Each option opens a short digital form.",
  },
  {
    id: "hub-how-apply",
    question: "How do I apply online on Apni Zaroorat?",
    answer:
      "Select a product card, complete the form with basic details, and verify your mobile with OTP. You can then track application status from your customer dashboard.",
  },
  {
    id: "hub-tools",
    question: "Can I check EMI or eligibility before applying?",
    answer:
      "Yes. The products hub links to a free EMI calculator and an indicative eligibility check. Those tools do not affect your credit score.",
  },
  {
    id: "hub-why-az",
    question: "Why apply through Apni Zaroorat?",
    answer:
      "Apni Zaroorat is an A to Z finance platform for personal loans and insurance — one digital journey, partner lenders and insurers, and guided support after you submit.",
  },
];

export const ELIGIBILITY_FAQ_ITEMS: FaqItem[] = [
  {
    id: "eligibility-credit-score",
    question: "Does checking eligibility affect my credit score?",
    answer:
      "No. Our online eligibility check is an indicative tool only. It does not pull a hard credit enquiry from your bureau report, so using this calculator will not impact your credit score.",
  },
  {
    id: "eligibility-what-needed",
    question: "What details do I need to check personal loan eligibility?",
    answer:
      "You only need your monthly income and any existing EMI amount. In under a minute you get an indicative score and chance based on income comfort and EMI burden.",
  },
  {
    id: "eligibility-who-qualifies",
    question: "Who is generally eligible for a personal loan?",
    answer:
      "Salaried and self-employed individuals who meet partner lenders’ criteria can apply. Factors usually include stable income, manageable existing EMIs, age, and credit profile. Final approval always depends on the lender’s verification — our tool is a free first check only.",
  },
];

export const EMI_FAQ_ITEMS: FaqItem[] = [
  {
    id: "emi-how-calculated",
    question: "How is personal loan EMI calculated?",
    answer:
      "EMI is calculated on a reducing balance basis. Your monthly payment depends on the loan amount (principal), annual interest rate, and tenure in years. As you repay, interest is charged only on the remaining principal, which is the method most lenders use for personal loans.",
  },
  {
    id: "emi-what-affects",
    question: "What factors change my monthly EMI?",
    answer:
      "Higher loan amount or interest rate increases EMI. Longer tenure lowers monthly EMI but usually means more total interest over the full term. Use the calculator to compare combinations of amount, rate, and years before you apply.",
  },
  {
    id: "emi-indicative-only",
    question: "Is this EMI calculator the final loan amount I’ll pay?",
    answer:
      "No. This tool shows an indicative EMI only. Actual rate, tenure, fees, and monthly amount depend on the lender, your credit profile, and final sanction terms. Always check the offer documents before accepting a personal loan.",
  },
];

export const PERSONAL_LOAN_FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-personal-loan",
    question: "What is a Personal Loan?",
    answer:
      "A Personal Loan is money you can borrow for personal expenses such as medical needs, weddings, education, travel, or home renovation. It is usually unsecured, so you do not have to pledge property or gold. You apply online, and the amount must stay within the range shown for Personal Loan.",
  },
  {
    id: "what-is-home-loan",
    question: "What is a Home Loan?",
    answer:
      "A Home Loan helps you buy, build, or renovate a house. The amount is higher than a typical personal loan and is linked to the property and your income. Choose Home Loan on this page and enter an amount inside the range shown for that product.",
  },
  {
    id: "what-is-car-loan",
    question: "What is a Car Loan?",
    answer:
      "A Car Loan is used to buy a new or used car. You repay it in monthly instalments over a fixed tenure. Select Car Loan, then enter an amount within the Car Loan range shown in the form.",
  },
  {
    id: "what-is-business-loan",
    question: "What is a Business Loan?",
    answer:
      "A Business Loan provides funds for working capital, stock, equipment, or growing a business. Salaried and self-employed applicants can apply if they meet the lender’s criteria. The amount must fall inside the Business Loan range on this page.",
  },
  {
    id: "why-choose-apni-zaroorat",
    question: "Why choose Apni Zaroorat?",
    answer:
      "Apni Zaroorat works with a network of 100+ banks and NBFCs. If one lender does not fit, we help you find another that can approve your Personal, Home, Car, or Business loan — at a lower EMI and interest rate.",
  },
];

export const INSURANCE_FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-insurance",
    question: "What is Insurance?",
    answer:
      "Insurance is a financial protection plan that helps you manage unexpected expenses related to health, life, or vehicles. By paying a regular premium, you transfer risk to an insurer so you and your family are financially secure during emergencies.",
  },
  {
    id: "insurance-types",
    question: "What types of insurance can I apply for?",
    answer:
      "Through Apni Zaroorat, you can explore Life Insurance, Health Insurance, and Motor Insurance. Each plan is designed for a different need — protecting your family's future, covering medical costs, or securing your vehicle against damage and theft.",
  },
  {
    id: "why-buy-insurance",
    question: "Why should I buy insurance?",
    answer:
      "Insurance protects you from sudden financial stress. Health cover helps with hospital bills, life cover supports your family if something happens to you, and motor insurance covers repair or replacement costs after accidents. It is one of the simplest ways to stay prepared for life's uncertainties.",
  },
  {
    id: "how-to-choose-plan",
    question: "How do I choose the right insurance plan?",
    answer:
      "The right plan depends on your age, income, family size, and coverage needs. Share your basic details with us, and our partners will help you compare suitable options so you can pick a policy that fits your budget and protection goals.",
  },
  {
    id: "insurance-apply-process",
    question: "How do I apply for insurance on Apni Zaroorat?",
    answer:
      "Applying is simple. Fill in your basic details, select the insurance type you need, verify your information, and submit the application. Our team and insurance partners will guide you through the next steps until your policy is issued.",
  },
];

/** Hub `/tax-saving-calculator` FAQ */
export const TAX_FAQ_ITEMS: FaqItem[] = [
  {
    id: "tax-what-is",
    question: "What does this tax saving calculator do?",
    answer:
      "It compares the New and Old tax regimes for FY 2025-26 using Budget 2025 slabs, standard deduction, Section 87A rebate, and your 80C / 80D / NPS / home-loan inputs — then shows which option may cost less.",
  },
  {
    id: "tax-new-12l",
    question: "Is income up to ₹12 lakh tax-free in the new regime?",
    answer:
      "Under the new regime for FY 2025-26, Section 87A rebate can make tax nil when taxable income is up to ₹12 lakh. With ₹75,000 standard deduction, many salaried people with gross income up to about ₹12.75 lakh may pay zero tax — subject to other income types and rules.",
  },
  {
    id: "tax-80c",
    question: "What comes under Section 80C?",
    answer:
      "Common options include EPF, PPF, ELSS, life insurance premium, home-loan principal, and some tax-saving deposits — usually up to ₹1.5 lakh a year. These help mainly under the old regime.",
  },
  {
    id: "tax-which-regime",
    question: "Should I choose old or new regime?",
    answer:
      "If your deductions (80C, 80D, NPS, home loan interest) are high, old regime can win. If deductions are low, new regime often wins after Budget 2025. Use this calculator with your numbers, then confirm with a CA before filing.",
  },
  {
    id: "tax-estimate",
    question: "Is this tax calculator result final?",
    answer:
      "No. Results are estimates only — not a guaranteed tax liability. Special incomes, HRA, capital gains and other cases are not fully covered. Always verify with a qualified CA before filing your return.",
  },
];

/** Become a Partner — DSA program. */
export const DSA_FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-dsa",
    question: "What is DSA?",
    answer:
      "DSA means Direct Selling Agent. On Apni Zaroorat, a DSA partner refers customers for personal loans and insurance and earns commission when those applications are successfully approved.",
  },
  {
    id: "what-does-dsa-do",
    question: "What does a DSA do?",
    answer:
      "A DSA shares Apni Zaroorat loan and insurance products, helps customers apply with the right details, and tracks application status. Lending and insurance partners handle approval. You earn when a referred application is successfully completed.",
  },
  {
    id: "dsa-commission",
    question: "How much commission can I earn as a DSA?",
    answer:
      "Commission rates vary based on the loan type and amount. DSAs typically earn between 1% and 3% of the loan amount, and on the insurance policy, upon successful disbursement. Higher amounts and premium products may offer better commission rates.",
  },
  {
    id: "dsa-qualifications",
    question: "Do I need any specific qualifications to become a DSA?",
    answer:
      "No special degree or prior finance job is required. Register with your name, mobile number, and a 4-digit PIN. There is no joining fee and no investment. You can start after you agree to the Terms & Conditions and Privacy Policy.",
  },
  {
    id: "dsa-part-time",
    question: "Can I work as a DSA part-time?",
    answer:
      "Yes. You can work part-time from anywhere using your mobile. Share products and add customers in your own time, alongside a job or another business.",
  },
];
