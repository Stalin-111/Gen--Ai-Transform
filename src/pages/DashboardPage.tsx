import React, { useEffect, useState } from 'react';
import {
  FileText,
  Wand2,
  Files,
  Languages,
  Clock,
  UploadCloud,
  BookOpen,
  Presentation,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Zap,
} from 'lucide-react';
import { TransformationRecord, UsageStatistics, TransformationType } from '../types';
import { fetchTransformations, fetchUsageStats, deleteTransformation } from '../services/api';

interface DashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectTransformation: (rec: TransformationRecord) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectTransformation,
}) => {
  const [stats, setStats] = useState<UsageStatistics | null>(null);
  const [recentTransformations, setRecentTransformations] = useState<TransformationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, transData] = await Promise.all([
        fetchUsageStats(),
        fetchTransformations({ sort: 'newest' }),
      ]);
      setStats(statsData);
      setRecentTransformations(transData.slice(0, 8));
    } catch (err) {
      console.warn('Dashboard data fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this transformation record?')) {
      try {
        await deleteTransformation(id);
        setRecentTransformations((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  const quickActions = [
    {
      title: 'Upload Content',
      desc: 'Drag & drop PDF, DOCX, PPTX, image or text',
      icon: UploadCloud,
      color: 'from-blue-500 to-blue-600',
      action: () => onNavigate('upload'),
    },
    {
      title: 'Summarize',
      desc: 'High-signal synthesis & key takeaway points',
      icon: FileText,
      color: 'from-sky-400 to-blue-500',
      action: () => onNavigate('studio', { transformationType: 'Summary' }),
    },
    {
      title: 'Study Notes',
      desc: 'Academic structure, concepts & definitions',
      icon: BookOpen,
      color: 'from-blue-600 to-indigo-600',
      action: () => onNavigate('studio', { transformationType: 'Study Notes' }),
    },
    {
      title: 'Generate PPT',
      desc: 'Multi-slide deck with speaker talking notes',
      icon: Presentation,
      color: 'from-amber-400 to-orange-500',
      action: () => onNavigate('studio', { transformationType: 'PPT' }),
    },
    {
      title: 'Create Quiz',
      desc: '10 MCQs with answer keys & explanations',
      icon: HelpCircle,
      color: 'from-emerald-400 to-teal-500',
      action: () => onNavigate('studio', { transformationType: 'MCQs' }),
    },
    {
      title: 'Translate',
      desc: 'Telugu, Hindi, Tamil, Kannada, Malayalam',
      icon: Languages,
      color: 'from-sky-500 to-indigo-500',
      action: () => onNavigate('studio', { transformationType: 'Translation', targetLanguage: 'Telugu' }),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="clay-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold text-[#0F172A] font-['Space_Grotesk'] tracking-tight">
              Platform Dashboard
            </h1>
            <span className="clay-pill px-3 py-0.5 text-xs font-bold text-[#2563EB]">
              Studio Workspace
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5 font-normal">
            Automated content generation, document intelligence and conversion metrics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('upload')}
            className="clay-btn clay-btn-secondary px-4 py-2 text-xs space-x-1.5"
          >
            <UploadCloud className="h-4 w-4 text-[#2563EB]" />
            <span>Upload Content</span>
          </button>

          <button
            onClick={() => onNavigate('studio')}
            className="clay-btn clay-btn-primary px-4 py-2 text-xs space-x-1.5 text-white"
          >
            <Wand2 className="h-4 w-4 text-white" />
            <span>Open Studio</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards (White Claymorphic Elevated Tiles) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="clay-card-interactive p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#475569]">
            <span className="text-xs font-semibold">Documents Processed</span>
            <div className="clay-inset p-2 rounded-xl text-[#2563EB] bg-[#F0F9FF]">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A] font-mono mt-3">
            {stats?.documentsProcessed ?? 8}
          </div>
          <span className="clay-badge-emerald mt-2 inline-flex items-center px-2 py-0.5 text-[10px] font-semibold w-fit">
            Multi-modal inputs parsed
          </span>
        </div>

        {/* Metric 2 */}
        <div className="clay-card-interactive p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#475569]">
            <span className="text-xs font-semibold">Transformations</span>
            <div className="clay-inset p-2 rounded-xl text-[#0EA5E9] bg-[#F0F9FF]">
              <Wand2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A] font-mono mt-3">
            {stats?.transformationsCreated ?? 12}
          </div>
          <span className="clay-badge-cyan mt-2 inline-flex items-center px-2 py-0.5 text-[10px] font-semibold w-fit">
            AI Engine generated
          </span>
        </div>

        {/* Metric 3 */}
        <div className="clay-card-interactive p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#475569]">
            <span className="text-xs font-semibold">Files Generated</span>
            <div className="clay-inset p-2 rounded-xl text-[#3B82F6] bg-[#F0F9FF]">
              <Files className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A] font-mono mt-3">
            {stats?.filesGenerated ?? 15}
          </div>
          <span className="clay-badge-indigo mt-2 inline-flex items-center px-2 py-0.5 text-[10px] font-semibold w-fit">
            DOCX, PDF, PPTX, MD
          </span>
        </div>

        {/* Metric 4 */}
        <div className="clay-card-interactive p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#475569]">
            <span className="text-xs font-semibold">Languages Supported</span>
            <div className="clay-inset p-2 rounded-xl text-[#16A34A] bg-[#ECFDF5]">
              <Languages className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A] font-mono mt-3">
            {stats?.languagesUsed ?? 4}
          </div>
          <span className="clay-badge-emerald mt-2 inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold w-fit">
            Vernacular & Global
          </span>
        </div>

        {/* Metric 5 */}
        <div className="clay-card-interactive p-5 col-span-2 lg:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#475569]">
            <span className="text-xs font-semibold">Estimated Saved</span>
            <div className="clay-inset p-2 rounded-xl text-[#F59E0B] bg-[#FFFBEB]">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A] font-mono mt-3">
            {stats?.estimatedTimeSavedHours ?? 34.5} <span className="text-sm font-normal text-[#64748B]">hrs</span>
          </div>
          <span className="clay-badge-amber mt-2 inline-flex items-center px-2 py-0.5 text-[10px] font-semibold w-fit">
            Manual drafting automated
          </span>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#0F172A] font-['Space_Grotesk']">
            Quick Action Workflows
          </h2>
          <span className="clay-pill px-3 py-0.5 text-xs text-[#2563EB] font-medium">
            One-click transformation configurations
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {quickActions.map((qa, i) => {
            const Icon = qa.icon;
            return (
              <button
                key={i}
                onClick={qa.action}
                className="clay-card-interactive group flex flex-col justify-between p-4 text-left cursor-pointer"
              >
                <div>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr ${qa.color} text-white mb-3.5 shadow-sm border border-white/20`}
                    style={{
                      boxShadow: 'inset 2px 2px 3px rgba(255,255,255,0.4), inset -2px -2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                    {qa.title}
                  </h3>
                  <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2 leading-tight">
                    {qa.desc}
                  </p>
                </div>
                <div className="flex items-center text-[10px] font-semibold text-[#2563EB] group-hover:text-[#1D4ED8] transition-colors mt-3">
                  <span>Launch</span>
                  <ArrowRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Transformations Table (Clay Container) */}
      <div className="clay-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DBEAFE] bg-[#F0F9FF]">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A] font-['Space_Grotesk']">
              Recent Transformations
            </h2>
            <p className="text-xs text-[#64748B]">
              Live records persisted in SQLite database
            </p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="clay-pill px-3 py-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] bg-[#FFFFFF] flex items-center space-x-1 transition-colors"
          >
            <span>View All</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto p-2">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#DBEAFE] bg-[#F0F9FF] text-[#0F172A] uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3 font-bold">Document</th>
                <th className="px-5 py-3 font-bold">Transformation</th>
                <th className="px-5 py-3 font-bold">Language</th>
                <th className="px-5 py-3 font-bold">Date</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DBEAFE] text-[#334155] bg-[#FFFFFF]">
              {recentTransformations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#64748B]">
                    No transformations created yet. Click "Upload Content" or "Open Studio" to start.
                  </td>
                </tr>
              ) : (
                recentTransformations.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectTransformation(item)}
                    className="hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5 font-semibold text-[#0F172A] max-w-xs truncate">
                      {item.documentTitle}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="clay-pill px-2.5 py-0.5 text-[11px] font-semibold text-[#2563EB] bg-[#F0F9FF]">
                        {item.transformationType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#475569] font-medium">
                      {item.targetLanguage}
                    </td>
                    <td className="px-5 py-3.5 text-[#64748B] font-mono text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="clay-badge-emerald px-2 py-0.5 inline-flex items-center space-x-1 text-[11px] font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Completed</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTransformation(item);
                          }}
                          className="clay-btn clay-btn-secondary p-1.5 text-[#475569] hover:text-[#2563EB]"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="clay-btn clay-btn-secondary p-1.5 text-[#475569] hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
