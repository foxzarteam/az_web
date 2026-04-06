"use client";

import { useEffect, useState } from "react";
import { fetchActiveServiceCards } from "@/app/utils/fetchActiveServiceCards";
import type {
  FetchActiveServicesResult,
  ServiceSliderCard,
  ServicesFetchStatus,
} from "@/app/lib/services/types";

export type RemoteServiceCardsState = {
  cards: ServiceSliderCard[];
  status: ServicesFetchStatus;
  isLoading: boolean;
};

/**
 * Uses `source` when non-empty (SSR from layout). Otherwise one client GET + shared cache.
 */
export function useRemoteServiceCards(
  source: ServiceSliderCard[]
): RemoteServiceCardsState {
  const serverBacked = source.length > 0;
  const [client, setClient] = useState<FetchActiveServicesResult | null>(null);

  useEffect(() => {
    if (serverBacked) return;
    let cancelled = false;
    fetchActiveServiceCards().then((r) => {
      if (!cancelled) setClient(r);
    });
    return () => {
      cancelled = true;
    };
  }, [serverBacked]);

  if (serverBacked) {
    return { cards: source, status: "ok", isLoading: false };
  }
  if (!client) {
    return { cards: [], status: "ok", isLoading: true };
  }
  return { cards: client.cards, status: client.status, isLoading: false };
}
