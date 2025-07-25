'use server';

import { cookies } from 'next/headers';
import { fetchWithAuth, fetchWithoutAuth } from '@/lib/api-utils';

const API_BASE_URL = process.env.API_URL || 'http://localhost:8000';

/**
 * Login user with email and password
 */
export async function login(email: string, password: string) {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  console.log(API_BASE_URL)

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
      } else {
        console.error('Unexpected error response format:', errorData);
        errorMessage = `Login failed: ${JSON.stringify(errorData)}`;
      }
    } catch (parseError) {
      // If response is not JSON, get the raw text for debugging
      try {
        const errorText = await response.text();
        console.error('Non-JSON error response:', errorText);
        errorMessage = `Login failed (${response.status}): ${errorText}`;
      } catch (textError) {
        console.error('Could not parse error response:', textError);
      }
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  // Store token in an HTTP-only cookie for better security
  const cookieStore = await cookies();
  cookieStore.set('token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return data;
}


/**
 * Register a new user
 */
export async function register(name: string, email: string, password: string) {
  return fetchWithoutAuth('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
}

/**
 * Get current user data
 */
export async function getCurrentUser() {
  let token;
  try {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value;
  } catch (error) {
    // If cookies() fails, we're not in a valid request context
    return null;
  }
  
  if (!token) {
    return null;
  }

  try {
    return await fetchWithAuth('/api/auth/me');
  } catch (error) {
    // Return null instead of throwing an error for this specific endpoint
    return null;
  }
}

/**
 * Logout user
 */
export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');
  } catch (error) {
    throw new Error('Logout function must be called within a valid request context');
  }
  return { success: true };
}
