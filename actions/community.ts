'use server';

import { fetchWithAuth } from '@/lib/api-utils';

/**
 * Post a new question to the community
 */
export async function postQuestion(questionData: any) {
  return fetchWithAuth('/api/community/question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionData),
  });
}

/**
 * Post an answer to a question
 */
export async function postAnswer(answerData: any) {
  return fetchWithAuth('/api/community/answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(answerData),
  });
}

/**
 * Get list of questions with optional search, filters, and pagination
 */
export async function getQuestions(params?: { 
  search?: string, 
  filter?: string, 
  page?: number, 
  pageSize?: number 
}) {
  const queryParams = new URLSearchParams();
  
  // Add search parameter if provided
  if (params?.search && params.search.trim()) {
    queryParams.append('search', params.search.trim());
  }
  
  // Add filter parameter if provided
  if (params?.filter && params.filter.trim()) {
    queryParams.append('filter', params.filter.trim());
  }
  
  // Add pagination parameters
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  
  if (params?.pageSize) {
    queryParams.append('page_size', params.pageSize.toString());
  }
  
  const url = `/api/community/questions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  return fetchWithAuth(url);
}

/**
 * Get answers for a specific question
 */
export async function getAnswers(questionId: string) {
  return fetchWithAuth(`/api/community/answers/${questionId}`);
}

/**
 * Get user points/reputation
 */
export async function getUserPoints(userId: string) {
  return fetchWithAuth(`/api/community/points/${userId}`);
}

/**
 * Upvote an answer
 */
export async function upvoteAnswer(answerId: string) {
  return fetchWithAuth(`/api/community/answer/${answerId}/upvote`, {
    method: 'POST'
  });
}

/**
 * Get AI-suggested answer for a question
 */
export async function getSuggestedAnswer(questionId: string) {
  return fetchWithAuth(`/api/community/suggested_answer/${questionId}`);
}

/**
 * Delete an answer
 */
export async function deleteAnswer(answerId: number) {
  return fetchWithAuth(`/api/community/answer/${answerId}`, {
    method: 'DELETE'
  });
}
