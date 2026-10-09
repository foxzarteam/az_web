import "server-only";
import { adminNestGet } from "@/app/lib/admin/adminNestGet";

export type WhatsappSettingsView = {
  accessTokenConfigured: boolean;
  accessTokenHint: string;
  phoneNumberId: string;
  businessAccountId: string;
  appSecretConfigured: boolean;
  appSecretHint: string;
  verifyTokenConfigured: boolean;
  verifyTokenHint: string;
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
  replyBy?: string;
  kind?: string;
  waType?: string;
  filename?: string;
  mime?: string;
  hasMedia?: boolean;
  buttons?: string[];
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
  displayPhone: "",
};

export async function fetchWhatsappSettings(): Promise<WhatsappSettingsView> {
  const data = await adminNestGet<WhatsappSettingsView>("/api/whatsapp/admin/settings");
  return data ?? EMPTY_SETTINGS;
}

export async function fetchWhatsappEnquiries(): Promise<WhatsappEnquiryRow[]> {
  const data = await adminNestGet<WhatsappEnquiryRow[]>("/api/whatsapp/admin/enquiries");
  return Array.isArray(data) ? data : [];
}
