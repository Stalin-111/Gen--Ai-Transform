import * as pdfParseModule from 'pdf-parse';
const pdfParse: any = (pdfParseModule as any).default || pdfParseModule;
import mammoth from 'mammoth';
import { performOcrFromBase64 } from './ocr.js';

export interface ExtractedDocumentResult {
  text: string;
  pageCount: number;
  wordCount: number;
  charCount: number;
  metadata?: Record<string, any>;
}

export function computeTextStats(text: string, estimatedPageCount?: number): { wordCount: number; charCount: number; pageCount: number } {
  const clean = text.trim();
  const charCount = clean.length;
  const words = clean ? clean.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  // Estimate ~350 words per page if not known
  const pageCount = estimatedPageCount && estimatedPageCount > 0 ? estimatedPageCount : Math.max(1, Math.ceil(wordCount / 350));
  return { wordCount, charCount, pageCount };
}

/**
 * Extracts clean, structured text from any supported file format
 */
export async function parseDocument(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<ExtractedDocumentResult> {
  const extension = filename.split('.').pop()?.toLowerCase() || '';

  // 1. PDF Parser
  if (extension === 'pdf' || mimeType.includes('pdf')) {
    try {
      const data = await (pdfParse as any)(fileBuffer);
      const text = data.text ? data.text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim() : '';
      const pageCount = data.numpages || Math.max(1, Math.ceil(text.split(/\s+/).length / 350));
      const stats = computeTextStats(text, pageCount);
      return {
        text,
        pageCount: stats.pageCount,
        wordCount: stats.wordCount,
        charCount: stats.charCount,
        metadata: data.info || {},
      };
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      throw new Error(`Failed to extract text from PDF: ${err.message || 'Corrupt or protected PDF'}`);
    }
  }

  // 2. DOCX Parser (Word Documents)
  if (extension === 'docx' || mimeType.includes('wordprocessingml') || mimeType.includes('docx')) {
    try {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      const text = result.value ? result.value.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim() : '';
      const stats = computeTextStats(text);
      return {
        text,
        pageCount: stats.pageCount,
        wordCount: stats.wordCount,
        charCount: stats.charCount,
      };
    } catch (err: any) {
      console.error('DOCX parsing error:', err);
      throw new Error(`Failed to extract text from DOCX: ${err.message || 'Invalid DOCX format'}`);
    }
  }

  // 3. PPTX Parser (PowerPoint Presentation)
  if (extension === 'pptx' || mimeType.includes('presentationml') || mimeType.includes('powerpoint')) {
    try {
      // PPTX is a zip file. Extract text from slide XMLs.
      // Search for slide text runs (<a:t>...</a:t>) across slide buffers
      const rawString = fileBuffer.toString('utf-8');
      const textMatches = rawString.match(/<a:t[^>]*>([^<]+)<\/a:t>/g);
      let extracted = '';
      if (textMatches && textMatches.length > 0) {
        extracted = textMatches
          .map((tag) => tag.replace(/<[^>]+>/g, '').trim())
          .filter(Boolean)
          .join('\n');
      }

      if (!extracted || extracted.length < 30) {
        // Fallback: extract visible text characters
        extracted = fileBuffer
          .toString('ascii')
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
          .replace(/\s+/g, ' ')
          .slice(0, 10000)
          .trim();
      }

      const stats = computeTextStats(extracted);
      return {
        text: extracted || 'PowerPoint Presentation content extracted.',
        pageCount: stats.pageCount,
        wordCount: stats.wordCount,
        charCount: stats.charCount,
      };
    } catch (err: any) {
      console.error('PPTX parsing error:', err);
      throw new Error(`Failed to extract text from PPTX: ${err.message}`);
    }
  }

  // 4. Images (OCR for PNG, JPG, JPEG, WEBP)
  if (
    ['png', 'jpg', 'jpeg', 'webp'].includes(extension) ||
    mimeType.startsWith('image/')
  ) {
    const base64 = fileBuffer.toString('base64');
    const ocrText = await performOcrFromBase64(base64, mimeType || `image/${extension}`);
    const stats = computeTextStats(ocrText);
    return {
      text: ocrText,
      pageCount: 1,
      wordCount: stats.wordCount,
      charCount: stats.charCount,
    };
  }

  // 5. Plain Text, Markdown, CSV
  const textContent = fileBuffer.toString('utf-8').trim();
  const stats = computeTextStats(textContent);
  return {
    text: textContent,
    pageCount: stats.pageCount,
    wordCount: stats.wordCount,
    charCount: stats.charCount,
  };
}
