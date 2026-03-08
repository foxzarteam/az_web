import { NextResponse } from "next/server";

const headerData = [
  { label: "Home", href: "/" },
  {
    label: "Properties",
    href: "/#featured",
    submenu: [
      { label: "Property List", href: "/#featured" },
      { label: "Property Details", href: "/#featured" },
    ],
  },
  {
    label: "Blogs",
    href: "/#blog",
    submenu: [
      { label: "Blog Grid", href: "/#blog" },
      { label: "Blog Details", href: "/#blog" },
    ],
  },
  { label: "Contact", href: "/#contact" },
  { label: "Documentation", href: "/#" },
];

export async function GET() {
  return NextResponse.json({ headerData });
}
