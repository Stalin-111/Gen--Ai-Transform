import { Router } from 'express';
import { getDb, saveDb } from '../database/db.js';
import { parseDocument, computeTextStats } from '../document-processing/parser.js';

export const documentRouter = Router();

// POST /api/documents/upload
documentRouter.post('/upload', async (req, res) => {
  try {
    const { filename, mimeType, base64Data, textContent } = req.body;

    if (!filename && !textContent) {
      return res.status(400).json({ error: 'Please provide either a file or text content.' });
    }

    let extractedText = '';
    let pageCount = 1;
    let wordCount = 0;
    let charCount = 0;

    if (base64Data) {
      const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');
      const parsed = await parseDocument(buffer, filename || 'uploaded_doc.txt', mimeType || 'text/plain');
      extractedText = parsed.text;
      pageCount = parsed.pageCount;
      wordCount = parsed.wordCount;
      charCount = parsed.charCount;
    } else if (textContent) {
      extractedText = textContent.trim();
      const stats = computeTextStats(extractedText);
      pageCount = stats.pageCount;
      wordCount = stats.wordCount;
      charCount = stats.charCount;
    }

    const docId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const createdAt = new Date().toISOString();

    const db = await getDb();
    db.run(
      `INSERT INTO documents (id, filename, file_type, file_size, extracted_text, page_count, word_count, char_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        docId,
        filename || 'Direct Text Input',
        mimeType || 'text/plain',
        charCount,
        extractedText,
        pageCount,
        wordCount,
        charCount,
        createdAt,
      ]
    );
    saveDb();

    return res.json({
      success: true,
      document: {
        id: docId,
        filename: filename || 'Direct Text Input',
        fileType: mimeType || 'text/plain',
        fileSize: charCount,
        extractedText,
        pageCount,
        wordCount,
        charCount,
        createdAt,
      },
    });
  } catch (err: any) {
    console.error('Error in document upload/extract:', err);
    return res.status(500).json({
      error: 'Unable to process this file. Please check the file format and try again.',
      details: err.message,
    });
  }
});

// POST /api/documents/extract (for direct text paste preview)
documentRouter.post('/extract', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text content is required' });
    }
    const stats = computeTextStats(text);
    return res.json({
      success: true,
      stats: {
        ...stats,
        extractedText: text,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Error processing text extraction' });
  }
});

// GET /api/documents
documentRouter.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec('SELECT id, filename, file_type, file_size, page_count, word_count, char_count, created_at FROM documents ORDER BY created_at DESC LIMIT 50;');
    if (!result || result.length === 0) {
      return res.json({ documents: [] });
    }
    const cols = result[0].columns;
    const documents = result[0].values.map((row) => {
      const obj: any = {};
      cols.forEach((c, idx) => {
        obj[c] = row[idx];
      });
      return obj;
    });
    return res.json({ documents });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve documents' });
  }
});
