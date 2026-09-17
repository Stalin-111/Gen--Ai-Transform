import React, { useEffect, useState } from 'react';
import {
  Layers,
  Sparkles,
  GraduationCap,
  Presentation,
  Briefcase,
  Share2,
  Languages,
  ArrowRight,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { fetchTemplates } from '../services/api';
import { Template } from '../types';

interface TemplatesPageProps {
  onApplyTemplate: (template: Template) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onApplyTemplate }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchTemplates()
      .then((data) => setTemplates(data))
      .catch((err) => console.warn('Templates fetch:', err));
  }, []);

  const categories = ['All', 'Education', 'Business', 'Marketing', 'Multilingual'];

  const filteredTemplates =
    selectedCategory === 'All'
      ? templates
      : templates.filter((t) => t.category.toLowerCase() === selectedCategory.toLowerCase());

  const getIcon = (id: string) => {
    switch (id) {
      case 'academic-study-pack':
        return GraduationCap;
      case 'teacher-lesson-pack':
        return Presentation;
      case 'corporate-brief':
        return Briefcase;
      case 'content-creator-pack':
        return Share2;
      case 'multilingual-distribution':
        return Languages;
      default:
        return Layers;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="clay-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#FFFFFF]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold text-[#0F172A] font-['Space_Grotesk']">
              Predefined Transformation Templates
            </h1>
            <span className="clay-pill px-2.5 py-0.5 text-xs font-semibold text-[#2563EB] bg-[#F0F9FF] font-mono border border-[#DBEAFE]">
              Packs & Bundles
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Standardized production configurations: run comprehensive multi-artifact workflows in one click
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'clay-pill-active'
                : 'clay-pill text-[#475569] hover:text-[#1D4ED8] bg-[#FFFFFF] border border-[#DBEAFE]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tmpl) => {
          const Icon = getIcon(tmpl.id);
          return (
            <div
              key={tmpl.id}
              className="clay-card p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform bg-[#FFFFFF] border border-[#DBEAFE]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl clay-inset text-[#2563EB] bg-[#F0F9FF]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="clay-pill px-2.5 py-0.5 text-[11px] font-mono text-[#2563EB] bg-[#F0F9FF] font-semibold border border-[#DBEAFE]">
                    {tmpl.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0F172A] font-['Space_Grotesk']">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                  {tmpl.description}
                </p>

                {/* Bundle Artifacts Pills */}
                <div className="mt-4 pt-4 border-t border-[#DBEAFE]">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                    Included Artifacts:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tmpl.transformations.map((t, idx) => (
                      <span
                        key={idx}
                        className="clay-pill px-2.5 py-0.5 text-[11px] font-medium text-[#2563EB] bg-[#F0F9FF] border border-[#DBEAFE]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Configuration Summary */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] font-mono text-[#475569] clay-inset p-3 bg-[#F8FAFC]">
                  <div>
                    <span className="text-[#64748B] block">Audience:</span>
                    <strong className="text-[#0F172A]">{tmpl.defaultAudience}</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Tone:</span>
                    <strong className="text-[#0F172A]">{tmpl.defaultTone}</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Language:</span>
                    <strong className="text-[#2563EB] font-semibold">{tmpl.defaultLanguage}</strong>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-5 mt-4 border-t border-[#DBEAFE]">
                <button
                  id={`apply-tmpl-${tmpl.id}`}
                  onClick={() => onApplyTemplate(tmpl)}
                  className="clay-btn clay-btn-primary w-full flex items-center justify-center space-x-2 text-xs font-semibold text-white py-2.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Apply & Load in Studio</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
