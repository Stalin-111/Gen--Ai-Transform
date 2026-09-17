import { Router } from 'express';
import { getDb, saveDb } from '../database/db.js';
import { executeTransformation } from '../ai/gemini.js';
import { TransformationType, AudienceType, ToneType, LengthType, SupportedLanguage } from '../../src/types/index.js';

export const transformRouter = Router();

// POST /api/transform
transformRouter.post('/', async (req, res) => {
  try {
    const {
      sourceContent,
      documentId,
      documentTitle,
      transformationType = 'Summary',
      audience = 'Student',
      tone = 'Professional',
      targetLanguage = 'English',
      sourceLanguage = 'English',
      lengthSetting = 'Medium',
      additionalInstructions = '',
    } = req.body;

    if (!sourceContent || !sourceContent.trim()) {
      return res.status(400).json({ error: 'Source content cannot be empty.' });
    }

    // Call Gemini Transformation Engine
    const result = await executeTransformation({
      sourceContent,
      transformationType: transformationType as TransformationType,
      audience: audience as AudienceType,
      tone: tone as ToneType,
      targetLanguage: targetLanguage as SupportedLanguage,
      lengthSetting: lengthSetting as LengthType,
      additionalInstructions,
    });

    const transformationId = 'trans_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();

    const db = await getDb();

    // Store in transformations table
    db.run(
      `INSERT INTO transformations (
        id, document_id, document_title, transformation_type, audience, tone,
        target_language, source_language, length_setting, additional_instructions,
        source_content, generated_content, structured_json, quality_result_json,
        status, current_version, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        transformationId,
        documentId || null,
        documentTitle || `${transformationType} of Document`,
        transformationType,
        audience,
        tone,
        targetLanguage,
        sourceLanguage,
        lengthSetting,
        additionalInstructions,
        sourceContent,
        result.generatedContent,
        JSON.stringify(result.structuredJson),
        JSON.stringify(result.qualityResult || {}),
        'completed',
        1,
        now,
        now,
      ]
    );

    // Store initial Version 1
    const versionId = 'ver_' + Date.now() + '_1';
    db.run(
      `INSERT INTO transformation_versions (
        id, transformation_id, version_number, content, structured_json, quality_result_json, created_at, edit_note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        versionId,
        transformationId,
        1,
        result.generatedContent,
        JSON.stringify(result.structuredJson),
        JSON.stringify(result.qualityResult || {}),
        now,
        'Initial AI Generation',
      ]
    );

    // Track usage stats
    const words = sourceContent.split(/\s+/).filter(Boolean).length;
    db.run(
      `INSERT INTO usage_statistics (
        id, event_type, transformation_type, target_language, word_count, processing_time_ms, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        'stat_' + Date.now(),
        'transformation',
        transformationType,
        targetLanguage,
        words,
        result.processingTimeMs,
        now,
      ]
    );

    saveDb();

    return res.json({
      success: true,
      transformation: {
        id: transformationId,
        documentId,
        documentTitle: documentTitle || `${transformationType} of Document`,
        transformationType,
        audience,
        tone,
        targetLanguage,
        sourceLanguage,
        lengthSetting,
        additionalInstructions,
        sourceContent,
        generatedContent: result.generatedContent,
        structuredJson: result.structuredJson,
        qualityResult: result.qualityResult,
        fallbackNotice: result.fallbackNotice,
        status: 'completed',
        currentVersion: 1,
        createdAt: now,
        updatedAt: now,
      },
      processingTimeMs: result.processingTimeMs,
    });
  } catch (err: any) {
    console.error('Error executing transformation:', err);
    return res.status(500).json({
      error: 'The AI service is temporarily unavailable. Please try again.',
      details: err.message,
    });
  }
});
