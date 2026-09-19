import React from 'react';
import { useCarePath } from '../../context/CarePathContext';

export const WhyPathwayModal: React.FC = () => {
  const { isWhyModalOpen, setIsWhyModalOpen, pathway, downloadCsv } = useCarePath();

  if (!isWhyModalOpen) return null;

  return (
    <div
      id="pathwayPopover"
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-canvas-base/80 backdrop-blur-md"
      onClick={() => setIsWhyModalOpen(false)}
    >
      <div
        className="bg-surface-elevated border border-border-subtle max-w-xl w-full rounded-xl p-space-lg flex flex-col gap-space-lg shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">account_tree</span>
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-text-primary">
                Pathway Rationale & Clinical Optimization
              </h3>
              <span className="text-[11px] text-text-muted">
                {pathway.decisionTreeVersion}
              </span>
            </div>
          </div>
          <button
            id="closePopoverBtn"
            onClick={() => setIsWhyModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-surface hover:bg-surface-bright text-text-secondary flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Factors List */}
        <div className="space-y-space-md">
          {pathway.whyFactors.map((factor, index) => (
            <div key={index} className="flex items-start gap-space-md p-space-sm rounded-lg bg-surface">
              <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">
                {factor.icon}
              </span>
              <div>
                <span className="text-[13px] font-medium text-text-primary block">
                  {factor.title}
                </span>
                <p className="text-[13px] text-text-secondary mt-0.5 leading-relaxed">
                  {factor.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-space-sm border-t border-border-subtle pt-space-sm">
          <button
            id="dismissPopoverBottomBtn"
            onClick={() => setIsWhyModalOpen(false)}
            className="px-space-md py-2 rounded-lg bg-surface hover:bg-surface-bright text-text-primary text-[13px] font-medium transition-colors"
            type="button"
          >
            Acknowledge
          </button>
          <button
            onClick={() => {
              downloadCsv();
              setIsWhyModalOpen(false);
            }}
            className="px-space-md py-2 rounded-lg bg-primary text-on-primary text-[13px] font-semibold flex items-center gap-1.5 shadow-sm hover:brightness-110 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Export Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
