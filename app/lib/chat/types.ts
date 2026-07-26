export type ChatAnswerItem = {
  id: string;
  label: string;
};

/** Shape stored in public.chat.answers (jsonb). */
export type ChatAnswers = {
  employment: ChatAnswerItem;
  salary: ChatAnswerItem;
  existing_emi: ChatAnswerItem;
  loan_amount: ChatAnswerItem;
};

export type ChatStatus =
  | "started"
  | "otp_sent"
  | "otp_verified"
  | "lead_submitted"
  | "abandoned";

export type ChatRow = {
  id: string;
  mobile_number: string | null;
  answers: ChatAnswers;
  status: ChatStatus;
  lead_id: string | null;
  created_at: string;
  updated_at: string;
};

/** Map chat loan_amount option id → slider default (rupees). */
export function chatLoanAmountToRupees(loanAmountId: string): number {
  switch (loanAmountId) {
    case "under-2":
      return 1_50_000;
    case "2-5":
      return 3_50_000;
    case "5-10":
      return 7_50_000;
    case "above-10":
      return 10_00_000;
    default:
      return 5_00_000;
  }
}
