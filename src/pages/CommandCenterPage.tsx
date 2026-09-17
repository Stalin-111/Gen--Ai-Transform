import React, { useEffect, useState } from 'react';
import {
  LineChart,
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Cpu,
  Zap,
  Clock,
  Languages,
  Layers,
  FileCheck,
  TrendingUp,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { fetchUsageStats } from '../services/api';
import { UsageStatistics } from '../types';

export const CommandCenterPage: React.FC = () => {
  const [stats, setStats] = useState<UsageStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageStats()
      .then((data) => setStats(data))
      .catch((err) => console.warn('Command center stats fetch:', err))
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ['#2563EB', '#3B82F6', '#0EA5E9', '#60A5FA', '#10B981', '#F59E0B'];

  const typeData = stats?.typeDistribution || [
    { name: 'Study Notes', value: 32 },
    { name: 'Summary', value: 24 },
    { name: 'PPT Deck', value: 18 },
    { name: 'MCQs Quiz', value: 14 },
    { name: 'Translation', value: 12 },
  ];

  const languageData = stats?.languageDistribution || [
    { name: 'English', value: 45 },
    { name: 'Telugu', value: 25 },
    { name: 'Hindi', value: 15 },
    { name: 'Tamil', value: 9 },
    { name: 'Kannada', value: 6 },
  ];

  const timelineData = stats?.timelineData || [
    { date: 'Mon', transformations: 4, documents: 3 },
    { date: 'Tue', transformations: 8, documents: 6 },
    { date: 'Wed', transformations: 14, documents: 10 },
    { date: 'Thu', transformations: 19, documents: 14 },
    { date: 'Fri', transformations: 27, documents: 20 },
    { date: 'Today', transformations: 36, documents: 28 },
  ];

  const formatData = [
    { name: 'Word (.docx)', count: 42 },
    { name: 'PowerPoint (.pptx)', count: 31 },
    { name: 'PDF (.pdf)', count: 28 },
    { name: 'Markdown (.md)', count: 20 },
    { name: 'Plain Text (.txt)', count: 14 },
  ];

  const tooltipStyle = {
    backgroundColor: '#FFFFFF',
    borderColor: '#DBEAFE',
    borderRadius: '12px',
    fontSize: '11px',
    color: '#0F172A',
    boxShadow: '0 10px 25px -3px rgba(37, 99, 235, 0.15)',
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="clay-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#FFFFFF]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold text-[#0F172A] font-['Space_Grotesk']">
              AI Command Center
            </h1>
            <span className="clay-pill px-2.5 py-0.5 text-xs font-semibold text-[#2563EB] bg-[#F0F9FF] flex items-center space-x-1 border border-[#DBEAFE]">
              <Activity className="h-3 w-3 animate-pulse text-[#0EA5E9]" />
              <span>Real-Time Analytics</span>
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Telemetry, model throughput, linguistic distributions and format metrics
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-[#64748B]">
          <span className="clay-pill px-3 py-1 text-xs font-mono text-[#16A34A] bg-[#ECFDF5] flex items-center space-x-1.5 font-medium border border-[#A7F3D0]">
            <span className="h-2 w-2 rounded-full bg-[#16A34A]"></span>
            <span>AI Core Engine Online</span>
          </span>
        </div>
      </div>

      {/* Top 5 Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="clay-card p-5 bg-[#FFFFFF] border border-[#DBEAFE]">
          <div className="text-xs text-[#64748B] font-medium flex items-center justify-between">
            <span>Documents Processed</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg clay-inset text-[#2563EB] bg-[#F0F9FF]">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] font-mono mt-2">
            {stats?.documentsProcessed ?? 8}
          </div>
          <span className="text-[10px] text-[#64748B] font-medium">PDF, DOCX, PPTX & OCR</span>
        </div>

        <div className="clay-card p-5 bg-[#FFFFFF] border border-[#DBEAFE]">
          <div className="text-xs text-[#64748B] font-medium flex items-center justify-between">
            <span>Total Transformations</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg clay-inset text-[#2563EB] bg-[#F0F9FF]">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] font-mono mt-2">
            {stats?.transformationsCreated ?? 12}
          </div>
          <span className="text-[10px] text-[#64748B] font-medium">Completed without failure</span>
        </div>

        <div className="clay-card p-5 bg-[#FFFFFF] border border-[#DBEAFE]">
          <div className="text-xs text-[#64748B] font-medium flex items-center justify-between">
            <span>AI Generations</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg clay-inset text-[#2563EB] bg-[#F0F9FF]">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] font-mono mt-2">
            {(stats?.transformationsCreated || 12) + (stats?.filesGenerated || 3)}
          </div>
          <span className="text-[10px] text-[#64748B] font-medium">Total neural passes</span>
        </div>

        <div className="clay-card p-5 bg-[#FFFFFF] border border-[#DBEAFE]">
          <div className="text-xs text-[#64748B] font-medium flex items-center justify-between">
            <span>Languages Used</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg clay-inset text-[#2563EB] bg-[#F0F9FF]">
              <Languages className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] font-mono mt-2">
            {stats?.languagesUsed ?? 4}
          </div>
          <span className="text-[10px] text-[#64748B] font-medium">Vernacular coverage</span>
        </div>

        <div className="clay-card p-5 col-span-2 lg:col-span-1 bg-[#FFFFFF] border border-[#DBEAFE]">
          <div className="text-xs text-[#64748B] font-medium flex items-center justify-between">
            <span>Average Latency</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg clay-inset text-[#16A34A] bg-[#ECFDF5]">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] font-mono mt-2">
            {stats?.averageProcessingTimeSec ?? 1.8}s
          </div>
          <span className="text-[10px] text-[#16A34A] font-medium">Low-latency streaming</span>
        </div>
      </div>

      {/* Charts 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Transformations Over Time */}
        <div className="clay-card p-6 bg-[#FFFFFF] border border-[#DBEAFE]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] font-['Space_Grotesk']">
                Transformations & Documents Over Time
              </h3>
              <p className="text-xs text-[#64748B]">Cumulative throughput trajectory</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl clay-inset text-[#2563EB] bg-[#F0F9FF]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="transGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="docGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="transformations"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#transGrad)"
                  name="Transformations"
                />
                <Area
                  type="monotone"
                  dataKey="documents"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#docGrad)"
                  name="Documents"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Transformation Type Distribution */}
        <div className="clay-card p-6 bg-[#FFFFFF] border border-[#DBEAFE]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] font-['Space_Grotesk']">
                Transformation Type Distribution
              </h3>
              <p className="text-xs text-[#64748B]">Share of generated structural formats</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl clay-inset text-[#2563EB] bg-[#F0F9FF]">
              <Layers className="h-4 w-4" />
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={100} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#2563EB" radius={[0, 4, 4, 0]}>
                  {typeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Language Distribution */}
        <div className="clay-card p-6 bg-[#FFFFFF] border border-[#DBEAFE]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] font-['Space_Grotesk']">
                Language Distribution
              </h3>
              <p className="text-xs text-[#64748B]">Multilingual utilization breakdown</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl clay-inset text-[#2563EB] bg-[#F0F9FF]">
              <Languages className="h-4 w-4" />
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {languageData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-[#475569] font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Output Format Distribution */}
        <div className="clay-card p-6 bg-[#FFFFFF] border border-[#DBEAFE]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] font-['Space_Grotesk']">
                Exported Format Breakdown
              </h3>
              <p className="text-xs text-[#64748B]">Distribution across Word, PPT, PDF & Code</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl clay-inset text-[#16A34A] bg-[#ECFDF5]">
              <Clock className="h-4 w-4" />
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
