/**
 * API client for ResumeIQ Backend
 */

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

export async function analyzeResume(resumeText, jobDescriptionText, customWeights = null) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description_text: jobDescriptionText,
      custom_weights: customWeights
    })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Analysis failed. Please try again.');
  }
  return response.json();
}

export async function analyzeResumeFile(file, jobDescriptionText, customWeights = null) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description_text', jobDescriptionText);
  if (customWeights) {
    formData.append('custom_weights_json', JSON.stringify(customWeights));
  }

  const response = await fetch(`${API_BASE}/analyze-file`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'File analysis failed.');
  }
  return response.json();
}

export async function fetchDemoAnalysis() {
  const response = await fetch(`${API_BASE}/demo`);
  if (!response.ok) throw new Error('Failed to load demo data');
  return response.json();
}

export async function recalculateWeights(requirements, customWeights) {
  const response = await fetch(`${API_BASE}/recalculate-weights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requirements,
      custom_weights: customWeights
    })
  });
  if (!response.ok) throw new Error('Weight recalculation failed');
  return response.json();
}

export async function fetchHashMapLab(searchKey, items = null) {
  const response = await fetch(`${API_BASE}/dsa/hashmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ search_key: searchKey, items })
  });
  if (!response.ok) throw new Error('HashMap Lab request failed');
  return response.json();
}

export async function fetchTrieLab(searchWord, prefix, autocompletePrefix, words = null) {
  const response = await fetch(`${API_BASE}/dsa/trie`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      search_word: searchWord,
      prefix: prefix,
      autocomplete_prefix: autocompletePrefix,
      words: words
    })
  });
  if (!response.ok) throw new Error('Trie Lab request failed');
  return response.json();
}

export async function fetchKmpLab(text, pattern) {
  const response = await fetch(`${API_BASE}/dsa/kmp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, pattern })
  });
  if (!response.ok) throw new Error('KMP Lab request failed');
  return response.json();
}

export async function fetchRabinKarpLab(text, pattern) {
  const response = await fetch(`${API_BASE}/dsa/rabinkarp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, pattern })
  });
  if (!response.ok) throw new Error('Rabin-Karp Lab request failed');
  return response.json();
}

export async function fetchEditDistanceLab(word1, word2) {
  const response = await fetch(`${API_BASE}/dsa/editdistance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word1, word2 })
  });
  if (!response.ok) throw new Error('Edit Distance Lab request failed');
  return response.json();
}

export async function fetchBenchmark(size = 1000) {
  const response = await fetch(`${API_BASE}/benchmark?size=${size}`);
  if (!response.ok) throw new Error('Benchmark execution failed');
  return response.json();
}
