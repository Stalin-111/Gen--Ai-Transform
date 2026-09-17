export type TransformationType =
  | 'Summary'
  | 'Study Notes'
  | 'PPT'
  | 'MCQs'
  | 'Quiz'
  | 'Blog'
  | 'Article'
  | 'Email'
  | 'Business Report'
  | 'Executive Summary'
  | 'Social Media Post'
  | 'Video Script'
  | 'Podcast Script'
  | 'Simplification'
  | 'Rewrite'
  | 'Translation';

export type AudienceType =
  | 'Student'
  | 'Teacher'
  | 'Developer'
  | 'Business Professional'
  | 'General Public'
  | 'Beginner'
  | 'Expert';

export type ToneType =
  | 'Professional'
  | 'Academic'
  | 'Friendly'
  | 'Simple'
  | 'Technical'
  | 'Creative'
  | 'Formal';

export type LengthType = 'Short' | 'Medium' | 'Detailed';

export type SupportedLanguage =
  | 'English'
  | 'Telugu'
  | 'Hindi'
  | 'Tamil'
  | 'Kannada'
  | 'Malayalam'
  | 'Bengali'
  | 'Marathi'
  | 'Gujarati'
  | 'Punjabi'
  | 'Urdu'
  | 'Spanish'
  | 'French'
  | 'German'
  | 'Japanese'
  | 'Mandarin'
  | 'Arabic'
  | 'Portuguese'
  | 'Russian'
  | 'Italian'
  | 'Korean';

export interface DocumentMetadata {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  extractedText: string;
  pageCount: number;
  wordCount: number;
  charCount: number;
  createdAt: string;
}

export interface StructuredSection {
  heading: string;
  content: string;
  bullets?: string[];
}

export interface SlideItem {
  slideNumber: number;
  title: string;
  bullets: string[];
  speakerNotes: string;
  visualIdea?: string;
}

export interface MCQItem {
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface StructuredContent {
  title: string;
  summary?: string;
  sections?: StructuredSection[];
  keyPoints?: string[];
  warnings?: string[];
  slides?: SlideItem[];
  questions?: MCQItem[];
  fullText?: string;
}

export interface QualityCheckResult {
  sourceCoverage: number; // e.g. 94
  consistency: number; // e.g. 96
  structure: 'Good' | 'Fair' | 'Needs Review';
  retainedKeyEntities: string[];
  potentialIssues: string[];
  unsupportedClaims: string[];
  disclaimer: string;
}

export interface TransformationVersion {
  id: string;
  transformationId: string;
  versionNumber: number;
  content: string;
  structuredJson?: StructuredContent;
  qualityResult?: QualityCheckResult;
  createdAt: string;
  editNote?: string;
}

export interface TransformationRecord {
  id: string;
  documentId?: string;
  documentTitle: string;
  transformationType: TransformationType;
  audience: AudienceType;
  tone: ToneType;
  targetLanguage: SupportedLanguage;
  sourceLanguage: string;
  lengthSetting: LengthType;
  additionalInstructions?: string;
  sourceContent: string;
  generatedContent: string;
  structuredJson?: StructuredContent;
  qualityResult?: QualityCheckResult;
  fallbackNotice?: string;
  status: 'draft' | 'completed' | 'failed';
  currentVersion: number;
  versions?: TransformationVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  transformations: TransformationType[];
  defaultAudience: AudienceType;
  defaultTone: ToneType;
  defaultLanguage: SupportedLanguage;
  defaultLength: LengthType;
}

export interface TemplateItem {
  id: string;
  title: string;
  category: 'Education' | 'Quiz' | 'Presentation' | 'Business' | 'Marketing' | 'Multilingual';
  description: string;
  transformationType: TransformationType;
  audience: AudienceType;
  tone: ToneType;
  targetLanguage: SupportedLanguage;
  lengthSetting: LengthType;
  samplePrompt?: string;
  iconName: string;
}

export interface UsageStatistics {
  documentsProcessed: number;
  transformationsCreated: number;
  filesGenerated: number;
  languagesUsed: number;
  estimatedTimeSavedHours: number;
  averageProcessingTimeSec: number;
  typeDistribution: { name: string; value: number }[];
  languageDistribution: { name: string; value: number }[];
  timelineData: { date: string; transformations: number; documents: number }[];
}

export type ProcessingStep = {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
};
