export const PARTNER_KYC_STATUSES = ["pending", "submitted", "approved", "rejected"] as const;
export type PartnerKycStatus = (typeof PARTNER_KYC_STATUSES)[number];

export const ADMIN_KYC_STATUSES = ["pending", "approved", "rejected"] as const;
export type AdminKycStatus = (typeof ADMIN_KYC_STATUSES)[number];

export function normalizePartnerKycStatus(raw: unknown): PartnerKycStatus {
  const value = String(raw ?? "").trim().toLowerCase();
  if ((PARTNER_KYC_STATUSES as readonly string[]).includes(value)) {
    return value as PartnerKycStatus;
  }
  return "approved";
}

/** Admin table uses 3 statuses; submitted is treated as pending until approved. */
export function adminKycStatus(raw: unknown): AdminKycStatus {
  const status = normalizePartnerKycStatus(raw);
  if (status === "approved") return "approved";
  if (status === "rejected") return "rejected";
  return "pending";
}

export function partnerPathForKyc(status: PartnerKycStatus | null): string | null {
  if (status == null) return null;
  if (status === "approved") return "/partner/dashboard";
  if (status === "pending") return "/partner/kyc";
  return "/partner/waiting";
}
