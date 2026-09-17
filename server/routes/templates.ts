import { Router } from 'express';
import { getDb } from '../database/db.js';

export const templatesRouter = Router();

const OFFICIAL_TEMPLATE_PACKS = [
  {
    id: 'academic-study-pack',
    name: 'Academic Study Pack',
    category: 'Education',
    description: 'Generates structured revision notes, key concepts, 10 practice quiz questions, and a concise chapter summary.',
    transformations: ['Study Notes', 'Quiz', 'Summary'],
    defaultAudience: 'Student',
    defaultTone: 'Academic',
    defaultLanguage: 'English',
    defaultLength: 'Detailed',
  },
  {
    id: 'teacher-lesson-pack',
    name: 'Teacher Lesson Pack',
    category: 'Education',
    description: 'Designed for educators: generates full lecture notes, a 10-slide instructional PPT deck, and diagnostic MCQs.',
    transformations: ['Study Notes', 'PPT', 'MCQs'],
    defaultAudience: 'Teacher',
    defaultTone: 'Academic',
    defaultLanguage: 'English',
    defaultLength: 'Detailed',
  },
  {
    id: 'corporate-brief',
    name: 'Corporate Brief',
    category: 'Business',
    description: 'High-signal executive summary, board-ready PowerPoint slide outline, and prioritized strategic action items.',
    transformations: ['Executive Summary', 'PPT', 'Business Report'],
    defaultAudience: 'Business Professional',
    defaultTone: 'Professional',
    defaultLanguage: 'English',
    defaultLength: 'Medium',
  },
  {
    id: 'content-creator-pack',
    name: 'Content Creator Pack',
    category: 'Marketing',
    description: 'Turns long-form research or transcripts into an SEO blog post, viral social media hooks, and a 60-second video script.',
    transformations: ['Blog', 'Social Media Post', 'Video Script'],
    defaultAudience: 'General Public',
    defaultTone: 'Creative',
    defaultLanguage: 'English',
    defaultLength: 'Medium',
  },
  {
    id: 'multilingual-distribution',
    name: 'Multilingual Global & Regional Distribution',
    category: 'Multilingual',
    description: 'Preserves technical entity names while transforming source documents into Telugu, Hindi, Tamil, Kannada, and 17 other global and regional languages.',
    transformations: ['Translation', 'Study Notes', 'Summary'],
    defaultAudience: 'Student',
    defaultTone: 'Simple',
    defaultLanguage: 'Telugu',
    defaultLength: 'Medium',
  },
];

// GET /api/templates
templatesRouter.get('/', async (req, res) => {
  try {
    return res.json({ templates: OFFICIAL_TEMPLATE_PACKS });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve templates' });
  }
});

