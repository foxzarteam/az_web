import type { CreateLeadResponse } from "@/app/lib/leads/types";

/** Shared Nest lead endpoints response parser (apply / start / complete). */
export function parseLeadApiResponse(
  response: Response,
  raw: string,
): CreateLeadResponse {
  let data: {
    success?: boolean | string | number;
    message?: string | string[];
    data?: unknown;
    error?: string | string[];
    statusCode?: number;
  } = {};
  if (raw) {
    try {
      data = JSON.parse(raw) as typeof data;
    } catch {
      const looksLikeHtml = /^\s*</.test(raw);
      return {
        success: false,
        message: looksLikeHtml
          ? `Lead API returned a web page (HTTP ${response.status}), not JSON. Usually NEXT_PUBLIC_API_URL is wrong or missing at build time — set it to your backend (e.g. https://your-api.vercel.app) and rebuild.`
          : `Server returned an invalid response (HTTP ${response.status}). Check NEXT_PUBLIC_API_URL.`,
      };
    }
  }

  const pickMsg = (m: unknown): string | undefined => {
    if (typeof m === "string" && m.trim()) return m;
    if (Array.isArray(m)) {
      const s = m.filter((x) => typeof x === "string").join(". ");
      return s || undefined;
    }
    return undefined;
  };

  if (!response.ok) {
    const msg =
      pickMsg(data.message) ||
      pickMsg(data.error) ||
      `Request failed (HTTP ${response.status}).`;
    return { success: false, message: msg };
  }

  const successFlag = data.success;
  const explicitFailure = successFlag === false || successFlag === "false";
  const explicitSuccess =
    successFlag === true || successFlag === "true" || successFlag === 1;
  const implicitSuccess =
    (response.status === 201 || response.status === 200) &&
    data.data != null &&
    typeof data.data === "object";

  if (explicitFailure) {
    return {
      success: false,
      message:
        pickMsg(data.message) ||
        pickMsg(data.error) ||
        "Could not save your details.",
    };
  }

  if (explicitSuccess || implicitSuccess) {
    return { success: true, data: data.data };
  }

  return {
    success: false,
    message:
      pickMsg(data.message) ||
      pickMsg(data.error) ||
      "Unexpected response from server. Please try again.",
  };
}
