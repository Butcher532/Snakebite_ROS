import React from 'react';
import { useCarePath } from '../../context/CarePathContext';
import { PROVENANCE_AUDIT_DATA } from '../../fixtures/pathways';

export const ProvenanceModal: React.FC = () => {
  const { isProvenanceOpen, setIsProvenanceOpen } = useCarePath();

  if (!isProvenanceOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-canvas-base/80 backdrop-blur-md"
      onClick={() => setIsProvenanceOpen(false)}
    >
      <div
        className="bg-surface-elevated border border-border-subtle max-w-2xl w-full rounded-xl p-space-lg flex flex-col gap-space-lg shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-subtle pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">policy</span>
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-text-primary">
                Decision Provenance & Verification Chain
              </h3>
              <span className="text-[11px] text-text-muted font-mono">
                CarePath Engine v4.2 • Automated Multi-Constraint Audit
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsProvenanceOpen(false)}
            className="w-8 h-8 rounded-lg bg-surface hover:bg-surface-bright text-text-secondary flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-xs">
          {PROVENANCE_AUDIT_DATA.map((item, idx) => (
            <div key={idx} className="p-space-md rounded-lg bg-surface-container-low space-y-1">
              <span className="text-[11px] text-text-muted uppercase tracking-wider block">
                {item.title}
              </span>
              <div className="text-[13px] font-medium text-text-primary">
                {item.source}
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed mt-1">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end border-t border-border-subtle pt-space-sm">
          <button
            onClick={() => setIsProvenanceOpen(false)}
            className="px-space-md py-2 rounded-lg bg-primary text-on-primary text-[13px] font-medium"
          >
            Close Provenance
          </button>
        </div>
      </div>
    </div>
  );
};
