"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAffiliateCodeFromLocation } from "@/app/lib/affiliate/refCookie";

/** Remember a partner code from the current URL for this tab only. */
export default function PartnerRefSession() {
  const pathname = usePathname();
  const search = useSearchParams();
  const ref = search.get("ref") ?? "";

  useEffect(() => {
    captureAffiliateCodeFromLocation();
  }, [pathname, ref]);

  return null;
}
