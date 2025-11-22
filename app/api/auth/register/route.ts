import { NextResponse } from 'next/server';

// Simple in-memory storage for demo
// eslint-disable-next-line prefer-const, @typescript-eslint/no-explicit-any
let users: any[] = [];

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    console.log('Registration attempt:', { name, email });
    
    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    users.push(user);

    console.log('Registration successful:', user);

    return NextResponse.json(user);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
