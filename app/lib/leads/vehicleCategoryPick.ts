type Listener = (value: string) => void;

let current = "new_car";
const listeners = new Set<Listener>();

export function getVehicleCategoryPick(): string {
  return current;
}

export function setVehicleCategoryPick(value: string): void {
  const next = value.trim();
  if (!next || next === current) return;
  current = next;
  listeners.forEach((listener) => listener(current));
}

export function subscribeVehicleCategoryPick(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
