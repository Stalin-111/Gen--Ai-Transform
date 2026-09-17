import { TransformationType, AudienceType, ToneType, LengthType, SupportedLanguage } from '../../src/types/index.js';

export const SYSTEM_INSTRUCTION = `You are the core Generative AI engine of TransformAI.

Transform the supplied source content according to the requested
transformation type, audience, tone, language and length.

Preserve the original meaning and important information.

Preserve names, dates, numbers, technical terminology and context.

Do not invent unsupported facts.

Do not introduce information that is not supported by the source.

If information is uncertain or unavailable, clearly indicate it.

Produce structured, readable and editable output.

Follow the requested output format exactly.`;

export function getTransformationPrompt(
  type: TransformationType,
  audience: AudienceType,
  tone: ToneType,
  targetLanguage: SupportedLanguage,
  length: LengthType,
  additionalInstructions?: string
): { instructions: string; formatRequirement: string } {
  let instructions = '';
  let formatRequirement = '';

  switch (type) {
    case 'PPT':
      instructions = `Transform the content into a high-impact, professional presentation slide deck for a ${audience} audience in a ${tone} tone in ${targetLanguage}.
Generate approximately ${length === 'Short' ? '5 to 7' : length === 'Medium' ? '8 to 12' : '12 to 16'} slides.
Each slide must include a clear, compelling title, 3-5 concise, scannable bullet points, actionable speaker notes with talking points, and an optional visual idea description.`;
      formatRequirement = `Return your response in strictly valid JSON matching this schema:
{
  "title": "Presentation Main Title",
  "subtitle": "Subtitle or Topic Overview",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide Title",
      "bullets": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "speakerNotes": "Detailed speaker notes for the presenter.",
      "visualIdea": "Suggested diagram, visual metaphor, or chart"
    }
  ],
  "fullText": "Clean markdown presentation transcript"
}`;
      break;

    case 'MCQs':
    case 'Quiz':
      instructions = `Transform the content into a comprehensive evaluation quiz of Multiple Choice Questions (MCQs) for ${audience} in a ${tone} tone in ${targetLanguage}.
Generate ${length === 'Short' ? '5' : length === 'Medium' ? '10' : '15'} high-quality questions covering factual recall, critical thinking, conceptual relationships, and practical application.`;
      formatRequirement = `Return your response in strictly valid JSON matching this schema:
{
  "title": "Quiz / MCQ Assessment Title",
  "summary": "Brief scope of the quiz",
  "questions": [
    {
      "questionNumber": 1,
      "question": "Clear question stem here?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A) Option 1",
      "explanation": "Detailed rationale explaining why this is the correct answer based on the source text."
    }
  ],
  "keyPoints": ["Core concept tested 1", "Core concept tested 2"],
  "fullText": "Full formatted quiz with questions and answer keys"
}`;
      break;

    case 'Study Notes':
      instructions = `Transform the source content into thorough, highly structured study revision notes tailored for ${audience} in an ${tone} tone in ${targetLanguage}.
Organize into hierarchical topics, key definitions, core concepts, formulae/equations/dates, practical examples, and review flashcard-style takeaways.`;
      formatRequirement = `Return your response in strictly valid JSON matching this schema:
{
  "title": "Topic Study Notes",
  "summary": "Executive summary of the chapter/content",
  "sections": [
    {
      "heading": "Section Heading",
      "content": "In-depth conceptual explanation",
      "bullets": ["Core concept breakdown", "Formulas or key terms", "Important takeaways"]
    }
  ],
  "keyPoints": ["High-yield revision bullet 1", "High-yield revision bullet 2"],
  "warnings": ["Common student misconceptions or critical exceptions"],
  "fullText": "Complete formatted markdown study notes"
}`;
      break;

    case 'Summary':
    case 'Executive Summary':
      instructions = `Transform the source content into a clear, high-signal ${type} tailored for ${audience} in a ${tone} tone in ${targetLanguage}.
Length should be ${length}. Emphasize the primary objective, critical findings, quantitative data, strategic implications, and recommendations.`;
      formatRequirement = `Return your response in strictly valid JSON matching this schema:
{
  "title": "${type} Title",
  "summary": "Core overview paragraph synthesizing key findings",
  "sections": [
    {
      "heading": "Section Heading",
      "content": "Detailed synthesis and context",
      "bullets": ["Key metric or factual takeaway 1", "Key takeaway 2"]
    }
  ],
  "keyPoints": ["Major strategic takeaway 1", "Major strategic takeaway 2"],
  "warnings": ["Risks, constraints, or caveats noted in source"],
  "fullText": "Complete formatted markdown summary"
}`;
      break;

    case 'Translation':
      instructions = `Accurately translate and adapt the source content into fluent, culturally authentic and grammatically refined ${targetLanguage}.
Maintain technical precision, preserving domain-specific terminology in parentheses where appropriate for clarity. Audience: ${audience}. Tone: ${tone}.`;
      formatRequirement = `Return your response in strictly valid JSON matching this schema:
{
  "title": "Translated Title in ${targetLanguage}",
  "summary": "High-level summary of the translated document in ${targetLanguage}",
  "sections": [
    {
      "heading": "Section Heading in ${targetLanguage}",
      "content": "Fully translated content for this section",
      "bullets": ["Translated key point 1", "Translated key point 2"]
    }
  ],
  "keyPoints": ["Core translated takeaway 1", "Core translated takeaway 2"],
  "fullText": "Complete translated document in markdown"
}`;
      break;

    case 'Blog':
    case 'Article':
    case 'Business Report':
    case 'Email':
    case 'Social Media Post':
    case 'Video Script':
    case 'Podcast Script':
    case 'Simplification':
    case 'Rewrite':
    default:
      instructions = `Transform the source content into a high-caliber ${type} crafted specifically for a ${audience} audience in a ${tone} tone in ${targetLanguage}. Length profile: ${length}.
Ensure an engaging structure, clear section headers, authentic voice, and complete fidelity to source facts.`;
      formatRequirement = `Return your response in strictly valid JSON matching this schema:
{
  "title": "Transformed ${type} Title",
  "summary": "Brief summary of the transformed work",
  "sections": [
    {
      "heading": "Section Heading",
      "content": "Content narrative or script segment",
      "bullets": ["Supporting point or highlight"]
    }
  ],
  "keyPoints": ["Key takeaway 1", "Key takeaway 2"],
  "warnings": [],
  "fullText": "Complete formatted output in markdown"
}`;
      break;
  }

  if (additionalInstructions && additionalInstructions.trim()) {
    instructions += `\n\nSpecific Custom Instructions: ${additionalInstructions.trim()}`;
  }

  // Explicit multilingual mandate
  const languageDirective =
    targetLanguage === 'English'
      ? `Output Language: English.`
      : `CRITICAL MULTILINGUAL DIRECTIVE:
You MUST generate ALL output content (including titles, headings, bullet points, narrative, speaker notes, quiz questions, options, explanations, and summaries) strictly in ${targetLanguage}.
Do NOT output in English when ${targetLanguage} is selected.
Translate and transform the concepts accurately into fluent, native ${targetLanguage} script/grammar.`;

  instructions = `${languageDirective}\n\n${instructions}\n\nREMINDER: ALL JSON field values must be written in ${targetLanguage}.`;

  return { instructions, formatRequirement };
}

export const QUALITY_CHECK_PROMPT = `You are the automated AI Quality Assurance Inspector of TransformAI.
Evaluate the generated transformation against the provided original source document.

Assess the following criteria rigorously:
1. Source Coverage (0-100%): How well does the transformed output capture the key themes and scope of the source?
2. Consistency & Fact Retention (0-100%): Are numbers, names, technical terms, dates, and conclusions true to the source with zero hallucinated contradictions?
3. Structure & Readability ('Good', 'Fair', or 'Needs Review'): Does the formatting follow logical headings, flow, and clarity?
4. Retained Key Entities: List the essential names, numbers, acronyms, and terms correctly preserved.
5. Potential Issues: List any omissions, nuances requiring human review, or ambiguities.
6. Unsupported Claims: List any assertions that cannot be verified directly from the source text.

Return your evaluation in strictly valid JSON matching this schema:
{
  "sourceCoverage": 94,
  "consistency": 96,
  "structure": "Good",
  "retainedKeyEntities": ["Entity 1", "Entity 2", "Metric 3"],
  "potentialIssues": ["Issue or review recommendation if any"],
  "unsupportedClaims": [],
  "disclaimer": "AI-assisted quality checks provide heuristic verification and do not substitute for expert domain certification."
}`;
