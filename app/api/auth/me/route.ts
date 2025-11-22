import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For demo purposes, always return no user
    // This means users will need to login/register each time
    console.log('Auth check: No user logged in');
    return NextResponse.json(null);
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(null);
  }
}
