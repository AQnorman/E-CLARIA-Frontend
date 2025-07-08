'use server';

import { fetchWithAuth } from '@/lib/api-utils';

/**
 * Create or update a non-profit profile
 */
export async function createOrUpdateProfile(profileData: any) {
  console.log(profileData)
  return fetchWithAuth('/api/profile/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
}

/**
 * Get a user's profile by user ID
 */
export async function getProfile(userId: string) {
  try {
    return await fetchWithAuth(`/api/profile/${userId}`);
  } catch (error) {
    // Return null for 404 errors
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}
