export type UsedCarEligibility = {
  eligible: boolean;
  amount: number;
  rc: string;
};

type Listener = (value: UsedCarEligibility | null) => void;

let current: UsedCarEligibility | null = null;
const listeners = new Set<Listener>();

export function getUsedCarEligibility(): UsedCarEligibility | null {
  return current;
}

export function setUsedCarEligibility(value: UsedCarEligibility): void {
  current = value;
  listeners.forEach((listener) => listener(current));
}

export function subscribeUsedCarEligibility(listener: Listener): () => void {
  listeners.add(listener);
  listener(current);
  return () => listeners.delete(listener);
}
