'use server';

import { fetchWithAuth } from '@/lib/api-utils';

// Define types for request and response
export interface OutreachRequest {
  profile_id: number;
  goal: string;
}

export interface OutreachResponse {
  id: number;
  title: string;
  content: string;
}

/**
 * Generate outreach content based on user goals
 */
export async function generateOutreachContent(request: OutreachRequest): Promise<OutreachResponse> {
  console.log(request);
  return fetchWithAuth('/api/outreach/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
}
