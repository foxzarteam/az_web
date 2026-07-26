import { NextResponse } from "next/server";
import type { ChatStatus } from "@/app/lib/chat/types";
import { getSupabaseServerClient } from "@/app/utils/supabase/serverClient";

const STATUSES: ChatStatus[] = [
  "started",
  "otp_sent",
  "otp_verified",
  "lead_submitted",
  "abandoned",
];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { success: false, message: "Chat storage is not configured (Supabase env missing)." },
      { status: 503 },
    );
  }

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ success: false, message: "Missing chat id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const o = (body ?? {}) as Record<string, unknown>;
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (typeof o.status === "string" && STATUSES.includes(o.status as ChatStatus)) {
    patch.status = o.status;
  }

  const leadId = o.leadId ?? o.lead_id;
  if (typeof leadId === "string" && leadId.trim()) {
    patch.lead_id = leadId.trim();
  }

  if (Object.keys(patch).length <= 1) {
    return NextResponse.json(
      { success: false, message: "Nothing to update." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("chat")
    .update(patch)
    .eq("id", id)
    .select("id, status")
    .single();

  if (error || !data) {
    console.error("[chat PATCH]", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Could not update chat." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, id: data.id, status: data.status });
}
