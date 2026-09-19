import React from 'react';
import { useCarePath } from '../../context/CarePathContext';

export const Toast: React.FC = () => {
  const { toast } = useCarePath();

  if (!toast.show) return null;

  return (
    <div
      id="handoff-toast"
      className="fixed bottom-6 right-6 z-50 bg-surface-elevated border border-border-subtle px-space-md py-space-sm rounded-xl shadow-2xl flex items-center gap-space-md animate-fade-in transition-all"
    >
      <div className="w-8 h-8 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[18px]">done_all</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[13px] font-semibold text-text-primary">{toast.title}</span>
        <span className="text-[11px] text-text-muted">{toast.subtitle}</span>
      </div>
    </div>
  );
};
