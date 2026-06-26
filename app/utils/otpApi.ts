import { PUBLIC_API_BASE_URL } from "@/app/config/constants";

export type OtpApiResponse = {
  success: boolean;
  message?: string;
};

export async function getOtpLiveFlag(): Promise<boolean> {
  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/otp/live`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { live?: boolean | string };
    const v = data.live;
    if (typeof v === "boolean") return v;
    if (typeof v === "string") return v.toLowerCase() === "true";
    return false;
  } catch {
    return false;
  }
}

export async function sendBackendOtp(mobileNumber: string): Promise<OtpApiResponse> {
  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/otp/send`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobileNumber }),
    });
    const data = (await res.json()) as OtpApiResponse;
    return { success: data.success === true, message: data.message };
  } catch {
    return { success: false, message: "Network error. Please try again." };
  }
}

export async function verifyBackendOtp(
  mobileNumber: string,
  otp: string,
): Promise<OtpApiResponse> {
  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/otp/verify`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobileNumber, otp }),
    });
    const data = (await res.json()) as OtpApiResponse;
    return { success: data.success === true, message: data.message };
  } catch {
    return { success: false, message: "Network error. Please try again." };
  }
}

export async function verifyFirebaseOtpOnServer(
  mobileNumber: string,
  idToken: string,
): Promise<OtpApiResponse> {
  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/otp/verify-firebase`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobileNumber, idToken }),
    });
    const data = (await res.json()) as OtpApiResponse;
    return { success: data.success === true, message: data.message };
  } catch {
    return { success: false, message: "Network error. Please try again." };
  }
}
