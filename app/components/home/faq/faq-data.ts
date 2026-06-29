export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "who-can-apply",
    question: "Who can apply for a personal loan?",
    answer:
      "Any salaried or self-employed individual who meets the eligibility criteria of our partner lenders can apply for a personal loan through our platform.",
  },
  {
    id: "approval-time",
    question: "How long does the loan approval process take?",
    answer:
      "Most personal loan applications are processed within 24 hours, subject to successful document verification and partner lender approval.",
  },
  {
    id: "how-to-apply",
    question: "How do I apply for a personal loan?",
    answer:
      "Applying is simple. Enter your mobile number, complete the basic details, upload the required documents, and submit your application. Once verified, we'll connect you with suitable lending partners based on your eligibility.",
  },
  {
    id: "loan-amount",
    question: "How much personal loan can I get?",
    answer:
      "Loan amounts depend on your income, credit profile, and lender eligibility. Eligible applicants may receive loan offers ranging from ₹25,000 up to ₹10 Lakhs*.",
  },
];
