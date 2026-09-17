import React, { useState } from 'react';
import { Download, FileText, Presentation, FileCode, File, Check, X, Loader2 } from 'lucide-react';
import { StructuredContent, TransformationType } from '../types';
import { exportContent } from '../services/api';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  structuredJson?: StructuredContent;
  transformationType?: TransformationType;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  structuredJson,
  transformationType,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'txt' | 'md' | 'docx' | 'pdf' | 'pptx'>(
    transformationType === 'PPT' ? 'pptx' : 'docx'
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const formats = [
    {
      id: 'docx',
      name: 'Microsoft Word',
      ext: '.docx',
      icon: FileText,
      description: 'Fully formatted document with headings, bullets & executive summary',
      badge: 'Recommended',
    },
    {
      id: 'pptx',
      name: 'PowerPoint Deck',
      ext: '.pptx',
      icon: Presentation,
      description: 'Real slide deck with styled slides, bullets & speaker notes',
      badge: transformationType === 'PPT' ? 'Optimal' : undefined,
    },
    {
      id: 'pdf',
      name: 'PDF Document',
      ext: '.pdf',
      icon: File,
      description: 'Print-ready vector PDF with clean professional typography',
    },
    {
      id: 'md',
      name: 'Markdown',
      ext: '.md',
      icon: FileCode,
      description: 'Clean markdown source for developers, documentation & Notion',
    },
    {
      id: 'txt',
      name: 'Plain Text',
      ext: '.txt',
      icon: FileText,
      description: 'Raw unformatted text for universal copy-paste',
    },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      await exportContent({
        title: title || 'TransformAI_Document',
        format: selectedFormat,
        content,
        structuredJson,
        transformationType,
      });
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 1400);
    } catch (err: any) {
      setError(err.message || 'Export failed. Please try another format.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1020]/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg clay-modal p-6 shadow-2xl space-y-5 bg-[#151C2F] border border-[#334155]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 clay-btn clay-btn-secondary p-1.5 text-[#94A3B8] hover:text-[#F8FAFC]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-2">
          <h3 className="text-xl font-bold text-[#F8FAFC] font-['Space_Grotesk'] tracking-tight">
            Export Transformed Content
          </h3>
          <p className="text-xs text-[#94A3B8] mt-1 font-normal">
            Choose your target format to generate production-ready files
          </p>
        </div>

        {/* Format Selection Grid */}
        <div className="space-y-2.5">
          {formats.map((fmt) => {
            const Icon = fmt.icon;
            const isSelected = selectedFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt.id as any)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all ${
                  isSelected
                    ? 'clay-card border-[#38BDF8] bg-[#1B2540]'
                    : 'clay-inset bg-[#111827] hover:bg-[#1B2540]/60'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isSelected ? 'clay-btn-primary text-white' : 'clay-inset text-[#38BDF8] bg-[#0B1020]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-[#F8FAFC]">{fmt.name}</span>
                      <span className="text-xs font-mono text-[#38BDF8] font-semibold">{fmt.ext}</span>
                      {fmt.badge && (
                        <span className="clay-pill px-2 py-0.5 text-[10px] font-bold text-[#60A5FA] font-mono">
                          {fmt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{fmt.description}</p>
                  </div>
                </div>

                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center ${
                    isSelected ? 'clay-btn-primary text-white' : 'clay-inset bg-[#111827]'
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="clay-card p-3 border-rose-500/30 bg-rose-500/10 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#334155]">
          <button
            type="button"
            onClick={onClose}
            className="clay-btn clay-btn-secondary px-4 py-2 text-xs font-medium text-[#CBD5E1]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting || exportSuccess}
            className="clay-btn clay-btn-primary px-6 py-2.5 text-xs font-bold text-white space-x-2 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Generating {selectedFormat.toUpperCase()}...</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download {selectedFormat.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
