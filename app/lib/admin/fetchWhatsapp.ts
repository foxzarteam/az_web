import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeadersFromSession } from "@/app/lib/admin/adminInternalKey";

export type WhatsappSettingsView = {
  accessTokenConfigured: boolean;
  accessTokenHint: string;
  phoneNumberId: string;
  businessAccountId: string;
  appSecretConfigured: boolean;
  appSecretHint: string;
  verifyTokenConfigured: boolean;
  verifyTokenHint: string;
  geminiApiKeyConfigured: boolean;
  geminiApiKeyHint: string;
  geminiModel: string;
  geminiModels: string[];
  displayPhone: string;
};

export type WhatsappEnquiryRow = {
  id: string;
  phone: string;
  profileName: string;
  lastMessage: string;
  lastChatAt: string | null;
  createdAt: string;
};

export type WhatsappChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  at: string;
  sendError?: string;
  aiError?: string;
};

export type WhatsappEnquiryDetail = {
  id: string;
  phone: string;
  profileName: string;
  lastChatAt: string | null;
  createdAt: string;
  messages: WhatsappChatMessage[];
};

const EMPTY_SETTINGS: WhatsappSettingsView = {
  accessTokenConfigured: false,
  accessTokenHint: "",
  phoneNumberId: "",
  businessAccountId: "",
  appSecretConfigured: false,
  appSecretHint: "",
  verifyTokenConfigured: false,
  verifyTokenHint: "",
  geminiApiKeyConfigured: false,
  geminiApiKeyHint: "",
  geminiModel: "",
  geminiModels: [],
  displayPhone: "",
};

async function adminGet<T>(path: string): Promise<T | null> {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  if (!base) return null;
  const headers = await adminInternalHeadersFromSession();
  if (!headers) return null;
  try {
    const res = await fetch(`${base}${path}`, { headers, cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as { success?: boolean; data?: T };
    if (!body.success || body.data == null) return null;
    return body.data;
  } catch {
    return null;
  }
}

export async function fetchWhatsappSettings(): Promise<WhatsappSettingsView> {
  const data = await adminGet<WhatsappSettingsView>("/api/whatsapp/admin/settings");
  return data ?? EMPTY_SETTINGS;
}

export async function fetchWhatsappEnquiries(): Promise<WhatsappEnquiryRow[]> {
  const data = await adminGet<WhatsappEnquiryRow[]>("/api/whatsapp/admin/enquiries");
  return Array.isArray(data) ? data : [];
}
