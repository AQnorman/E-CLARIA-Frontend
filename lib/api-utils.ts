'use server';

import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_URL || 'http://localhost:8000';

/**
 * Helper function to make authenticated API requests
 */
export async function fetchWithAuth(
  endpoint: string, 
  options: RequestInit = {}
) {
  const token = cookies().get('token')?.value;
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    // Handle 401 by clearing the token
    if (response.status === 401) {
      cookies().delete('token');
    }
    
    try {
      const errorData = await response.json();
      // Check if errorData is an object with a detail property
      const errorMessage = typeof errorData === 'object' && errorData !== null && 'detail' in errorData
        ? errorData.detail
        : JSON.stringify(errorData);
      throw new Error(errorMessage || 'API request failed');
    } catch (e) {
      // If we can't parse the error as JSON, return a generic error
      throw new Error(`API request failed with status ${response.status}`);
    }
  }

  return response.json();
}

/**
 * Helper function to make unauthenticated API requests
 */
export async function fetchWithoutAuth(
  endpoint: string, 
  options: RequestInit = {}
) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    cache: 'no-store',
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      // Check if errorData is an object with a detail property
      const errorMessage = typeof errorData === 'object' && errorData !== null && 'detail' in errorData
        ? errorData.detail
        : JSON.stringify(errorData);
      throw new Error(errorMessage || 'API request failed');
    } catch (e) {
      // If we can't parse the error as JSON, return a generic error
      throw new Error(`API request failed with status ${response.status}`);
    }
  }

  return response.json();
}
