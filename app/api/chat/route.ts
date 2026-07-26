import { NextResponse } from "next/server";
import type { ChatAnswers, ChatStatus } from "@/app/lib/chat/types";
import { getSupabaseServerClient } from "@/app/utils/supabase/serverClient";

const STATUSES: ChatStatus[] = [
  "started",
  "otp_sent",
  "otp_verified",
  "lead_submitted",
  "abandoned",
];

function isAnswerItem(v: unknown): v is { id: string; label: string } {
  return (
    v != null &&
    typeof v === "object" &&
    typeof (v as { id?: unknown }).id === "string" &&
    typeof (v as { label?: unknown }).label === "string"
  );
}

function parseAnswers(raw: unknown): ChatAnswers | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (
    !isAnswerItem(o.employment) ||
    !isAnswerItem(o.salary) ||
    !isAnswerItem(o.existing_emi) ||
    !isAnswerItem(o.loan_amount)
  ) {
    return null;
  }
  return {
    employment: { id: o.employment.id, label: o.employment.label },
    salary: { id: o.salary.id, label: o.salary.label },
    existing_emi: { id: o.existing_emi.id, label: o.existing_emi.label },
    loan_amount: { id: o.loan_amount.id, label: o.loan_amount.label },
  };
}

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { success: false, message: "Chat storage is not configured (Supabase env missing)." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const o = (body ?? {}) as Record<string, unknown>;
  const mobile = String(o.mobileNumber ?? o.mobile_number ?? "").replace(/\D/g, "");
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return NextResponse.json(
      { success: false, message: "Enter a valid 10-digit mobile number." },
      { status: 400 },
    );
  }

  const answers = parseAnswers(o.answers);
  if (!answers) {
    return NextResponse.json(
      { success: false, message: "Chat answers are incomplete." },
      { status: 400 },
    );
  }

  const statusRaw = typeof o.status === "string" ? o.status : "otp_sent";
  const status: ChatStatus = STATUSES.includes(statusRaw as ChatStatus)
    ? (statusRaw as ChatStatus)
    : "otp_sent";

  const { data, error } = await supabase
    .from("chat")
    .insert({
      mobile_number: mobile,
      answers,
      status,
      updated_at: new Date().toISOString(),
    })
    .select("id, status")
    .single();

  if (error || !data) {
    console.error("[chat POST]", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Could not save chat." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, id: data.id, status: data.status });
}
