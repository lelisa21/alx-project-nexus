import { NextResponse } from 'next/server';

export async function POST() {
  console.log('Logout called');
  return NextResponse.json({ success: true });
}
