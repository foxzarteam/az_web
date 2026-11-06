import { NextResponse } from "next/server";

/** Firebase OTP SMS is off — never proxy a verify request. */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "OTP is disabled. Submit the form without OTP.",
    },
    { status: 200 },
  );
}
