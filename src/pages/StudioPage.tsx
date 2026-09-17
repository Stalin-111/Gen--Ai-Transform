import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Wand2,
  FileText,
  Copy,
  Check,
  Edit3,
  RotateCcw,
  Save,
  Download,
  Share2,
  History,
  Layers,
  ChevronRight,
  Maximize2,
  Minimize2,
  AlertCircle,
  Clock,
  Presentation,
  CheckCircle,
  HelpCircle,
  Globe,
  Languages,
} from 'lucide-react';
import {
  TransformationType,
  AudienceType,
  ToneType,
  LengthType,
  SupportedLanguage,
  TransformationRecord,
  StructuredContent,
  QualityCheckResult,
} from '../types';
import { generateTransformation, updateTransformation, translateTextApi } from '../services/api';
import {
  SUPPORTED_LANGUAGES,
  INDIAN_LANGUAGES,
  GLOBAL_LANGUAGES,
  getLanguageInfo,
} from '../constants/languages';
import { ProcessingTimeline } from '../components/ProcessingTimeline';
import { QualityCheckBadge } from '../components/QualityCheckBadge';
import { ExportModal } from '../components/ExportModal';
import { VersionHistoryModal } from '../components/VersionHistoryModal';
import { SAMPLE_DOCUMENTS } from '../utils/sampleData';

interface StudioPageProps {
  initialDocument?: {
    id?: string;
    title: string;
    text: string;
    wordCount: number;
    charCount: number;
    pageCount: number;
  };
  initialPreset?: {
    transformationType?: TransformationType;
    audience?: AudienceType;
    tone?: ToneType;
    targetLanguage?: SupportedLanguage;
  };
  loadedTransformation?: TransformationRecord | null;
  onTransformationSaved?: (rec: TransformationRecord) => void;
}

export const StudioPage: React.FC<StudioPageProps> = ({
  initialDocument,
  initialPreset,
  loadedTransformation,
  onTransformationSaved,
}) => {
  // Source State
  const [docTitle, setDocTitle] = useState<string>(
    loadedTransformation?.documentTitle ||
      initialDocument?.title ||
      SAMPLE_DOCUMENTS[0].title
  );
  const [sourceText, setSourceText] = useState<string>(
    loadedTransformation?.sourceContent ||
      initialDocument?.text ||
      SAMPLE_DOCUMENTS[0].content
  );
  const [docId, setDocId] = useState<string | undefined>(
    loadedTransformation?.documentId || initialDocument?.id
  );

  // Settings State
  const [transType, setTransType] = useState<TransformationType>(
    loadedTransformation?.transformationType ||
      initialPreset?.transformationType ||
      'Study Notes'
  );
  const [audience, setAudience] = useState<AudienceType>(
    loadedTransformation?.audience || initialPreset?.audience || 'Student'
  );
  const [tone, setTone] = useState<ToneType>(
    loadedTransformation?.tone || initialPreset?.tone || 'Academic'
  );
  const [lengthSetting, setLengthSetting] = useState<LengthType>(
    loadedTransformation?.lengthSetting || 'Medium'
  );
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>(
    loadedTransformation?.targetLanguage || initialPreset?.targetLanguage || 'English'
  );
  const [additionalInstructions, setAdditionalInstructions] = useState<string>(
    loadedTransformation?.additionalInstructions || ''
  );

  // Execution & Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'keyPoints' | 'quality' | 'metadata'>('content');
  const [generatedText, setGeneratedText] = useState<string>(
    loadedTransformation?.generatedContent || ''
  );
  const [structuredData, setStructuredData] = useState<StructuredContent | undefined>(
    loadedTransformation?.structuredJson
  );
  const [qualityData, setQualityData] = useState<QualityCheckResult | undefined>(
    loadedTransformation?.qualityResult
  );
  const [currentRecord, setCurrentRecord] = useState<TransformationRecord | null>(
    loadedTransformation || null
  );

  // Editing & Versioning State
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [showExportModal, setShowExportModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);

  // Multilingual State
  const [langCategory, setLangCategory] = useState<'Indian' | 'Global'>('Indian');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslateMenu, setShowTranslateMenu] = useState(false);

  // Instant Output Translation Handler
  const handleTranslateOutput = async (newLang: SupportedLanguage) => {
    if (!generatedText) return;
    setIsTranslating(true);
    setShowTranslateMenu(false);
    try {
      const res = await translateTextApi({
        text: generatedText,
        targetLanguage: newLang,
      });
      if (res.success && res.translatedText) {
        setGeneratedText(res.translatedText);
        setTargetLanguage(newLang);
        if (currentRecord) {
          const updated: TransformationRecord = {
            ...currentRecord,
            generatedContent: res.translatedText,
            targetLanguage: newLang,
            currentVersion: (currentRecord.currentVersion || 1) + 1,
            updatedAt: new Date().toISOString(),
          };
          setCurrentRecord(updated);
          await updateTransformation(currentRecord.id, {
            editedContent: res.translatedText,
            editNote: `Translated output into ${newLang}`,
          });
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  // Compute live source stats
  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;
  const charCount = sourceText.length;
  const pageCount = Math.max(1, Math.ceil(wordCount / 350));

  // Sync props when user switches documents
  useEffect(() => {
    if (initialDocument) {
      setDocTitle(initialDocument.title);
      setSourceText(initialDocument.text);
      setDocId(initialDocument.id);
    }
  }, [initialDocument]);

  useEffect(() => {
    if (initialPreset) {
      if (initialPreset.transformationType) setTransType(initialPreset.transformationType);
      if (initialPreset.audience) setAudience(initialPreset.audience);
      if (initialPreset.tone) setTone(initialPreset.tone);
      if (initialPreset.targetLanguage) setTargetLanguage(initialPreset.targetLanguage);
    }
  }, [initialPreset]);

  useEffect(() => {
    if (loadedTransformation) {
      setDocTitle(loadedTransformation.documentTitle);
      setSourceText(loadedTransformation.sourceContent);
      setTransType(loadedTransformation.transformationType);
      setAudience(loadedTransformation.audience);
      setTone(loadedTransformation.tone);
      setTargetLanguage(loadedTransformation.targetLanguage);
      setGeneratedText(loadedTransformation.generatedContent);
      setStructuredData(loadedTransformation.structuredJson);
      setQualityData(loadedTransformation.qualityResult);
      setCurrentRecord(loadedTransformation);
      setEditableContent(loadedTransformation.generatedContent);
    }
  }, [loadedTransformation]);

  const handleGenerate = async () => {
    if (!sourceText.trim()) {
      setErrorMessage('Source content cannot be empty.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setIsEditing(false);

    try {
      const res = await generateTransformation({
        sourceContent: sourceText,
        documentId: docId,
        documentTitle: docTitle,
        transformationType: transType,
        audience,
        tone,
        targetLanguage,
        lengthSetting,
        additionalInstructions,
      });

      setGeneratedText(res.transformation.generatedContent);
      setStructuredData(res.transformation.structuredJson);
      setQualityData(res.transformation.qualityResult);
      setCurrentRecord(res.transformation);
      setEditableContent(res.transformation.generatedContent);
      setActiveTab('content');

      if (onTransformationSaved) {
        onTransformationSaved(res.transformation);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'The AI service is temporarily unavailable. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editableContent : generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = async () => {
    if (!currentRecord) return;
    setIsSaving(true);
    try {
      await updateTransformation(currentRecord.id, {
        editedContent: editableContent,
        structuredJson: structuredData,
        editNote: `Manual Edit at ${new Date().toLocaleTimeString()}`,
      });
      setGeneratedText(editableContent);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      alert('Failed to save edited version');
    } finally {
      setIsSaving(false);
    }
  };

  const transformationTypes: TransformationType[] = [
    'Summary',
    'Study Notes',
    'PPT',
    'MCQs',
    'Quiz',
    'Blog',
    'Article',
    'Email',
    'Business Report',
    'Executive Summary',
    'Social Media Post',
    'Video Script',
    'Podcast Script',
    'Simplification',
    'Rewrite',
    'Translation',
  ];

  const audiences: AudienceType[] = [
    'Student',
    'Teacher',
    'Developer',
    'Business Professional',
    'General Public',
    'Beginner',
    'Expert',
  ];

  const tones: ToneType[] = [
    'Professional',
    'Academic',
    'Friendly',
    'Simple',
    'Technical',
    'Creative',
    'Formal',
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Studio Header */}
      <div className="clay-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold text-[#0F172A] font-['Space_Grotesk'] tracking-tight">
              Transformation Studio
            </h1>
            <span className="clay-pill px-3 py-0.5 text-xs font-bold text-[#2563EB]">
              Interactive Workbench
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5 font-normal">
            Configure parameters, prompt AI engine, review quality metrics and export artifacts
          </p>
        </div>

        {/* Visual Pipeline indicator */}
        <div className="clay-card p-2.5 flex items-center gap-3 sm:gap-5 text-xs font-mono font-semibold bg-[#FFFFFF]">
          <div className="flex items-center space-x-1.5 text-[#475569]">
            <span className="h-2 w-2 rounded-full bg-[#3B82F6]"></span>
            <span>INPUT</span>
          </div>
          <span className="text-[#0EA5E9]">→</span>
          <div className="flex items-center space-x-1.5 text-[#0EA5E9]">
            <Sparkles className="h-3.5 w-3.5 text-[#0EA5E9] animate-pulse" />
            <span>AI PROCESSING</span>
          </div>
          <span className="text-[#0EA5E9]">→</span>
          <div className="flex items-center space-x-1.5 text-[#2563EB]">
            <span className="h-2 w-2 rounded-full bg-[#2563EB]"></span>
            <span>OUTPUT</span>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="clay-card p-4 border-rose-300 bg-rose-50 text-xs text-rose-700 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-rose-900">Execution Notice: </span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Fallback Engine Notice Banner */}
      {currentRecord?.fallbackNotice && (
        <div className="clay-card p-4 border-amber-300 bg-amber-50 text-xs text-amber-800 flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-950">Local Content Engine Active: </span>
              <span>{currentRecord.fallbackNotice}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Core Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Source Content (5 cols) - Input Surface #FFFFFF */}
        <div className="lg:col-span-5 clay-card p-6 space-y-5 bg-[#FFFFFF]">
          <div className="flex items-center justify-between border-b border-[#DBEAFE] pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-[#2563EB]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-['Space_Grotesk']">
                Source Content
              </h3>
            </div>
            <span className="clay-pill px-2.5 py-0.5 text-[11px] font-mono text-[#64748B] font-medium">
              {wordCount} words • {charCount} chars • {pageCount} {pageCount === 1 ? 'page' : 'pages'}
            </span>
          </div>

          {/* Document Title input */}
          <div>
            <label className="block text-[11px] font-semibold text-[#475569] mb-1.5">
              Document Label / Subject
            </label>
            <input
              type="text"
              id="source-doc-title-input"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full clay-inset px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none bg-[#FFFFFF]"
              placeholder="e.g. AI Foundations in India"
            />
          </div>

          {/* Source Text Preview & Edit Area */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1.5">
              <span className="font-medium text-[#475569]">Original Source Corpus</span>
              <span className="text-[#2563EB] text-[10px] font-semibold">Editable directly</span>
            </div>
            <textarea
              id="source-content-textarea"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              rows={16}
              placeholder="Paste or upload text here..."
              className="w-full clay-inset p-4 text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none leading-relaxed bg-[#FFFFFF]"
            />
          </div>

          {/* Quick sample switches */}
          <div className="pt-3 border-t border-[#DBEAFE] flex items-center justify-between text-[11px]">
            <span className="text-[#64748B] font-medium">Quick Samples:</span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_DOCUMENTS.map((sDoc) => (
                <button
                  key={sDoc.id}
                  onClick={() => {
                    setDocTitle(sDoc.title);
                    setSourceText(sDoc.content);
                  }}
                  className="clay-pill px-3 py-1 text-xs text-[#2563EB] hover:text-[#1D4ED8] transition-colors font-medium bg-[#F0F9FF]"
                >
                  {sDoc.id === 'sample-ai-intro' ? 'AI in India' : sDoc.id === 'sample-clean-energy' ? 'Smart Grid' : 'NEP 2020'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Transformation Settings & Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="clay-card p-6 space-y-5 bg-[#FFFFFF]">
            <div className="border-b border-[#DBEAFE] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-['Space_Grotesk']">
                Transformation Settings
              </h3>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Target model behavior, audience complexity, and desired linguistic format
              </p>
            </div>

            {/* 1. Transformation Types Grid */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-2.5">
                1. Transformation Type ({transformationTypes.length} options)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {transformationTypes.map((t) => {
                  const isSelected = transType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      id={`type-btn-${t.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setTransType(t)}
                      className={`clay-btn px-3 py-2.5 text-xs text-left justify-start truncate ${
                        isSelected
                          ? 'clay-btn-primary font-bold text-white'
                          : 'clay-btn-secondary text-[#475569]'
                      }`}
                    >
                      <span className="truncate">{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Audience, Tone & Length Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Audience */}
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] mb-1.5">
                  Target Audience
                </label>
                <select
                  id="select-audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as AudienceType)}
                  className="w-full clay-inset px-3 py-2.5 text-xs text-[#0F172A] bg-[#FFFFFF] focus:outline-none border border-[#DBEAFE]"
                >
                  {audiences.map((aud) => (
                    <option key={aud} value={aud} className="bg-[#FFFFFF] text-[#0F172A]">
                      {aud}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] mb-1.5">
                  Voice & Tone
                </label>
                <select
                  id="select-tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as ToneType)}
                  className="w-full clay-inset px-3 py-2.5 text-xs text-[#0F172A] bg-[#FFFFFF] focus:outline-none border border-[#DBEAFE]"
                >
                  {tones.map((to) => (
                    <option key={to} value={to} className="bg-[#FFFFFF] text-[#0F172A]">
                      {to}
                    </option>
                  ))}
                </select>
              </div>

              {/* Length */}
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] mb-1.5">
                  Output Length
                </label>
                <div className="grid grid-cols-3 gap-1.5 clay-inset p-1 bg-[#F8FAFC]">
                  {(['Short', 'Medium', 'Detailed'] as LengthType[]).map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => setLengthSetting(len)}
                      className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                        lengthSetting === len
                          ? 'clay-btn-primary text-white'
                          : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Target Language Selector (Multilingual Support) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-semibold text-[#475569] flex items-center space-x-1.5">
                  <Languages className="h-3.5 w-3.5 text-[#2563EB]" />
                  <span>Target Language (Multilingual Support)</span>
                </label>
                <div className="flex items-center space-x-1.5 clay-inset p-1 bg-[#F8FAFC]">
                  <button
                    type="button"
                    onClick={() => setLangCategory('Indian')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                      langCategory === 'Indian'
                        ? 'clay-btn-primary text-white'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    🇮🇳 Indian ({INDIAN_LANGUAGES.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLangCategory('Global')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                      langCategory === 'Global'
                        ? 'clay-btn-primary text-white'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    🌐 Global ({GLOBAL_LANGUAGES.length})
                  </button>
                </div>
              </div>

              {/* Language Pills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(langCategory === 'Indian' ? INDIAN_LANGUAGES : GLOBAL_LANGUAGES).map((langInfo) => {
                  const isSelected = targetLanguage === langInfo.id;
                  return (
                    <button
                      key={langInfo.id}
                      type="button"
                      id={`lang-btn-${langInfo.id.toLowerCase()}`}
                      onClick={() => setTargetLanguage(langInfo.id)}
                      className={`clay-btn py-2.5 px-3 text-left flex flex-col justify-center items-start ${
                        isSelected
                          ? 'clay-btn-primary font-bold text-white'
                          : 'clay-btn-secondary text-[#475569]'
                      }`}
                    >
                      <span className="text-[11px] font-semibold flex items-center space-x-1 truncate w-full">
                        <span>{langInfo.flag}</span>
                        <span className="truncate">{langInfo.nativeName}</span>
                      </span>
                      <span className="text-[10px] opacity-75 truncate w-full">{langInfo.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Selection Badge */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#64748B] px-1">
                <span className="flex items-center space-x-1.5">
                  <span className="text-[#64748B]">Selected:</span>
                  <span className="clay-pill px-3 py-1 text-[#2563EB] font-semibold inline-flex items-center space-x-1.5 bg-[#F0F9FF]">
                    <span>{getLanguageInfo(targetLanguage).flag}</span>
                    <span>{getLanguageInfo(targetLanguage).nativeName}</span>
                    <span className="text-[#64748B]">({targetLanguage})</span>
                  </span>
                </span>
                <span className="clay-pill px-2.5 py-0.5 text-[10px] text-[#2563EB] font-medium bg-[#F0F9FF]">Multilingual Support</span>
              </div>
            </div>

            {/* 4. Additional Instructions */}
            <div>
              <label className="block text-[11px] font-semibold text-[#475569] mb-1.5">
                Additional Instructions (Optional Custom Directives)
              </label>
              <input
                type="text"
                id="additional-instructions-input"
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="e.g. Include specific focus on GPU investments and policy dates..."
                className="w-full clay-inset px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none bg-[#FFFFFF]"
              />
            </div>

            {/* Primary Action Button (#2563EB) */}
            <div className="pt-2">
              <button
                id="generate-transformation-btn"
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="clay-btn clay-btn-primary w-full py-4 text-sm font-bold space-x-2 disabled:opacity-50 text-white"
              >
                <Sparkles className="h-4 w-4 text-white" />
                <span>✨ Generate Transformation</span>
              </button>
            </div>
          </div>

          {/* Processing Timeline Indicator */}
          {isGenerating && (
            <div className="animate-in fade-in">
              <ProcessingTimeline />
            </div>
          )}

          {/* Generated Result Interface (Output Surface #F0F9FF - Very Light Blue) */}
          {(generatedText || structuredData) && !isGenerating && (
            <div className="clay-card-sky p-6 space-y-4 animate-in fade-in bg-[#F0F9FF] border border-[#DBEAFE]">
              {/* Header & Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DBEAFE] pb-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`px-3 py-1.5 text-xs font-semibold ${
                      activeTab === 'content'
                        ? 'clay-pill-active'
                        : 'clay-pill text-[#475569] hover:text-[#1D4ED8] bg-[#FFFFFF]'
                    }`}
                  >
                    Generated Content
                  </button>

                  <button
                    onClick={() => setActiveTab('keyPoints')}
                    className={`px-3 py-1.5 text-xs font-semibold ${
                      activeTab === 'keyPoints'
                        ? 'clay-pill-active'
                        : 'clay-pill text-[#475569] hover:text-[#1D4ED8] bg-[#FFFFFF]'
                    }`}
                  >
                    Key Points
                  </button>

                  <button
                    onClick={() => setActiveTab('quality')}
                    className={`px-3 py-1.5 text-xs font-semibold flex items-center space-x-1.5 ${
                      activeTab === 'quality'
                        ? 'clay-pill-active'
                        : 'clay-pill text-[#16A34A] bg-[#FFFFFF]'
                    }`}
                  >
                    <span>Quality Check</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]"></span>
                  </button>

                  <button
                    onClick={() => setActiveTab('metadata')}
                    className={`px-3 py-1.5 text-xs font-semibold ${
                      activeTab === 'metadata'
                        ? 'clay-pill-active'
                        : 'clay-pill text-[#475569] hover:text-[#1D4ED8] bg-[#FFFFFF]'
                    }`}
                  >
                    Metadata
                  </button>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopy}
                    id="copy-result-btn"
                    className="clay-btn clay-btn-secondary px-3 py-1.5 text-xs space-x-1"
                    title="Copy Content"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-[#16A34A]" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    id="edit-result-btn"
                    className={`clay-btn px-3 py-1.5 text-xs space-x-1 ${
                      isEditing
                        ? 'clay-btn-amber text-white'
                        : 'clay-btn-secondary'
                    }`}
                    title="Edit content before export"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>{isEditing ? 'Cancel Edit' : 'Edit'}</span>
                  </button>

                  <button
                    onClick={handleGenerate}
                    className="clay-btn clay-btn-secondary px-3 py-1.5 text-xs space-x-1"
                    title="Regenerate with AI Engine"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Regenerate</span>
                  </button>

                  {isEditing && (
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="clay-btn clay-btn-emerald px-3.5 py-1.5 text-xs space-x-1 text-white"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{isSaving ? 'Saving...' : 'Save Edit'}</span>
                    </button>
                  )}

                  {/* Translate Output Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      id="translate-output-btn"
                      onClick={() => setShowTranslateMenu(!showTranslateMenu)}
                      disabled={isTranslating}
                      className="clay-btn clay-btn-primary px-3.5 py-1.5 text-xs space-x-1.5 text-white"
                      title="Translate this generated content into another language"
                    >
                      <Globe className={`h-3.5 w-3.5 ${isTranslating ? 'animate-spin text-white' : ''}`} />
                      <span>{isTranslating ? 'Translating...' : 'Translate'}</span>
                    </button>

                    {showTranslateMenu && (
                      <div className="absolute right-0 mt-2 w-64 clay-modal p-3 z-50 animate-in fade-in zoom-in-95 max-h-80 overflow-y-auto bg-[#FFFFFF] border border-[#DBEAFE] shadow-xl">
                        <div className="px-2 py-1 text-[11px] font-bold text-[#0F172A] border-b border-[#DBEAFE] flex justify-between items-center">
                          <span>Translate Output Into:</span>
                          <span className="clay-pill px-2 py-0.5 text-[10px] text-[#2563EB]">Global & Indian</span>
                        </div>

                        {/* Indian Languages */}
                        <div className="mt-2 px-2 text-[10px] font-bold text-amber-700">🇮🇳 Indian Languages</div>
                        <div className="grid grid-cols-1 gap-1 mt-1">
                          {INDIAN_LANGUAGES.map((l) => (
                            <button
                              key={l.id}
                              type="button"
                              onClick={() => handleTranslateOutput(l.id)}
                              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-left hover:bg-[#F0F9FF] text-[#0F172A] transition-colors"
                            >
                              <span className="font-medium">{l.flag} {l.nativeName}</span>
                              <span className="text-[10px] text-[#64748B]">{l.name}</span>
                            </button>
                          ))}
                        </div>

                        {/* Global Languages */}
                        <div className="mt-2.5 px-2 text-[10px] font-bold text-[#2563EB]">🌐 Global Languages</div>
                        <div className="grid grid-cols-1 gap-1 mt-1">
                          {GLOBAL_LANGUAGES.map((l) => (
                            <button
                              key={l.id}
                              type="button"
                              onClick={() => handleTranslateOutput(l.id)}
                              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-left hover:bg-[#F0F9FF] text-[#0F172A] transition-colors"
                            >
                              <span className="font-medium">{l.flag} {l.nativeName}</span>
                              <span className="text-[10px] text-[#64748B]">{l.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setShowExportModal(true)}
                    id="export-download-btn"
                    className="clay-btn clay-btn-primary px-4 py-1.5 text-xs space-x-1.5 text-white"
                    title="Download DOCX, PPTX, PDF, etc."
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export</span>
                  </button>

                  {currentRecord && (
                    <button
                      onClick={() => setShowVersionModal(true)}
                      className="clay-btn clay-btn-secondary p-2"
                      title="Version History"
                    >
                      <History className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tab 1: Generated Content */}
              {activeTab === 'content' && (
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-amber-800 font-semibold">
                        <span>Direct Editor (Edits will create a new Version in SQLite)</span>
                        <span className="text-[#64748B] font-normal">Markdown & formatting supported</span>
                      </div>
                      <textarea
                        value={editableContent}
                        onChange={(e) => setEditableContent(e.target.value)}
                        rows={16}
                        className="w-full clay-inset p-4 text-xs font-mono text-[#0F172A] focus:outline-none leading-relaxed border-[#F59E0B]/60 bg-[#FFFFFF]"
                      />
                    </div>
                  ) : structuredData?.slides && structuredData.slides.length > 0 ? (
                    /* Interactive PPT Slide Deck Viewer */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#0F172A] font-['Space_Grotesk']">
                          {structuredData.title}
                        </h4>
                        <span className="clay-pill px-3 py-0.5 text-xs font-mono text-[#2563EB] font-semibold bg-[#FFFFFF]">
                          {structuredData.slides.length} Slides Generated
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {structuredData.slides.map((slide) => (
                          <div
                            key={slide.slideNumber}
                            className="clay-card p-5 space-y-2 bg-[#FFFFFF]"
                          >
                            <div className="flex items-center justify-between text-xs font-mono text-[#2563EB] mb-2">
                              <span className="font-bold">Slide {slide.slideNumber}</span>
                              {slide.visualIdea && (
                                <span className="text-[10px] text-[#64748B] truncate max-w-[140px]">
                                  {slide.visualIdea}
                                </span>
                              )}
                            </div>
                            <h5 className="text-sm font-bold text-[#0F172A] mb-2">{slide.title}</h5>
                            <ul className="space-y-1 text-xs text-[#334155] pl-4 list-disc mb-3">
                              {slide.bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                            {slide.speakerNotes && (
                              <div className="clay-inset p-2.5 text-[11px] text-amber-900 bg-amber-50 border border-amber-200">
                                <strong className="text-amber-800">Speaker Notes:</strong> {slide.speakerNotes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : structuredData?.questions && structuredData.questions.length > 0 ? (
                    /* Interactive MCQs / Quiz Viewer */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#0F172A] font-['Space_Grotesk']">
                          {structuredData.title}
                        </h4>
                        <span className="clay-pill px-3 py-0.5 text-xs font-mono text-[#16A34A] font-semibold bg-[#FFFFFF]">
                          {structuredData.questions.length} Questions
                        </span>
                      </div>
                      <div className="space-y-3">
                        {structuredData.questions.map((q) => (
                          <div
                            key={q.questionNumber}
                            className="clay-card p-5 bg-[#FFFFFF]"
                          >
                            <div className="text-xs font-bold text-[#0F172A] mb-2.5">
                              Q{q.questionNumber}. {q.question}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                              {q.options.map((opt, oi) => {
                                const isCorrect = opt.startsWith(q.correctAnswer.slice(0, 2)) || opt === q.correctAnswer;
                                return (
                                  <div
                                    key={oi}
                                    className={`p-2.5 text-xs rounded-xl ${
                                      isCorrect
                                        ? 'clay-btn-emerald font-semibold text-white'
                                        : 'clay-inset text-[#334155] bg-[#F8FAFC]'
                                    }`}
                                  >
                                    {opt}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-[11px] text-emerald-800 mt-2.5 clay-inset p-2.5 bg-emerald-50 border border-emerald-200">
                              <span className="font-semibold text-emerald-900">Explanation: </span>
                              {q.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Formatted Markdown Display in Recessed Sunken Well */
                    <div className="clay-inset p-5 font-mono text-xs text-[#0F172A] whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto bg-[#FFFFFF]">
                      {generatedText}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Key Points */}
              {activeTab === 'keyPoints' && (
                <div className="clay-inset p-5 space-y-3 bg-[#FFFFFF]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] font-['Space_Grotesk']">
                    Extracted High-Signal Takeaways
                  </h4>
                  {structuredData?.keyPoints && structuredData.keyPoints.length > 0 ? (
                    <ul className="space-y-2 text-xs text-[#334155] pl-4 list-disc">
                      {structuredData.keyPoints.map((kp, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {kp}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#64748B]">
                      Primary key points are integrated directly within the generated section headings.
                    </p>
                  )}
                </div>
              )}

              {/* Tab 3: Quality Check */}
              {activeTab === 'quality' && (
                <div>
                  <QualityCheckBadge qualityResult={qualityData} />
                </div>
              )}

              {/* Tab 4: Metadata */}
              {activeTab === 'metadata' && (
                <div className="clay-inset p-5 space-y-3 font-mono text-xs text-[#334155] bg-[#FFFFFF]">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[#64748B]">Transformation:</span>{' '}
                      <strong className="text-[#0F172A]">{transType}</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Audience:</span>{' '}
                      <strong className="text-[#0F172A]">{audience}</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Tone:</span>{' '}
                      <strong className="text-[#0F172A]">{tone}</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Target Language:</span>{' '}
                      <strong className="text-[#0F172A]">{targetLanguage}</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Length Profile:</span>{' '}
                      <strong className="text-[#0F172A]">{lengthSetting}</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Engine:</span>{' '}
                      <strong className="text-[#2563EB] font-bold">AI Core Engine</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title={docTitle}
        content={isEditing ? editableContent : generatedText}
        structuredJson={structuredData}
        transformationType={transType}
      />

      {/* Version History Modal */}
      {currentRecord && (
        <VersionHistoryModal
          isOpen={showVersionModal}
          onClose={() => setShowVersionModal(false)}
          versions={currentRecord.versions || [
            {
              id: 'ver-1',
              transformationId: currentRecord.id,
              versionNumber: 1,
              content: currentRecord.generatedContent,
              createdAt: currentRecord.createdAt,
              editNote: 'Initial AI Generation',
            },
          ]}
          currentVersionNumber={currentRecord.currentVersion || 1}
          onSelectVersion={(ver) => {
            setGeneratedText(ver.content);
            setEditableContent(ver.content);
            if (ver.structuredJson) setStructuredData(ver.structuredJson);
            if (ver.qualityResult) setQualityData(ver.qualityResult);
          }}
        />
      )}
    </div>
  );
};
