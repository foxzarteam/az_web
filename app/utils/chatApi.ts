import { PUBLIC_API_BASE_URL } from "@/app/config/constants";
import type { ChatAnswers, ChatStatus } from "@/app/lib/chat/types";

type ChatApiOk = { success: true; id: string; status?: ChatStatus };
type ChatApiFail = { success: false; message: string };
export type ChatApiResult = ChatApiOk | ChatApiFail;

function chatApiBase(): string {
  return PUBLIC_API_BASE_URL.replace(/\/+$/, "");
}

export async function createChatSession(input: {
  mobileNumber: string;
  answers: ChatAnswers;
}): Promise<ChatApiResult> {
  try {
    const res = await fetch(`${chatApiBase()}/api/chat`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        mobileNumber: input.mobileNumber,
        answers: input.answers,
        status: "otp_sent",
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      id?: string;
      status?: ChatStatus;
      message?: string;
      error?: string;
    };
    if (!res.ok || data.success !== true || !data.id) {
      return {
        success: false,
        message: data.message || data.error || "Could not save chat. Please try again.",
      };
    }
    return { success: true, id: data.id, status: data.status };
  } catch {
    return { success: false, message: "Network error. Please try again." };
  }
}

export async function updateChatSession(
  chatId: string,
  patch: { status?: ChatStatus; leadId?: string },
): Promise<ChatApiResult> {
  try {
    const res = await fetch(`${chatApiBase()}/api/chat/${encodeURIComponent(chatId)}`, {
      method: "PATCH",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        status: patch.status,
        leadId: patch.leadId,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      id?: string;
      status?: ChatStatus;
      message?: string;
      error?: string;
    };
    if (!res.ok || data.success !== true || !data.id) {
      return {
        success: false,
        message: data.message || data.error || "Could not update chat.",
      };
    }
    return { success: true, id: data.id, status: data.status };
  } catch {
    return { success: false, message: "Network error while updating chat." };
  }
}
