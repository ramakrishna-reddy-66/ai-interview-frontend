const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errData.error || JSON.stringify(errData);
    } catch {
      const text = await response.text();
      errorMsg = text || `HTTP ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMsg);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

// Authentication
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
}

// Interviews
export async function getInterviews() {
  const res = await fetch(`${API_BASE}/interviews`);
  return handleResponse(res);
}

export async function getInterviewById(id) {
  const res = await fetch(`${API_BASE}/interviews/${id}`);
  return handleResponse(res);
}

export async function createInterview(title, description) {
  const res = await fetch(`${API_BASE}/interviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  return handleResponse(res);
}

export async function updateInterview(id, title, description) {
  const res = await fetch(`${API_BASE}/interviews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  return handleResponse(res);
}

export async function deleteInterview(id) {
  const res = await fetch(`${API_BASE}/interviews/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

export async function startInterviewSession(id) {
  const res = await fetch(`${API_BASE}/interviews/${id}/start`);
  return handleResponse(res);
}

export async function getNextQuestion(id) {
  const res = await fetch(`${API_BASE}/interviews/${id}/next-question`);
  return handleResponse(res);
}

export async function getInterviewQuestions(id) {
  const res = await fetch(`${API_BASE}/interviews/${id}/questions`);
  return handleResponse(res);
}

export async function getInterviewScore(id) {
  const res = await fetch(`${API_BASE}/interviews/${id}/score`);
  return handleResponse(res);
}

export async function getDetailedReport(id) {
  const res = await fetch(`${API_BASE}/interviews/${id}/detailed-report`);
  return handleResponse(res);
}

export async function getInterviewReportText(id) {
  const res = await fetch(`${API_BASE}/interviews/${id}/report`);
  return handleResponse(res);
}

export async function resetInterviewSession(id) {
  const res = await fetch(`${API_BASE}/interviews/${id}/reset`, {
    method: 'POST',
  });
  return handleResponse(res);
}

export async function seedDefaultTracks() {
  const res = await fetch(`${API_BASE}/interviews/seed`, {
    method: 'POST',
  });
  return handleResponse(res);
}

// Answers
export async function submitAnswer(questionId, answerText) {
  const res = await fetch(`${API_BASE}/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId, answerText }),
  });
  return handleResponse(res);
}

export async function getAnswersForInterview(interviewId) {
  const res = await fetch(`${API_BASE}/answers/interview/${interviewId}`);
  return handleResponse(res);
}

// AI Direct Utilities
export async function generateAIQuestion(topic) {
  const res = await fetch(`${API_BASE}/ai/question?topic=${encodeURIComponent(topic)}`);
  return handleResponse(res);
}

export async function generateAIAnswer(topic, question) {
  const res = await fetch(`${API_BASE}/ai/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, question }),
  });
  return handleResponse(res);
}

export async function scoreAIAnswer(question, answer) {
  const res = await fetch(`${API_BASE}/ai/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer }),
  });
  return handleResponse(res);
}
