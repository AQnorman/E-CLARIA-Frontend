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

  console.log(API_BASE_URL);

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: formData,
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorMessage = `Login failed (${response.status} ${response.statusText})`;
    
    try {
      // Read the response body as text first
      const responseText = await response.text();
      
      try {
        // Try to parse as JSON
        const errorData = JSON.parse(responseText);
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          console.error('Unexpected error response format:', errorData);
          errorMessage = `Login failed: ${JSON.stringify(errorData)}`;
        }
      } catch (jsonParseError) {
        // If JSON parsing fails, use the raw text
        console.error('Non-JSON error response:', responseText);
        errorMessage = `Login failed (${response.status}): ${responseText}`;
      }
    } catch (readError) {
      // If we can't read the response at all
      console.error('Could not read error response:', readError);
      errorMessage = `Login failed (${response.status} ${response.statusText})`;
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  // Store token in an HTTP-only cookie for better security
  cookies().set('token', data.access_token, {
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
  const token = cookies().get('token')?.value;
  
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
  cookies().delete('token');
  return { success: true };
}
