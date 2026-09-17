import { Router } from 'express';
import { generateDocxBuffer, generatePptxBuffer, generatePdfBuffer } from '../services/exportService.js';

export const exportRouter = Router();

// POST /api/export
exportRouter.post('/', async (req, res) => {
  try {
    const { title = 'Transformed_Content', format = 'txt', content = '', structuredJson, transformationType } = req.body;
    const safeTitle = (title || 'TransformAI_Document').replace(/[^a-zA-Z0-9_-]/g, '_');

    if (format === 'txt') {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.txt"`);
      return res.send(content);
    }

    if (format === 'md') {
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.md"`);
      return res.send(content);
    }

    if (format === 'docx') {
      const buffer = await generateDocxBuffer(title, content, structuredJson);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.docx"`);
      return res.send(buffer);
    }

    if (format === 'pptx') {
      const buffer = await generatePptxBuffer(title, structuredJson, content);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      );
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pptx"`);
      return res.send(buffer);
    }

    if (format === 'pdf') {
      const buffer = await generatePdfBuffer(title, content);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);
      return res.send(buffer);
    }

    return res.status(400).json({ error: `Unsupported export format: ${format}` });
  } catch (err: any) {
    console.error('Export error:', err);
    return res.status(500).json({ error: 'Failed to generate export file', details: err.message });
  }
});
