import {
  DocumentMetadata,
  TransformationRecord,
  Template,
  TemplateItem,
  UsageStatistics,
  TransformationType,
  AudienceType,
  ToneType,
  LengthType,
  SupportedLanguage,
  QualityCheckResult,
} from '../types';

export async function uploadDocument(formData: {
  filename?: string;
  mimeType?: string;
  base64Data?: string;
  textContent?: string;
}): Promise<{ success: boolean; document: DocumentMetadata }> {
  const res = await fetch('/api/documents/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload document');
  }
  return res.json();
}

export async function extractTextStats(text: string): Promise<{
  wordCount: number;
  charCount: number;
  pageCount: number;
  extractedText: string;
}> {
  const res = await fetch('/api/documents/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error('Failed to analyze text content');
  }
  const data = await res.json();
  return data.stats;
}

export async function generateTransformation(params: {
  sourceContent: string;
  documentId?: string;
  documentTitle?: string;
  transformationType: TransformationType;
  audience: AudienceType;
  tone: ToneType;
  targetLanguage: SupportedLanguage;
  sourceLanguage?: string;
  lengthSetting: LengthType;
  additionalInstructions?: string;
}): Promise<{
  success: boolean;
  transformation: TransformationRecord;
  processingTimeMs: number;
}> {
  const res = await fetch('/api/transform', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'AI Transformation failed');
  }
  return res.json();
}

export async function runQualityCheck(
  sourceContent: string,
  generatedContent: string
): Promise<QualityCheckResult> {
  const res = await fetch('/api/quality-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceContent, generatedContent }),
  });
  if (!res.ok) {
    throw new Error('Quality check failed');
  }
  const data = await res.json();
  return data.qualityResult;
}

export async function fetchTransformations(query?: {
  search?: string;
  type?: string;
  language?: string;
  sort?: string;
}): Promise<TransformationRecord[]> {
  const params = new URLSearchParams();
  if (query?.search) params.append('search', query.search);
  if (query?.type) params.append('type', query.type);
  if (query?.language) params.append('language', query.language);
  if (query?.sort) params.append('sort', query.sort);

  const res = await fetch(`/api/transformations?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to load transformations history');
  }
  const data = await res.json();
  return data.transformations || [];
}

export async function fetchTransformationById(id: string): Promise<TransformationRecord> {
  const res = await fetch(`/api/transformations/${id}`);
  if (!res.ok) {
    throw new Error('Transformation record not found');
  }
  const data = await res.json();
  return data.transformation;
}

export async function updateTransformation(
  id: string,
  payload: { editedContent: string; structuredJson?: any; editNote?: string }
): Promise<{ success: boolean; currentVersion: number }> {
  const res = await fetch(`/api/transformations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to update transformation');
  }
  return res.json();
}

export async function deleteTransformation(id: string): Promise<void> {
  const res = await fetch(`/api/transformations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete transformation');
  }
}

export async function fetchTemplates(): Promise<Template[]> {
  const res = await fetch('/api/templates');
  if (!res.ok) {
    throw new Error('Failed to fetch templates');
  }
  const data = await res.json();
  return data.templates || [];
}

export async function fetchUsageStats(): Promise<UsageStatistics> {
  const res = await fetch('/api/stats');
  if (!res.ok) {
    throw new Error('Failed to load usage statistics');
  }
  return res.json();
}

export async function exportContent(payload: {
  title: string;
  format: 'txt' | 'md' | 'docx' | 'pdf' | 'pptx';
  content: string;
  structuredJson?: any;
  transformationType?: TransformationType;
}): Promise<void> {
  const res = await fetch('/api/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to generate export file');
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const extensionMap: Record<string, string> = {
    txt: 'txt',
    md: 'md',
    docx: 'docx',
    pdf: 'pdf',
    pptx: 'pptx',
  };
  const ext = extensionMap[payload.format] || 'txt';
  const safeTitle = (payload.title || 'TransformAI_Document').replace(/[^a-zA-Z0-9_-]/g, '_');
  a.download = `${safeTitle}.${ext}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function translateTextApi(payload: {
  text: string;
  targetLanguage: SupportedLanguage;
  sourceLanguage?: string;
}): Promise<{
  success: boolean;
  translatedText: string;
  targetLanguage: SupportedLanguage;
}> {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Translation failed');
  }

  return res.json();
}

