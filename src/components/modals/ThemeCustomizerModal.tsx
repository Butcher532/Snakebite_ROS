import React from 'react';
import { useCarePath } from '../../context/CarePathContext';
import { AVAILABLE_THEMES, ThemePreset } from '../../config/theme';

export const ThemeCustomizerModal: React.FC = () => {
  const { currentTheme, setThemeById, isThemeModalOpen, setIsThemeModalOpen, showToast } = useCarePath();

  if (!isThemeModalOpen) return null;

  const themesList = Object.values(AVAILABLE_THEMES);

  const handleSelectTheme = (themeId: ThemePreset['id']) => {
    setThemeById(themeId);
    showToast('Theme Updated', `Switched to ${AVAILABLE_THEMES[themeId].name}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-surface-elevated border border-border-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-space-xl py-space-lg border-b border-border-subtle flex items-center justify-between bg-surface-secondary">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">palette</span>
            </div>
            <div>
              <h2 className="text-[17px] font-semibold text-text-primary tracking-tight">
                Global Theme & Appearance Engine
              </h2>
              <p className="text-[12px] text-text-secondary">
                Configure colors, corner radii, borders, and density across all screens from{' '}
                <code className="text-primary font-mono text-[11px]">src/config/theme.ts</code>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-surface border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-space-xl overflow-y-auto space-y-space-xl">
          {/* Quick Presets Grid */}
          <div>
            <div className="flex items-center justify-between mb-space-md">
              <span className="text-[12px] font-mono text-text-muted uppercase tracking-wider">
                Select Theme Archetype
              </span>
              <span className="text-[11px] text-text-muted font-mono">Single File Config</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {themesList.map((t) => {
                const isSelected = currentTheme.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTheme(t.id)}
                    className={`p-space-md rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-surface border-primary ring-2 ring-primary/20 shadow-lg'
                        : 'bg-surface-secondary/70 border-border-subtle hover:bg-surface-secondary hover:border-border-subtle/80'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-semibold text-text-primary">{t.name}</span>
                          {t.isDark ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-surface-container text-text-muted">
                              Dark
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-primary/15 text-primary">
                              Light
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-secondary mt-1 leading-snug">{t.description}</p>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
                          check_circle
                        </span>
                      )}
                    </div>

                    {/* Color Swatch Preview */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-border-subtle/50">
                      <div
                        className="w-6 h-6 rounded-md border border-black/20 shadow-sm"
                        style={{ backgroundColor: t.colors.canvasBase }}
                        title="Canvas Background"
                      />
                      <div
                        className="w-6 h-6 rounded-md border border-black/20 shadow-sm"
                        style={{ backgroundColor: t.colors.surface }}
                        title="Surface"
                      />
                      <div
                        className="w-6 h-6 rounded-md border border-black/20 shadow-sm"
                        style={{ backgroundColor: t.colors.primary }}
                        title="Primary Accent"
                      />
                      <div
                        className="w-6 h-6 rounded-md border border-black/20 shadow-sm"
                        style={{ backgroundColor: t.colors.tertiary }}
                        title="Tertiary / Success"
                      />
                      <div
                        className="w-6 h-6 rounded-md border border-black/20 shadow-sm"
                        style={{ backgroundColor: t.colors.statusCritical }}
                        title="Critical Alert"
                      />
                      <span className="text-[10px] font-mono text-text-muted ml-auto">
                        {t.components.cardRadius} radius
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tokens Summary Card */}
          <div className="p-space-lg rounded-xl bg-surface-secondary border border-border-subtle">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="text-[12px] font-semibold text-text-primary">
                Active Component Tokens ({currentTheme.name})
              </span>
              <span className="text-[11px] font-mono text-primary">Reactive CSS Variables</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md text-[12px]">
              <div className="p-2 rounded-lg bg-surface border border-border-subtle">
                <span className="text-[10px] text-text-muted uppercase font-mono block">Card Radius</span>
                <span className="font-mono text-text-primary font-semibold">{currentTheme.components.cardRadius}</span>
              </div>
              <div className="p-2 rounded-lg bg-surface border border-border-subtle">
                <span className="text-[10px] text-text-muted uppercase font-mono block">Button Radius</span>
                <span className="font-mono text-text-primary font-semibold">{currentTheme.components.buttonRadius}</span>
              </div>
              <div className="p-2 rounded-lg bg-surface border border-border-subtle">
                <span className="text-[10px] text-text-muted uppercase font-mono block">Border Width</span>
                <span className="font-mono text-text-primary font-semibold">{currentTheme.components.borderWidth}</span>
              </div>
              <div className="p-2 rounded-lg bg-surface border border-border-subtle">
                <span className="text-[10px] text-text-muted uppercase font-mono block">Density</span>
                <span className="font-mono text-text-primary font-semibold capitalize">{currentTheme.components.density}</span>
              </div>
            </div>
          </div>

          {/* Developer Guidance Callout */}
          <div className="p-space-md rounded-xl bg-primary/10 border border-primary/25 flex items-start gap-space-md">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">code</span>
            <div className="text-[12px] text-text-secondary leading-relaxed">
              <span className="font-semibold text-text-primary block mb-0.5">How to customize permanently:</span>
              Open <code className="px-1 py-0.5 rounded bg-surface font-mono text-[11px] text-primary">src/config/theme.ts</code>.
              Modify <code className="font-mono text-[11px] text-text-primary">DEFAULT_THEME_ID</code> or edit any hex color in{' '}
              <code className="font-mono text-[11px] text-text-primary">TACTICAL_DARK_THEME</code>, and your entire application’s appearance
              updates immediately.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-space-xl py-space-md border-t border-border-subtle flex items-center justify-between bg-surface-secondary">
          <span className="text-[11px] text-text-muted">
            Changes apply instantly to all 5 screens and modals.
          </span>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="px-space-lg py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[13px] font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
