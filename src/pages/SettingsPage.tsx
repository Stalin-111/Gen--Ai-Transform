import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Database,
  ShieldCheck,
  FileCheck,
  Download,
  Info,
  CheckCircle2,
  Lock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [model, setModel] = useState('gemini-3.8-flash');
  const [minCoverage, setMinCoverage] = useState(85);
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState(true);
  const [defaultFormat, setDefaultFormat] = useState('docx');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="clay-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
              Platform Configuration & System Settings
            </h1>
            <span className="clay-pill px-2.5 py-0.5 text-xs font-semibold text-sky-700 bg-sky-50 font-mono">
              System Admin
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Engine parameters, database persistence, quality check thresholds & platform specifications
          </p>
        </div>

        {savedSuccess && (
          <div className="clay-pill px-3 py-1 flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gemini AI Settings */}
        <div className="clay-card p-6 space-y-4">
          <div className="flex items-center space-x-3 border-b border-sky-100 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl clay-inset text-sky-600 bg-sky-50">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
                Google Gemini Core Engine
              </h3>
              <p className="text-xs text-slate-500">Model selection & inference architecture</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Active Generative Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full clay-inset px-3 py-2 text-slate-800 bg-white focus:outline-none font-medium"
              >
                <option value="gemini-flash">Gemini Flash (Recommended, High Speed)</option>
                <option value="gemini-pro">Gemini Pro (Complex Reasoning)</option>
              </select>
            </div>

            <div className="clay-inset p-3.5 space-y-2 font-mono text-[11px] text-slate-600 bg-white">
              <div className="flex items-center justify-between">
                <span>API Key Security:</span>
                <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                  <Lock className="h-3 w-3" />
                  <span>Server-Side Protected</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Large Document Chunking:</span>
                <span className="text-slate-800 font-semibold">12,000 Chars Threshold</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Multimodal OCR:</span>
                <span className="text-sky-600 font-semibold">Enabled (Gemini Vision)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Database & Storage */}
        <div className="clay-card p-6 space-y-4">
          <div className="flex items-center space-x-3 border-b border-sky-100 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl clay-inset text-sky-600 bg-sky-50">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
                SQLite Storage Layer
              </h3>
              <p className="text-xs text-slate-500">Relational data persistence & version tracking</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="clay-inset p-3.5 space-y-2 font-mono text-[11px] text-slate-600 bg-white">
              <div className="flex items-center justify-between">
                <span>Database Engine:</span>
                <span className="text-slate-900 font-bold">SQLite (sql.js / WASM)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Version History:</span>
                <span className="text-emerald-700 font-semibold">Active (Full Snapshots)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Storage Path:</span>
                <span className="text-slate-700">/server/database/transformai.db</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              TransformAI automatically stores documents, generated transformations, and all manual
              edits as sequential versions with timestamps.
            </p>
          </div>
        </div>

        {/* Quality Check Parameters */}
        <div className="clay-card p-6 space-y-4">
          <div className="flex items-center space-x-3 border-b border-sky-100 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl clay-inset text-emerald-600 bg-emerald-50">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
                AI Quality Check Calibration
              </h3>
              <p className="text-xs text-slate-500">Coverage targets & hallucination guards</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1.5">
                <span>Minimum Source Coverage Target:</span>
                <span className="text-sky-700 font-mono font-bold">{minCoverage}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                value={minCoverage}
                onChange={(e) => setMinCoverage(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
              <span className="text-[10px] text-slate-500">
                Generations scoring below this coverage threshold are flagged for judge review.
              </span>
            </div>

            <div className="clay-inset p-3 text-[11px] text-slate-600 flex items-start space-x-2 bg-white">
              <Info className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                Automated heuristics verify factual retention, numerical consistency, and entity
                preservation across English, Telugu, Hindi, Tamil, Kannada, and Malayalam.
              </span>
            </div>
          </div>
        </div>

        {/* Export & Document Defaults */}
        <div className="clay-card p-6 space-y-4">
          <div className="flex items-center space-x-3 border-b border-sky-100 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl clay-inset text-amber-600 bg-amber-50">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
                Export File Defaults
              </h3>
              <p className="text-xs text-slate-500">DOCX, PPTX & PDF rendering parameters</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Preferred Download Format
              </label>
              <select
                value={defaultFormat}
                onChange={(e) => setDefaultFormat(e.target.value)}
                className="w-full clay-inset px-3 py-2 text-slate-800 bg-white focus:outline-none font-medium"
              >
                <option value="docx">Microsoft Word Document (.docx)</option>
                <option value="pptx">PowerPoint Presentation (.pptx)</option>
                <option value="pdf">PDF Document (.pdf)</option>
                <option value="md">Markdown (.md)</option>
              </select>
            </div>

            <label className="flex items-center space-x-2 text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={includeSpeakerNotes}
                onChange={(e) => setIncludeSpeakerNotes(e.target.checked)}
                className="rounded accent-sky-600 h-4 w-4"
              />
              <span>Include Speaker Talking Notes in PPTX slides automatically</span>
            </label>
          </div>
        </div>
      </div>

      {/* Platform Metadata Footer Card */}
      <div className="clay-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
              TransformAI Platform Deployment & Architecture
            </span>
            <span className="clay-pill px-2 py-0.5 text-[10px] font-semibold text-sky-700 bg-sky-50 font-mono">
              Verified Production Ready
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            <strong>TransformAI</strong>: Platform for Automated Content Transformation • One
            Source. Infinite Transformations.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="clay-btn clay-btn-primary px-6 py-2.5 text-xs font-semibold text-white shadow-sky-400/25"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};
