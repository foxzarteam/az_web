import "server-only";
import { adminInternalHeadersFromSession } from "@/app/lib/admin/adminInternalKey";
import { nestApiBase } from "@/app/lib/server/nestBase";
import { normalizePartnerKycStatus, partnerPathForKyc, type PartnerKycStatus } from "./kyc";

/** Live KYC status. `null` means the API could not be read — do not lock the portal. */
export async function fetchPartnerKycStatus(): Promise<PartnerKycStatus | null> {
  const headers = await adminInternalHeadersFromSession();
  const base = nestApiBase();
  if (!headers || !base) return null;
  try {
    const res = await fetch(`${base}/api/users/agent/kyc-status`, {
      headers,
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as {
      data?: { kyc_status?: string };
    };
    if (!res.ok) return null;
    return normalizePartnerKycStatus(data.data?.kyc_status);
  } catch {
    return null;
  }
}

export async function partnerHomePath(): Promise<string> {
  return partnerPathForKyc(await fetchPartnerKycStatus()) ?? "/partner/dashboard";
}
