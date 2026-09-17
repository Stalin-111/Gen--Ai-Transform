import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

interface ProcessingTimelineProps {
  currentStage?: number; // 0 to 5
}

const STEPS = [
  { id: 1, label: 'Content received & validated' },
  { id: 2, label: 'Extracting syntactic & domain information' },
  { id: 3, label: 'Understanding deep semantic context' },
  { id: 4, label: 'Generating transformation with Gemini AI' },
  { id: 5, label: 'Checking consistency & factual retention' },
  { id: 6, label: 'Preparing structured output & quality metrics' },
];

export const ProcessingTimeline: React.FC<ProcessingTimelineProps> = ({ currentStage }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (currentStage !== undefined) {
      setActiveStep(currentStage);
      return;
    }

    // Auto-advance through realistic steps during generation
    const intervals = [
      setTimeout(() => setActiveStep(1), 600),
      setTimeout(() => setActiveStep(2), 1400),
      setTimeout(() => setActiveStep(3), 2400),
      setTimeout(() => setActiveStep(4), 4200),
      setTimeout(() => setActiveStep(5), 5800),
    ];

    return () => intervals.forEach(clearTimeout);
  }, [currentStage]);

  return (
    <div className="w-full clay-card p-6 bg-[#151C2F]">
      <div className="flex items-center justify-between border-b border-[#334155] pb-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center space-x-2 font-['Space_Grotesk'] tracking-wide">
            <span className="h-2.5 w-2.5 rounded-full bg-[#06B6D4] animate-pulse"></span>
            <span>Gemini Neural Pipeline Active</span>
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Automated multi-stage transformation in progress
          </p>
        </div>
        <span className="clay-pill px-3 py-1 text-xs font-mono font-bold text-[#60A5FA]">
          Step {Math.min(activeStep + 1, 6)} of 6
        </span>
      </div>

      <div className="space-y-3">
        {STEPS.map((step, idx) => {
          const isCompleted = activeStep > idx;
          const isCurrent = activeStep === idx;
          const isPending = activeStep < idx;

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'clay-inset text-[#38BDF8] font-semibold bg-[#111827]'
                  : isCompleted
                  ? 'text-[#CBD5E1] font-medium'
                  : 'text-[#64748B]'
              }`}
            >
              <div className="shrink-0 flex items-center justify-center w-5 h-5">
                {isCompleted && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 transition-transform duration-200" />
                )}
                {isCurrent && (
                  <Loader2 className="w-4 h-4 text-[#06B6D4] animate-spin" />
                )}
                {isPending && (
                  <Circle className="w-3.5 w-3.5 text-[#475569]" />
                )}
              </div>
              <span className="text-xs sm:text-sm tracking-wide">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
