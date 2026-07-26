import { NextResponse } from "next/server";
import { fetchLeadsByMobile } from "@/app/lib/customer/leadsByMobile";
import { getCustomerSession } from "@/app/lib/customer/session";

export async function GET() {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await fetchLeadsByMobile(session.sub);
    return NextResponse.json({
      ok: true,
      customer: {
        mobile: session.sub,
        name: session.name || applications[0]?.full_name || "Customer",
      },
      applications,
    });
  } catch (e) {
    console.error("customer me", e);
    return NextResponse.json({ error: "Could not load your applications." }, { status: 500 });
  }
}
