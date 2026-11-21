export const AZ_WHATSAPP_OPEN_EVENT = "az-whatsapp-open";

export type WhatsappOpenDetail = {
  id?: string;
  phone?: string;
  name?: string;
};

let openChatId: string | null = null;

export function setOpenWhatsappChat(id: string | null) {
  openChatId = id;
}

export function getOpenWhatsappChat(): string | null {
  return openChatId;
}

export function requestOpenWhatsappChat(detail: WhatsappOpenDetail) {
  window.dispatchEvent(new CustomEvent<WhatsappOpenDetail>(AZ_WHATSAPP_OPEN_EVENT, { detail }));
}
