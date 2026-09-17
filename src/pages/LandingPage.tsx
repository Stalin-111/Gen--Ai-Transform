import React from 'react';
import {
  Sparkles,
  Zap,
  Wand2,
  FileText,
  Presentation,
  BookOpen,
  HelpCircle,
  Share2,
  Languages,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

interface LandingPageProps {
  onStartTransforming: () => void;
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartTransforming,
  onNavigate,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background Decorative Soft Cyan/Blue Radial Glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-[#2563EB]/20 via-[#06B6D4]/10 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Platform Badge */}
        <div className="flex justify-center mb-6">
          <div className="clay-pill px-4 py-2 text-xs font-semibold text-[#BAE6FD] bg-[#1B2540] inline-flex items-center space-x-2.5 border border-[#334155]">
            <span className="flex h-2 w-2 rounded-full bg-[#06B6D4] animate-pulse"></span>
            <span>Next-Gen Enterprise Engine</span>
            <span className="text-[#334155]">•</span>
            <span className="text-[#94A3B8] font-medium">Automated Content Transformation</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-6xl font-['Space_Grotesk'] leading-tight">
            Transform Content.{' '}
            <span className="bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#06B6D4] bg-clip-text text-transparent">
              Create More.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#94A3B8] leading-relaxed font-normal">
            Transform documents, knowledge and ideas into summaries, presentations, notes, quizzes,
            scripts and multilingual content with Generative AI.
          </p>

          <p className="mt-3 text-sm font-semibold tracking-wide text-[#38BDF8] uppercase font-mono">
            One Source. Infinite Transformations.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="landing-start-transforming-btn"
              onClick={onStartTransforming}
              className="clay-btn clay-btn-primary w-full sm:w-auto px-8 py-4 text-sm font-bold space-x-2 text-white"
            >
              <Wand2 className="h-4 w-4 text-white" />
              <span>Start Transforming</span>
            </button>

            <button
              id="landing-dashboard-btn"
              onClick={() => onNavigate('dashboard')}
              className="clay-btn clay-btn-secondary w-full sm:w-auto px-8 py-4 text-sm font-bold text-[#CBD5E1] space-x-2"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="h-4 w-4 text-[#38BDF8]" />
            </button>
          </div>
        </div>

        {/* Visual Workflow Display */}
        <div className="mx-auto max-w-5xl my-16 clay-card p-6 sm:p-8 space-y-6 bg-[#151C2F]">
          <div className="text-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#38BDF8] font-mono">
              The TransformAI Pipeline Architecture
            </h3>
            <p className="text-sm text-[#94A3B8] mt-1">
              Deterministic parsing, multimodal extraction, and grounded AI reasoning
            </p>
          </div>

          {/* Flow Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Stage 1: Input */}
            <div className="clay-card-interactive p-6 text-center flex flex-col items-center bg-[#1B2540]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl clay-inset text-[#38BDF8] mb-3.5 bg-[#111827]">
                <FileText className="h-6 w-6" />
              </div>
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-[#94A3B8]">
                Stage 1: Ingestion
              </div>
              <div className="text-sm font-bold text-[#F8FAFC] mt-1.5">
                PDF • DOCX • PPTX • IMAGE
              </div>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Optical character recognition, metadata extraction & document parsing
              </p>
            </div>

            {/* Stage 2: AI Core */}
            <div className="relative clay-card-interactive p-6 text-center flex flex-col items-center border-[#2563EB]/50 bg-[#1B2540]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 clay-pill px-3 py-0.5 text-[10px] font-bold text-[#60A5FA] bg-[#111827] uppercase tracking-wider border border-[#334155]">
                Core AI Engine
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl clay-inset text-[#38BDF8] mb-3.5 mt-1 bg-[#111827]">
                <Cpu className="h-6 w-6 animate-pulse" />
              </div>
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-[#38BDF8]">
                Stage 2: AI Reasoning
              </div>
              <div className="text-lg font-extrabold text-[#F8FAFC] mt-1 font-['Space_Grotesk']">
                Multi-Model Core
              </div>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Audience & tone adaptation with factual retention & strict schemas
              </p>
            </div>

            {/* Stage 3: Output */}
            <div className="clay-card-interactive p-6 text-center flex flex-col items-center bg-[#1B2540]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl clay-inset text-emerald-400 mb-3.5 bg-[#111827]">
                <Presentation className="h-6 w-6" />
              </div>
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-[#94A3B8]">
                Stage 3: Artifacts
              </div>
              <div className="text-sm font-bold text-[#F8FAFC] mt-1.5">
                SUMMARY • NOTES • PPT • QUIZ
              </div>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Automated Quality Check + Native DOCX, PDF & PPTX exports
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
          <div className="clay-card-interactive p-6 space-y-3 bg-[#151C2F]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl clay-inset text-[#38BDF8] mb-2 bg-[#111827]">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC] font-['Space_Grotesk']">
              16+ Transformation Profiles
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Summary, Study Notes, 10-Slide PPT, MCQs, Blog, Business Reports, Scripts,
              Executive Summaries, and Simplification tailored by audience and tone.
            </p>
          </div>

          <div className="clay-card-interactive p-6 space-y-3 bg-[#151C2F]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl clay-inset text-[#38BDF8] mb-2 bg-[#111827]">
              <Languages className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC] font-['Space_Grotesk']">
              Multilingual Localization
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Full native support for Indian languages (Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Marathi, etc.) plus major global languages.
            </p>
          </div>

          <div className="clay-card-interactive p-6 space-y-3 bg-[#151C2F]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl clay-inset text-emerald-400 mb-2 bg-[#111827]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC] font-['Space_Grotesk']">
              AI-Assisted Quality Checks
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Automated source coverage, contradiction detection, entity preservation, and
              hallucination prevention algorithms score every generation before export.
            </p>
          </div>
        </div>

        {/* Quick-action bottom banner */}
        <div className="clay-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#1B2540]">
          <div>
            <h3 className="text-xl font-bold text-[#F8FAFC] font-['Space_Grotesk']">
              Ready to automate your content lifecycle?
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 font-medium">
              Experience tactile, rapid content transformation in seconds.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onStartTransforming}
              className="clay-btn clay-btn-primary px-6 py-3 text-xs font-bold text-white"
            >
              Open Transformation Studio
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="clay-btn clay-btn-secondary px-6 py-3 text-xs font-bold text-[#CBD5E1]"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
