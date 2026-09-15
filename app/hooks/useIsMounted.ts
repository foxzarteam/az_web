import { useSyncExternalStore } from "react";

/** True only after client hydration — avoids SSR/client markup mismatch. */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
