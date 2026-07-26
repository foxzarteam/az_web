export async function checkCustomerMobile(mobileNumber: string): Promise<{
  exists: boolean;
  message?: string;
}> {
  const res = await fetch("/api/customer/auth/check-mobile", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ mobileNumber }),
  });
  const data = (await res.json()) as { exists?: boolean; error?: string };
  if (!res.ok) {
    return { exists: false, message: data.error || "Could not verify mobile number." };
  }
  return { exists: Boolean(data.exists) };
}

export async function customerLogin(mobileNumber: string, idToken: string): Promise<{
  ok: boolean;
  message?: string;
}> {
  const res = await fetch("/api/customer/auth/login", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ mobileNumber, idToken }),
  });
  const data = (await res.json()) as { ok?: boolean; error?: string };
  if (!res.ok || !data.ok) {
    return { ok: false, message: data.error || "Login failed. Please try again." };
  }
  return { ok: true };
}

export async function customerLogout(): Promise<void> {
  await fetch("/api/customer/auth/logout", { method: "POST" });
}
