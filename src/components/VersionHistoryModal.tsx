import React, { useState } from 'react';
import { History, X, Calendar, Check, RotateCcw, ArrowRight } from 'lucide-react';
import { TransformationVersion } from '../types';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: TransformationVersion[];
  currentVersionNumber: number;
  onSelectVersion: (ver: TransformationVersion) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  versions,
  currentVersionNumber,
  onSelectVersion,
}) => {
  const [selectedVerId, setSelectedVerId] = useState<string>(
    versions[versions.length - 1]?.id || ''
  );

  if (!isOpen) return null;

  const activeVersion = versions.find((v) => v.id === selectedVerId) || versions[versions.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1020]/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-[82vh] w-full max-w-4xl flex-col clay-modal shadow-2xl overflow-hidden bg-[#151C2F] border border-[#334155]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#334155] px-6 py-4">
          <div className="flex items-center space-x-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl clay-inset text-[#38BDF8] bg-[#0B1020]">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] font-['Space_Grotesk'] tracking-tight">
                Version History
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Track modifications, compare iterations and restore earlier drafts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="clay-btn clay-btn-secondary p-1.5 text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body 2-column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Version List Sidebar */}
          <div className="w-72 border-r border-[#334155] p-4 overflow-y-auto space-y-2.5 bg-[#111827]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] px-2 py-1 flex items-center justify-between">
              <span>Iterations</span>
              <span className="clay-pill px-2 py-0.5 text-[10px] font-mono text-[#60A5FA]">{versions.length}</span>
            </div>
            {versions.map((ver) => {
              const isSelected = (activeVersion?.id === ver.id);
              const isCurrent = (ver.versionNumber === currentVersionNumber);

              return (
                <button
                  key={ver.id}
                  onClick={() => setSelectedVerId(ver.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all ${
                    isSelected
                      ? 'clay-card border-[#38BDF8] bg-[#1B2540]'
                      : 'clay-inset bg-[#151C2F] hover:bg-[#1B2540]/60 text-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-[#F8FAFC]">
                      Version {ver.versionNumber}
                    </span>
                    {isCurrent && (
                      <span className="clay-pill px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-1 line-clamp-1 font-medium">
                    {ver.editNote || (ver.versionNumber === 1 ? 'Initial AI Output' : 'Edited content')}
                  </p>
                  <div className="flex items-center space-x-1.5 text-[10px] text-[#64748B] mt-2">
                    <Calendar className="h-3 w-3 text-[#38BDF8]" />
                    <span>{new Date(ver.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Preview Panel */}
          <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4 bg-[#151C2F]">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#F8FAFC]">
                    Version {activeVersion?.versionNumber}
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    • Saved on {activeVersion?.createdAt ? new Date(activeVersion.createdAt).toLocaleString() : ''}
                  </span>
                </div>
                <p className="text-xs text-[#38BDF8] mt-0.5 font-semibold">
                  {activeVersion?.editNote || 'AI Generation'}
                </p>
              </div>

              <button
                onClick={() => {
                  if (activeVersion) {
                    onSelectVersion(activeVersion);
                    onClose();
                  }
                }}
                className="clay-btn clay-btn-primary px-4 py-2 text-xs font-bold text-white space-x-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restore This Version</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto clay-inset p-5 font-mono text-xs text-[#CBD5E1] whitespace-pre-wrap leading-relaxed bg-[#111827]">
              {activeVersion?.content || 'No content found for this version.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
