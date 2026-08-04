"use client";

import { useEffect, useState } from "react";
import { useServiceCards } from "@/app/components/providers/ServiceCardsProvider";
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
 * Prefers root-layout SSR cards (via context / optional override).
 * Falls back to one browser GET (session-cached) only when layout had none.
 */
export function useRemoteServiceCards(
  source?: ServiceSliderCard[],
): RemoteServiceCardsState {
  const fromLayout = useServiceCards();
  const seed =
    source && source.length > 0
      ? source
      : fromLayout.length > 0
        ? fromLayout
        : null;
  const serverBacked = seed != null && seed.length > 0;
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

  if (serverBacked && seed) {
    return { cards: seed, status: "ok", isLoading: false };
  }
  if (!client) {
    return { cards: [], status: "ok", isLoading: true };
  }
  return { cards: client.cards, status: client.status, isLoading: false };
}
