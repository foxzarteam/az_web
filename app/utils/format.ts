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
