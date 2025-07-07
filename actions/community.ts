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
 * Get list of questions with optional search and filters
 */
export async function getQuestions(params?: { search?: string, filter?: string }) {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.filter) queryParams.append('filter', params.filter);
  
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
