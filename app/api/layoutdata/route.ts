import { NextResponse } from "next/server";

const HEADER_DATA = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#featured" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export async function GET() {
  try {
    return NextResponse.json({ headerData: HEADER_DATA });
  } catch (error) {
    console.error("Error fetching layout data:", error);
    return NextResponse.json({ error: "Failed to fetch layout data" }, { status: 500 });
  }
}
