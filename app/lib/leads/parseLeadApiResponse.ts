import type { CreateLeadResponse } from "@/app/lib/leads/types";
import { toPublicClientError } from "@/app/lib/publicClientError";

/** Shared Nest lead endpoints response parser (apply / start / complete). */
export function parseLeadApiResponse(
  response: Response,
  raw: string,
): CreateLeadResponse {
  let data: {
    success?: boolean | string | number;
    message?: string | string[] | { message?: string; code?: string };
    data?: unknown;
    error?: string | string[];
    statusCode?: number;
    code?: string;
  } = {};
  if (raw) {
    try {
      data = JSON.parse(raw) as typeof data;
    } catch {
      const looksLikeHtml = /^\s*</.test(raw);
      return {
        success: false,
        message: looksLikeHtml
          ? "We could not reach the application service. Please try again in a minute."
          : "Server returned an unexpected response. Please try again.",
      };
    }
  }

  const pickMsg = (m: unknown): string | undefined => {
    if (typeof m === "string" && m.trim()) return m;
    if (Array.isArray(m)) {
      const s = m.filter((x) => typeof x === "string").join(". ");
      return s || undefined;
    }
    if (m && typeof m === "object" && "message" in m) {
      const inner = (m as { message?: unknown }).message;
      if (typeof inner === "string" && inner.trim()) return inner;
    }
    return undefined;
  };

  const pickCode = (): string | undefined => {
    if (typeof data.code === "string" && data.code.trim()) return data.code;
    if (data.message && typeof data.message === "object" && !Array.isArray(data.message)) {
      const inner = (data.message as { code?: unknown }).code;
      if (typeof inner === "string" && inner.trim()) return inner;
    }
    return undefined;
  };

  if (!response.ok) {
    const msg = toPublicClientError(
      pickMsg(data.message) || pickMsg(data.error) || `Request failed (HTTP ${response.status}).`,
      "Could not save your details. Please try again.",
    );
    return { success: false, message: msg, code: pickCode() };
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
      message: toPublicClientError(
        pickMsg(data.message) || pickMsg(data.error) || "Could not save your details.",
        "Could not save your details.",
      ),
      code: pickCode(),
    };
  }

  if (explicitSuccess || implicitSuccess) {
    return { success: true, data: data.data };
  }

  return {
    success: false,
    message: toPublicClientError(
      pickMsg(data.message) ||
        pickMsg(data.error) ||
        "Unexpected response from server. Please try again.",
      "Unexpected response from server. Please try again.",
    ),
    code: pickCode(),
  };
}
