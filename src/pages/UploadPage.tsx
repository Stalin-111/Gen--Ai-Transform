import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Wand2,
  Image as ImageIcon,
  Presentation,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { uploadDocument, extractTextStats } from '../services/api';
import { DocumentMetadata } from '../types';

interface UploadPageProps {
  onDocumentReady: (doc: {
    id?: string;
    title: string;
    text: string;
    wordCount: number;
    charCount: number;
    pageCount: number;
  }) => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onDocumentReady }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [pastedText, setPastedText] = useState('');
  const [extractedResult, setExtractedResult] = useState<DocumentMetadata | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Validate file extension
    const validExtensions = ['pdf', 'docx', 'pptx', 'txt', 'png', 'jpg', 'jpeg', 'webp'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!validExtensions.includes(ext)) {
      setErrorMessage(
        'Unable to process this file format. Please provide a PDF, DOCX, PPTX, TXT, or Image (PNG/JPG/JPEG).'
      );
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File exceeds maximum size limit of 25 MB.');
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
    setIsProcessing(true);
    setUploadProgress(15);
    setProcessingStatus('Uploading file payload...');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploadProgress(45);
        setProcessingStatus('Executing multi-format parser & OCR...');

        const base64Data = reader.result as string;
        const res = await uploadDocument({
          filename: file.name,
          mimeType: file.type || `application/${ext}`,
          base64Data,
        });

        setUploadProgress(100);
        setProcessingStatus('Extraction complete');
        setExtractedResult(res.document);
        setIsProcessing(false);
      } catch (err: any) {
        setIsProcessing(false);
        setErrorMessage(
          err.message || 'Unable to process this file. Please check the file format and try again.'
        );
      }
    };

    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMessage('Failed to read file from disk.');
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setExtractedResult(null);
    setUploadProgress(0);
    setProcessingStatus('');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendFileToStudio = () => {
    if (!extractedResult) return;
    onDocumentReady({
      id: extractedResult.id,
      title: extractedResult.filename,
      text: extractedResult.extractedText,
      wordCount: extractedResult.wordCount,
      charCount: extractedResult.charCount,
      pageCount: extractedResult.pageCount,
    });
  };

  const handleSendPastedToStudio = async () => {
    if (!pastedText.trim()) return;
    setIsProcessing(true);
    try {
      const stats = await extractTextStats(pastedText);
      onDocumentReady({
        title: 'Direct Text Input (' + new Date().toLocaleTimeString() + ')',
        text: pastedText,
        wordCount: stats.wordCount,
        charCount: stats.charCount,
        pageCount: stats.pageCount,
      });
    } catch (err: any) {
      setErrorMessage('Failed to process pasted text.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="clay-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF]">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] font-['Space_Grotesk'] tracking-tight">
            Upload Source Content
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Support for multi-page documents, presentation decks, academic papers, and scanned images
          </p>
        </div>
        <span className="clay-pill px-3 py-1 text-xs font-mono text-[#2563EB] self-start sm:self-auto font-semibold bg-[#F0F9FF]">
          25 MB Limit
        </span>
      </div>

      {/* Drag and Drop Zone (#FFFFFF drop area, #DBEAFE dashed border, #F0F9FF on active drag) */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`clay-card p-10 relative flex flex-col items-center justify-center text-center transition-all border-2 border-dashed ${
          dragActive
            ? 'border-[#2563EB] bg-[#F0F9FF] scale-[1.01]'
            : 'border-[#DBEAFE] hover:border-[#2563EB] bg-[#FFFFFF]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload-input"
          accept=".pdf,.docx,.pptx,.txt,.png,.jpg,.jpeg,.webp"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl clay-inset text-[#2563EB] mb-4 bg-[#F0F9FF]">
          <UploadCloud className="h-8 w-8 text-[#2563EB] animate-pulse" />
        </div>

        <h3 className="text-base font-bold text-[#0F172A]">
          Drag and drop your file here, or{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[#2563EB] hover:text-[#1D4ED8] underline font-semibold transition-colors"
          >
            browse files
          </button>
        </h3>

        <p className="text-xs text-[#64748B] mt-2 max-w-md">
          Supported formats: <strong className="text-[#0F172A]">PDF, DOCX, PPTX, TXT, PNG, JPG, JPEG</strong> (up to 25 MB)
        </p>

        {/* Supported Types Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-[11px]">
          <span className="clay-pill flex items-center space-x-1.5 px-3 py-1.5 text-[#475569] bg-[#FFFFFF]">
            <FileText className="h-3.5 w-3.5 text-rose-500" />
            <span>PDF (Documents)</span>
          </span>
          <span className="clay-pill flex items-center space-x-1.5 px-3 py-1.5 text-[#475569] bg-[#FFFFFF]">
            <File className="h-3.5 w-3.5 text-[#2563EB]" />
            <span>DOCX (Word)</span>
          </span>
          <span className="clay-pill flex items-center space-x-1.5 px-3 py-1.5 text-[#475569] bg-[#FFFFFF]">
            <Presentation className="h-3.5 w-3.5 text-amber-500" />
            <span>PPTX (Slides)</span>
          </span>
          <span className="clay-pill flex items-center space-x-1.5 px-3 py-1.5 text-[#475569] bg-[#FFFFFF]">
            <ImageIcon className="h-3.5 w-3.5 text-emerald-500" />
            <span>Images / OCR</span>
          </span>
        </div>
      </div>

      {/* Selected File Card & Progress Indicator */}
      {selectedFile && (
        <div className="clay-card p-6 space-y-4 animate-in fade-in bg-[#FFFFFF] border border-[#DBEAFE]">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl clay-inset text-[#2563EB] bg-[#F0F9FF]">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#0F172A]">{selectedFile.name}</span>
                  <span className="clay-pill px-2 py-0.5 text-[10px] font-mono text-[#475569] bg-[#F0F9FF]">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-[#64748B] mt-1">
                  <span>Type: {selectedFile.type || 'Document'}</span>
                  <span>•</span>
                  <span className="font-semibold text-[#2563EB]">{processingStatus}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRemoveFile}
              className="clay-btn clay-btn-secondary p-2 text-[#64748B] hover:text-rose-500"
              title="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Progress Bar (#2563EB) */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-mono text-[#475569] mb-1.5 font-medium">
              <span>Upload Progress</span>
              <span className="text-[#2563EB] font-bold">{uploadProgress}%</span>
            </div>
            <div className="h-2.5 w-full clay-inset p-0.5 overflow-hidden bg-[#F1F5F9]">
              <div
                className="h-full rounded-full bg-[#2563EB] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>

          {/* Extracted Stats Preview */}
          {extractedResult && (
            <div className="mt-4 pt-4 border-t border-[#DBEAFE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-4 text-xs font-mono text-[#475569]">
                <span>
                  Words: <strong className="text-[#0F172A]">{extractedResult.wordCount}</strong>
                </span>
                <span>
                  Chars: <strong className="text-[#0F172A]">{extractedResult.charCount}</strong>
                </span>
                <span>
                  Pages: <strong className="text-[#0F172A]">{extractedResult.pageCount}</strong>
                </span>
              </div>

              <button
                id="send-to-studio-btn"
                onClick={handleSendFileToStudio}
                className="clay-btn clay-btn-primary px-5 py-2.5 text-xs font-semibold space-x-2 text-white"
              >
                <span>Proceed to Transformation Studio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error display */}
      {errorMessage && (
        <div className="clay-card p-4 border-rose-300 bg-rose-50 text-xs text-rose-700 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-rose-900">Processing Error</div>
            <div className="mt-0.5">{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Or Paste Your Content */}
      <div className="clay-card p-6 space-y-4 bg-[#FFFFFF]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A] font-['Space_Grotesk']">
              Or paste your content
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Paste raw markdown, research notes, meeting transcripts, or articles directly
            </p>
          </div>
          {pastedText && (
            <span className="clay-pill px-2.5 py-0.5 text-xs font-mono text-[#2563EB] font-semibold bg-[#F0F9FF]">
              {pastedText.split(/\s+/).filter(Boolean).length} words
            </span>
          )}
        </div>

        <textarea
          id="paste-content-textarea"
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Paste articles, textbooks, transcripts, notes, code explanations or policies here..."
          rows={7}
          className="w-full clay-inset p-4 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none font-mono leading-relaxed bg-[#FFFFFF]"
        />

        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={() => setPastedText('')}
            disabled={!pastedText}
            className="clay-btn clay-btn-secondary px-4 py-2 text-xs font-medium disabled:opacity-30"
          >
            Clear
          </button>

          <button
            id="paste-proceed-btn"
            onClick={handleSendPastedToStudio}
            disabled={!pastedText.trim() || isProcessing}
            className="clay-btn clay-btn-primary px-5 py-2.5 text-xs font-semibold space-x-2 text-white disabled:opacity-40"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Send to Transformation Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
