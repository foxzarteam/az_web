import { NextRequest, NextResponse } from 'next/server';

// Use API_URL for server-side, fallback to NEXT_PUBLIC_API_URL or default
const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://az-app-khaki.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to create lead' },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in leads API route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
