import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  History,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Download,
  Calendar,
  Languages,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { TransformationRecord, TransformationType, SupportedLanguage } from '../types';
import { fetchTransformations, deleteTransformation } from '../services/api';
import { ExportModal } from '../components/ExportModal';
import { SUPPORTED_LANGUAGES, getLanguageInfo } from '../constants/languages';

interface HistoryPageProps {
  onSelectTransformation: (rec: TransformationRecord, startEdit?: boolean) => void;
  onDuplicate: (rec: TransformationRecord) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onSelectTransformation,
  onDuplicate,
}) => {
  const [records, setRecords] = useState<TransformationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Export Modal
  const [exportRecord, setExportRecord] = useState<TransformationRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTransformations({
        type: typeFilter !== 'all' ? typeFilter : undefined,
        language: languageFilter !== 'all' ? languageFilter : undefined,
        search: searchQuery || undefined,
        sort: sortBy,
      });
      setRecords(data);
    } catch (err) {
      console.warn('History load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [typeFilter, languageFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transformation record?')) {
      try {
        await deleteTransformation(id);
        setRecords((prev) => prev.filter((r) => r.id !== id));
      } catch (err) {
        alert('Failed to delete item.');
      }
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="clay-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#FFFFFF]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold text-[#0F172A] font-['Space_Grotesk']">
              Transformation Archive & History
            </h1>
            <span className="clay-pill px-2.5 py-0.5 text-xs font-semibold text-[#2563EB] bg-[#F0F9FF] font-mono border border-[#DBEAFE]">
              {records.length} Records
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Browse, re-inspect, duplicate, and export all generated and edited artifacts
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="clay-card p-5 space-y-3 bg-[#FFFFFF]">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Field */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              id="history-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by document title or content keywords..."
              className="w-full clay-inset pl-10 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none bg-[#FFFFFF]"
            />
          </form>

          {/* Filter: Type */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              id="history-filter-type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="clay-inset px-3 py-2 text-xs text-[#0F172A] focus:outline-none bg-[#FFFFFF] font-medium border border-[#DBEAFE]"
            >
              <option value="all">All Types</option>
              {transformationTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Filter: Language */}
            <select
              id="history-filter-language"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="clay-inset px-3 py-2 text-xs text-[#0F172A] focus:outline-none bg-[#FFFFFF] font-medium border border-[#DBEAFE]"
            >
              <option value="all">All Languages</option>
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>

            {/* Sort: Date */}
            <select
              id="history-sort-date"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="clay-inset px-3 py-2 text-xs text-[#0F172A] focus:outline-none bg-[#FFFFFF] font-medium border border-[#DBEAFE]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Record List Cards */}
      <div className="space-y-3">
        {records.length === 0 ? (
          <div className="clay-card p-12 text-center text-[#64748B] text-xs bg-[#FFFFFF]">
            No transformations found matching your query. Try resetting your search filter.
          </div>
        ) : (
          records.map((rec) => (
            <div
              key={rec.id}
              className="clay-card p-5 hover:scale-[1.005] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF]"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#0F172A] font-['Space_Grotesk'] truncate max-w-md">
                    {rec.documentTitle}
                  </span>
                  <span className="clay-pill px-2.5 py-0.5 text-[11px] font-semibold text-[#2563EB] bg-[#F0F9FF] font-mono border border-[#DBEAFE]">
                    {rec.transformationType}
                  </span>
                  <span className="clay-pill px-2.5 py-0.5 text-[11px] font-mono text-[#475569] bg-[#F0F9FF] border border-[#DBEAFE]">
                    {rec.targetLanguage}
                  </span>
                  <span className="flex items-center space-x-1 text-[11px] text-[#16A34A] font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Completed</span>
                  </span>
                </div>

                <p className="text-xs text-[#64748B] line-clamp-1 font-mono">
                  {rec.generatedContent.slice(0, 140)}...
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#64748B]">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-[#64748B]" />
                    <span>{new Date(rec.createdAt).toLocaleString()}</span>
                  </span>
                  <span>•</span>
                  <span>Audience: {rec.audience}</span>
                  <span>•</span>
                  <span>Tone: {rec.tone}</span>
                  {rec.versions && rec.versions.length > 1 && (
                    <>
                      <span>•</span>
                      <span className="text-[#2563EB] font-semibold">{rec.versions.length} versions</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions Group */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onSelectTransformation(rec, false)}
                  className="clay-btn clay-btn-secondary px-3 py-1.5 text-xs space-x-1"
                  title="View in Studio"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => onSelectTransformation(rec, true)}
                  className="clay-btn clay-btn-secondary px-3 py-1.5 text-xs space-x-1"
                  title="Edit"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => onDuplicate(rec)}
                  className="clay-btn clay-btn-secondary px-3 py-1.5 text-xs space-x-1"
                  title="Duplicate as new transformation"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Duplicate</span>
                </button>

                <button
                  onClick={() => setExportRecord(rec)}
                  className="clay-btn clay-btn-primary px-3 py-1.5 text-xs text-white space-x-1"
                  title="Export"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export</span>
                </button>

                <button
                  onClick={() => handleDelete(rec.id)}
                  className="clay-btn clay-btn-secondary p-2 text-[#64748B] hover:text-rose-600"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Export Modal for Record */}
      {exportRecord && (
        <ExportModal
          isOpen={!!exportRecord}
          onClose={() => setExportRecord(null)}
          title={exportRecord.documentTitle}
          content={exportRecord.generatedContent}
          structuredJson={exportRecord.structuredJson}
          transformationType={exportRecord.transformationType}
        />
      )}
    </div>
  );
};
