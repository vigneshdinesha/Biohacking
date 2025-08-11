const API_BASE = 'http://localhost:5189/api';

export async function getUsers(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/Users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getUser(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/Users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function createUser(data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/Users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function updateUser(id: number, data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/Users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/Users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}

export async function linkUserMotivation(id: number, motivationId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/Users/${id}/link-motivation/${motivationId}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to link motivation');
  return res.json();
}

export async function unlinkUserMotivation(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/Users/${id}/unlink-motivation`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to unlink motivation');
  return res.json();
}

export async function linkUserMotivationBody(userId: number, motivationId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/Users/link-motivation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, motivationId }),
  });
  if (!res.ok) throw new Error('Failed to link motivation');
  return res.json();
}

export async function unlinkUserMotivationBody(userId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/Users/unlink-motivation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error('Failed to unlink motivation');
  return res.json();
}

// Motivation Endpoints
export async function getMotivations(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/Motivations`);
  if (!res.ok) throw new Error('Failed to fetch motivations');
  return res.json();
}

export async function getMotivation(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/Motivations/${id}`);
  if (!res.ok) throw new Error('Failed to fetch motivation');
  return res.json();
}

export async function createMotivation(data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/Motivations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create motivation');
  return res.json();
}

export async function updateMotivation(id: number, data: any): Promise<any> {
  console.log('🌐 API UPDATE MOTIVATION - Starting API call for ID:', id);
  console.log('🌐 API UPDATE MOTIVATION - URL:', `${API_BASE}/Motivations/${id}`);
  console.log('🌐 API UPDATE MOTIVATION - Data:', data);
  
  const res = await fetch(`${API_BASE}/Motivations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  console.log('🌐 API UPDATE MOTIVATION - Response status:', res.status, res.statusText);
  
  if (!res.ok) {
    console.error('❌ API UPDATE MOTIVATION - Request failed with status:', res.status);
    const errorText = await res.text();
    console.error('❌ API UPDATE MOTIVATION - Error response body:', errorText);
    throw new Error(`Failed to update motivation: ${res.status} ${res.statusText} - ${errorText}`);
  }
  
  const result = await res.json();
  console.log('✅ API UPDATE MOTIVATION - Success! Response:', result);
  return result;
}

export async function deleteMotivation(id: number): Promise<any> {
  console.log('🌐 API DELETE MOTIVATION - Starting API call for ID:', id);
  console.log('🌐 API DELETE MOTIVATION - URL:', `${API_BASE}/Motivations/${id}`);
  
  const res = await fetch(`${API_BASE}/Motivations/${id}`, { method: 'DELETE' });
  
  console.log('🌐 API DELETE MOTIVATION - Response status:', res.status, res.statusText);
  console.log('🌐 API DELETE MOTIVATION - Response headers:', Object.fromEntries(res.headers.entries()));
  
  if (!res.ok) {
    console.error('❌ API DELETE MOTIVATION - Request failed with status:', res.status);
    const errorText = await res.text();
    console.error('❌ API DELETE MOTIVATION - Error response body:', errorText);
    throw new Error(`Failed to delete motivation: ${res.status} ${res.statusText} - ${errorText}`);
  }
  
  // Check if response has content before trying to parse JSON
  const contentLength = res.headers.get('content-length');
  const contentType = res.headers.get('content-type');
  
  if (contentLength === '0' || res.status === 204 || !contentType?.includes('application/json')) {
    console.log('✅ API DELETE MOTIVATION - Success! No content response (as expected)');
    return {}; // Return empty object for successful delete with no content
  }
  
  const result = await res.json();
  console.log('✅ API DELETE MOTIVATION - Success! Response:', result);
  return result;
}

export async function getMotivationBiohacks(id: number): Promise<any[]> {
  const res = await fetch(`${API_BASE}/Motivations/${id}/biohacks`);
  if (!res.ok) throw new Error('Failed to fetch motivation biohacks');
  return res.json();
}

// Biohack Endpoints
export async function getBiohacks(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/Biohacks`);
  if (!res.ok) throw new Error('Failed to fetch biohacks');
  return res.json();
}

export async function getBiohack(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/Biohacks/${id}`);
  if (!res.ok) throw new Error('Failed to fetch biohack');
  return res.json();
}

export async function createBiohack(data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/Biohacks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create biohack');
  return res.json();
}

export async function updateBiohack(id: number, data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/Biohacks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update biohack');
  return res.json();
}

export async function deleteBiohack(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/Biohacks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete biohack');
  return res.json();
}

// Journal Endpoints
export async function getJournals(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/Journals`);
  if (!res.ok) throw new Error('Failed to fetch journals');
  return res.json();
}

export async function getJournal(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/Journals/${id}`);
  if (!res.ok) throw new Error('Failed to fetch journal');
  return res.json();
}

export async function createJournal(data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/Journals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create journal');
  return res.json();
}

export async function updateJournal(id: number, data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/Journals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update journal');
  return res.json();
}

export async function deleteJournal(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/Journals/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete journal');
  return res.json();
}

// MotivationBiohacks Endpoints
export async function getMotivationBiohacksAll(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/MotivationBiohacks`);
  if (!res.ok) throw new Error('Failed to fetch motivation-biohacks');
  return res.json();
}

export async function getMotivationBiohack(motivationId: number, biohackId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/MotivationBiohacks/${motivationId}/${biohackId}`);
  if (!res.ok) throw new Error('Failed to fetch motivation-biohack relationship');
  return res.json();
}

export async function createMotivationBiohack(data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/MotivationBiohacks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create motivation-biohack relationship');
  return res.json();
}

export async function linkMotivationBiohack(motivationId: number, biohackId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/MotivationBiohacks/link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ motivationId, biohackId }),
  });
  if (!res.ok) throw new Error('Failed to link motivation-biohack');
  return res.json();
}

export async function unlinkMotivationBiohack(motivationId: number, biohackId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/MotivationBiohacks/unlink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ motivationId, biohackId }),
  });
  if (!res.ok) throw new Error('Failed to unlink motivation-biohack');
  return res.json();
}

export async function deleteMotivationBiohack(motivationId: number, biohackId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/MotivationBiohacks/${motivationId}/${biohackId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete motivation-biohack relationship');
  return res.json();
}
