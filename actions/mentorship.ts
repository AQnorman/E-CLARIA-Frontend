'use server';

import { fetchWithAuth } from '@/lib/api-utils';

/**
 * Opt in to the mentorship program
 */
export async function optInToMentorship(mentorshipData: any) {
  return fetchWithAuth('/api/mentorship/optin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mentorshipData),
  });
}

/**
 * Get list of available mentors
 */
export async function getMentors(filters?: any) {
  // Convert filters to query params if provided
  let url = '/api/mentorship/mentors';
  if (filters) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
  }

  return fetchWithAuth(url);
}

/**
 * Send a message to another user
 */
export async function sendMessage(messageData: any) {
  return fetchWithAuth('/api/mentorship/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
  });
}

/**
 * Get messages with a specific user
 */
export async function getMessages(userId: string) {
  return fetchWithAuth(`/api/mentorship/messages/${userId}`);
}

/**
 * Reply to a message
 */
export async function replyToMessage(replyData: any) {
  return fetchWithAuth('/api/mentorship/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(replyData),
  });
}

/**
 * Get AI-suggested reply for a message
 */
export async function getSuggestedReply(messageId: string) {
  return fetchWithAuth(`/api/mentorship/suggest_reply/${messageId}`);
}
