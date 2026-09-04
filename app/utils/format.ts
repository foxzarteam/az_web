export function formatRupee(amount: number): string {
  const roundedAmount = Math.round(amount);
  const amountStr = roundedAmount.toString();
  
  if (amountStr.length <= 3) {
    return `₹${amountStr}`;
  }
  
  let result = amountStr.slice(-3);
  let i = amountStr.length - 3;
  
  while (i > 0) {
    const chunk = amountStr.slice(Math.max(0, i - 2), i);
    result = `${chunk},${result}`;
    i -= 2;
  }
  
  return `₹${result}`;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

/** IST clock, no locale/ICU differences — safe for SSR hydration. */
export function formatAdminDateTime(value: unknown): string {
  if (value == null || value === "") return "—";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  const istMs = d.getTime() + 5.5 * 60 * 60 * 1000;
  const ist = new Date(istMs);
  const dd = String(ist.getUTCDate()).padStart(2, "0");
  const mm = String(ist.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = String(ist.getUTCFullYear());
  const hh = String(ist.getUTCHours()).padStart(2, "0");
  const min = String(ist.getUTCMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy}, ${hh}:${min}`;
}
