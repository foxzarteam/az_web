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
