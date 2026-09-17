import { Router } from 'express';
import { evaluateQuality } from '../ai/gemini.js';

export const qualityRouter = Router();

// POST /api/quality-check
qualityRouter.post('/', async (req, res) => {
  try {
    const { sourceContent, generatedContent } = req.body;

    if (!sourceContent || !generatedContent) {
      return res.status(400).json({ error: 'Source and generated content are required for quality check' });
    }

    const qualityResult = await evaluateQuality(sourceContent, generatedContent);
    return res.json({
      success: true,
      qualityResult,
    });
  } catch (err: any) {
    console.error('Quality check error:', err);
    return res.status(500).json({
      error: 'Quality check evaluation failed.',
      details: err.message,
    });
  }
});
