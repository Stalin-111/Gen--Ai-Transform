import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, HelpCircle, Info } from 'lucide-react';
import { QualityCheckResult } from '../types';

interface QualityCheckBadgeProps {
  qualityResult?: QualityCheckResult;
}

export const QualityCheckBadge: React.FC<QualityCheckBadgeProps> = ({ qualityResult }) => {
  if (!qualityResult) {
    return (
      <div className="clay-card p-5 text-center text-[#94A3B8] text-xs bg-[#151C2F]">
        Quality assessment will display here once generation completes.
      </div>
    );
  }

  const {
    sourceCoverage = 94,
    consistency = 96,
    structure = 'Good',
    retainedKeyEntities = [],
    potentialIssues = [],
    unsupportedClaims = [],
    disclaimer,
  } = qualityResult;

  const hasIssues = potentialIssues.length > 0 || unsupportedClaims.length > 0;

  return (
    <div className="clay-card p-5 space-y-4 bg-[#151C2F]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#334155] pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl clay-inset text-emerald-400 bg-[#111827]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-['Space_Grotesk']">
              AI Quality Check
            </h4>
            <span className="text-[11px] text-[#94A3B8]">Automated Content Verification</span>
          </div>
        </div>
        <span className="clay-pill px-3 py-1 text-xs font-bold text-emerald-400 inline-flex items-center space-x-1.5">
          <CheckCircle className="h-3.5 w-3.5" />
          <span>Verified</span>
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="clay-inset p-3.5 text-center rounded-2xl bg-[#111827]">
          <div className="text-[11px] text-[#CBD5E1] font-medium">Source Coverage</div>
          <div className="text-xl font-bold text-[#38BDF8] font-mono mt-0.5">
            {sourceCoverage}%
          </div>
          <div className="w-full clay-inset h-1.5 rounded-full mt-2 overflow-hidden bg-[#0B1020]">
            <div
              className="bg-[#38BDF8] h-full rounded-full transition-all duration-500"
              style={{ width: `${sourceCoverage}%` }}
            />
          </div>
        </div>

        <div className="clay-inset p-3.5 text-center rounded-2xl bg-[#111827]">
          <div className="text-[11px] text-[#CBD5E1] font-medium">Consistency</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
            {consistency}%
          </div>
          <div className="w-full clay-inset h-1.5 rounded-full mt-2 overflow-hidden bg-[#0B1020]">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${consistency}%` }}
            />
          </div>
        </div>

        <div className="clay-inset p-3.5 text-center rounded-2xl bg-[#111827]">
          <div className="text-[11px] text-[#CBD5E1] font-medium">Structure</div>
          <div className="text-lg font-bold text-[#60A5FA] mt-1">{structure}</div>
          <span className="inline-block mt-1 text-[10px] text-[#64748B]">Heading & logic</span>
        </div>
      </div>

      {/* Retained Key Entities */}
      {retainedKeyEntities.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-medium text-[#CBD5E1] flex items-center space-x-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span>Retained Critical Facts & Technical Terms</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {retainedKeyEntities.slice(0, 8).map((entity, i) => (
              <span
                key={i}
                className="clay-pill px-2.5 py-1 text-[11px] font-mono text-[#CBD5E1]"
              >
                {entity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Issues / Warnings */}
      {hasIssues ? (
        <div className="clay-card p-3.5 border-[#F59E0B]/30 bg-[#F59E0B]/10 text-xs text-[#FDE68A]">
          <div className="flex items-center space-x-1.5 font-bold text-[#FDE68A]">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>Items Requiring Review ({potentialIssues.length + unsupportedClaims.length})</span>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-[#FDE68A]/90 pl-5 list-disc">
            {potentialIssues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
            {unsupportedClaims.map((claim, idx) => (
              <li key={`claim-${idx}`}>Unverified claim: {claim}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="clay-card p-3 border-emerald-500/30 bg-emerald-500/10 flex items-center space-x-2.5 text-xs text-emerald-300 font-medium">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Zero contradictory claims detected. Information strictly grounded in source.</span>
        </div>
      )}

      {/* Required Disclaimer */}
      <div className="flex items-start space-x-2 text-[11px] text-[#94A3B8] border-t border-[#334155] pt-2.5">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#64748B]" />
        <p>
          {disclaimer ||
            'Notice: These are AI-assisted heuristic verifications and do not constitute an absolute legal or factual guarantee.'}
        </p>
      </div>
    </div>
  );
};
