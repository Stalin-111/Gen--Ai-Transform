import { Router } from 'express';
import { SupportedLanguage } from '../../src/types/index.js';
import { translateText, translateBatch, getLocalizedLabels } from '../services/translationService.js';
import { getGemini } from '../ai/gemini.js';

export const translateRouter = Router();

// POST /api/translate
translateRouter.post('/', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'English' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text cannot be empty.' });
    }

    if (!targetLanguage) {
      return res.status(400).json({ error: 'Target language is required.' });
    }

    const lang = targetLanguage as SupportedLanguage;

    // Try Gemini model first if available
    const ai = getGemini();
    if (ai) {
      try {
        const prompt = `Translate the following text accurately and naturally into ${lang}.
Preserve technical terms, formatting, and markdown accurately:

"""
${text}
"""

Provide ONLY the translated text without introductory meta-chatter.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [prompt],
        });

        const translated = response.text?.trim();
        if (translated) {
          return res.json({ success: true, translatedText: translated, targetLanguage: lang, method: 'gemini' });
        }
      } catch (aiErr) {
        // Fallback to translation service
      }
    }

    // Split paragraphs/sentences to translate via translationService
    const paragraphs = text.split('\n\n');
    const translatedParagraphs: string[] = [];

    for (const para of paragraphs) {
      if (para.trim().length === 0) {
        translatedParagraphs.push('');
        continue;
      }
      const translated = await translateText(para, lang);
      translatedParagraphs.push(translated);
    }

    const finalText = translatedParagraphs.join('\n\n');
    return res.json({
      success: true,
      translatedText: finalText,
      targetLanguage: lang,
      method: 'translation-service',
    });
  } catch (err: any) {
    console.error('Error translating text:', err);
    res.status(500).json({ error: err.message || 'Translation failed' });
  }
});
