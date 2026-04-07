import type { ComponentType, SVGProps } from "react";
import { LogoKotak } from "./partner-logos";

/**
 * Partner logos loaded from Wikimedia Commons (free media).
 * Source pages: https://commons.wikimedia.org — verify licence per file if you publish commercially.
 */
export type PartnerFallback = ComponentType<SVGProps<SVGSVGElement>>;

export type PartnerEntry =
  | { name: string; src: string }
  | { name: string; Fallback: PartnerFallback };

export const PARTNERS: PartnerEntry[] = [
  { name: "HDFC Bank", src: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg" },
  { name: "ICICI Bank", src: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg" },
  { name: "Axis Bank", src: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Axis_Bank_logo.svg" },
  /** Kotak: no suitable vector on Commons in search — stylised fallback */
  { name: "Kotak Mahindra Bank", Fallback: LogoKotak },
  { name: "State Bank of India", src: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg" },
  { name: "Bank of Baroda", src: "https://upload.wikimedia.org/wikipedia/commons/d/df/Bank_of_Baroda_Logo_since_Dec_19.png" },
  { name: "Punjab National Bank", src: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Punjab_National_Bank.svg" },
  { name: "Union Bank of India", src: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Union_Bank_of_India_Logo.svg" },
  { name: "IDFC FIRST Bank", src: "https://upload.wikimedia.org/wikipedia/commons/3/36/IDFC_Bank_Logo.svg" },
  { name: "IndusInd Bank", src: "https://upload.wikimedia.org/wikipedia/commons/4/40/IndusInd_Bank_SVG_Logo.svg" },
  { name: "YES Bank", src: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Yes_Bank_SVG_Logo.svg" },
  { name: "HSBC", src: "https://upload.wikimedia.org/wikipedia/commons/a/aa/HSBC_logo_%282018%29.svg" },
  { name: "Citi", src: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Citi.svg" },
  { name: "Bajaj Finserv", src: "https://upload.wikimedia.org/wikipedia/commons/9/99/Bajaj_Finserv_Logo.svg" },
  { name: "Tata Capital", src: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Tata_Capital_Logo-01.jpg" },
  { name: "Canara Bank", src: "https://upload.wikimedia.org/wikipedia/commons/5/50/Canara_Bank_Logo.svg" },
  { name: "Federal Bank", src: "https://upload.wikimedia.org/wikipedia/commons/8/87/Federal-Bank-Logo_SVG.svg" },
  { name: "RBL Bank", src: "https://upload.wikimedia.org/wikipedia/commons/7/70/RBL_Bank_SVG_Logo.svg" },
];
