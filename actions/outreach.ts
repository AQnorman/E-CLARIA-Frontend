'use server';

import { fetchWithAuth } from '@/lib/api-utils';

/**
 * Generate outreach content based on user goals
 */
export async function generateOutreachContent(goalData: any) {
  return fetchWithAuth('/api/outreach/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(goalData),
  });
}
