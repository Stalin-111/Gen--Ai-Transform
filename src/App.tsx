import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { StudioPage } from './pages/StudioPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { HistoryPage } from './pages/HistoryPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { SettingsPage } from './pages/SettingsPage';
import { TransformationRecord, Template, TransformationType, AudienceType, ToneType, SupportedLanguage } from './types';
import { SAMPLE_DOCUMENTS } from './utils/sampleData';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  // State shared between pages
  const [activeDocument, setActiveDocument] = useState<{
    id?: string;
    title: string;
    text: string;
    wordCount: number;
    charCount: number;
    pageCount: number;
  }>({
    title: SAMPLE_DOCUMENTS[0].title,
    text: SAMPLE_DOCUMENTS[0].content,
    wordCount: SAMPLE_DOCUMENTS[0].wordCount,
    charCount: SAMPLE_DOCUMENTS[0].content.length,
    pageCount: SAMPLE_DOCUMENTS[0].pageCount,
  });

  const [activePreset, setActivePreset] = useState<{
    transformationType?: TransformationType;
    audience?: AudienceType;
    tone?: ToneType;
    targetLanguage?: SupportedLanguage;
  }>({
    transformationType: 'Study Notes',
    audience: 'Student',
    tone: 'Academic',
    targetLanguage: 'English',
  });

  const [loadedTransformation, setLoadedTransformation] = useState<TransformationRecord | null>(null);

  // Navigation router
  const handleNavigate = (page: string, params?: any) => {
    if (params) {
      if (params.transformationType || params.targetLanguage || params.audience) {
        setActivePreset((prev) => ({
          ...prev,
          ...params,
        }));
      }
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Upload to Studio workflow
  const handleDocumentReady = (doc: {
    id?: string;
    title: string;
    text: string;
    wordCount: number;
    charCount: number;
    pageCount: number;
  }) => {
    setActiveDocument(doc);
    setLoadedTransformation(null);
    setCurrentPage('studio');
  };

  // Select transformation from Dashboard or History
  const handleSelectTransformation = (rec: TransformationRecord, startEdit?: boolean) => {
    setLoadedTransformation(rec);
    setActiveDocument({
      id: rec.documentId,
      title: rec.documentTitle,
      text: rec.sourceContent,
      wordCount: rec.sourceContent.split(/\s+/).filter(Boolean).length,
      charCount: rec.sourceContent.length,
      pageCount: Math.max(1, Math.ceil(rec.sourceContent.split(/\s+/).filter(Boolean).length / 350)),
    });
    setActivePreset({
      transformationType: rec.transformationType,
      audience: rec.audience,
      tone: rec.tone,
      targetLanguage: rec.targetLanguage,
    });
    setCurrentPage('studio');
  };

  // Duplicate transformation
  const handleDuplicateTransformation = (rec: TransformationRecord) => {
    setLoadedTransformation(null);
    setActiveDocument({
      title: `${rec.documentTitle} (Copy)`,
      text: rec.sourceContent,
      wordCount: rec.sourceContent.split(/\s+/).filter(Boolean).length,
      charCount: rec.sourceContent.length,
      pageCount: Math.max(1, Math.ceil(rec.sourceContent.split(/\s+/).filter(Boolean).length / 350)),
    });
    setActivePreset({
      transformationType: rec.transformationType,
      audience: rec.audience,
      tone: rec.tone,
      targetLanguage: rec.targetLanguage,
    });
    setCurrentPage('studio');
  };

  // Apply template
  const handleApplyTemplate = (tmpl: Template) => {
    setLoadedTransformation(null);
    setActivePreset({
      transformationType: tmpl.transformations[0] || 'Study Notes',
      audience: tmpl.defaultAudience,
      tone: tmpl.defaultTone,
      targetLanguage: tmpl.defaultLanguage,
    });
    setCurrentPage('studio');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#2563EB]/20 selection:text-[#1D4ED8] flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Universal Navigation */}
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onStartTransforming={() => handleNavigate('studio')}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigate={handleNavigate}
            onSelectTransformation={handleSelectTransformation}
          />
        )}

        {currentPage === 'upload' && (
          <UploadPage onDocumentReady={handleDocumentReady} />
        )}

        {currentPage === 'studio' && (
          <StudioPage
            initialDocument={activeDocument}
            initialPreset={activePreset}
            loadedTransformation={loadedTransformation}
            onTransformationSaved={(rec) => setLoadedTransformation(rec)}
          />
        )}

        {currentPage === 'command-center' && <CommandCenterPage />}

        {currentPage === 'history' && (
          <HistoryPage
            onSelectTransformation={handleSelectTransformation}
            onDuplicate={handleDuplicateTransformation}
          />
        )}

        {currentPage === 'templates' && (
          <TemplatesPage onApplyTemplate={handleApplyTemplate} />
        )}

        {currentPage === 'settings' && <SettingsPage />}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-[#DBEAFE] bg-[#FFFFFF] py-8 text-center text-xs text-[#64748B] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <span className="font-bold text-[#0F172A] font-['Space_Grotesk'] tracking-wide">TransformAI</span>
            <span>•</span>
            <span className="text-[#64748B]">One Source. Infinite Transformations.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
            <span className="clay-pill px-2.5 py-0.5 text-[#2563EB] font-medium">Multilingual Support</span>
            <span className="clay-pill px-2.5 py-0.5 text-[#475569]">Multimodal OCR</span>
            <span className="clay-pill px-2.5 py-0.5 text-[#16A34A] font-medium">Automated Quality Checks</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
