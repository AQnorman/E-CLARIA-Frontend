import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Call the backend API for registration
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
      cache: 'no-store',
    });

    if (!response.ok) {
      let errorMessage = `Registration failed (${response.status} ${response.statusText})`;
      
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        // If response is not JSON, get the raw text for debugging
        try {
          const errorText = await response.text();
          errorMessage = `Registration failed (${response.status}): ${errorText}`;
        } catch (textError) {
          // Use the default error message
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const registrationData = await response.json();

    // After successful registration, automatically log the user in
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      
      // Store token in an HTTP-only cookie
      const cookieStore = cookies();
      cookieStore.set('token', loginData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        sameSite: 'lax'
      });

      return NextResponse.json({
        success: true,
        user: loginData.user || { name, email },
        message: 'Registration successful and logged in'
      });
    } else {
      // Registration succeeded but login failed
      return NextResponse.json({
        success: true,
        message: 'Registration successful. Please log in.',
        requiresLogin: true
      });
    }

  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}