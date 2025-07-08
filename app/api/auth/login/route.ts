import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create form data for the backend API
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    // Call the backend API
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    });

    if (!response.ok) {
      let errorMessage = `Login failed (${response.status} ${response.statusText})`;
      
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (parseError) {
        // If response is not JSON, get the raw text for debugging
        try {
          const errorText = await response.text();
          errorMessage = `Login failed (${response.status}): ${errorText}`;
        } catch (textError) {
          // Use the default error message
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Store token in an HTTP-only cookie for better security
    const cookieStore = cookies();
    cookieStore.set('token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax'
    });

    // Return user data without the token (since it's in httpOnly cookie)
    return NextResponse.json({
      success: true,
      user: data.user || { email }
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}