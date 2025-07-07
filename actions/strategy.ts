'use server';

import { fetchWithAuth } from '@/lib/api-utils';

/**
 * Generate AI strategy based on user input
 */
export async function generateStrategy(queryData: any) {
  return fetchWithAuth('/api/strategy/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryData),
  });
}
