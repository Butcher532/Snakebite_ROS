import React from 'react';
import { useCarePath } from '../../context/CarePathContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    routes,
    isMockMode,
    setIsMockMode,
    incident,
    replanState,
    triggerSimulatedStockout,
    resetToFixtures,
    showToast,
    currentTheme,
    setIsThemeModalOpen,
  } = useCarePath();

  const handleToggleApiMode = () => {
    const nextMode = !isMockMode;
    setIsMockMode(nextMode);
    showToast(
      nextMode ? 'Fixture Mock Mode Active' : 'Live API Mode Active',
      nextMode
        ? 'Using local decentralized fixtures & simulated latency.'
        : 'Connecting to configured remote backend endpoint at /api/v1.',
      'info'
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-secondary border-r border-border-subtle z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-space-lg flex items-center gap-space-md border-b border-border-subtle">
          <div className="w-9 h-9 rounded-lg bg-surface-elevated border border-border-subtle flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-[20px]">emergency</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-semibold text-text-primary tracking-tight leading-tight">CarePath</span>
            <span className="text-[11px] text-text-muted uppercase tracking-wider">Operations Command</span>
          </div>
        </div>

        {/* Active Incident Snapshot */}
        <div className="p-space-md border-b border-border-subtle bg-surface-container-low">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="text-[12px] font-medium text-text-muted uppercase tracking-wider">Active Incident</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-status-critical/15 text-status-critical text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-status-critical mr-1.5 animate-pulse"></span>
              LIVE
            </span>
          </div>
          <div className="text-[16px] text-text-primary font-semibold tracking-tight">{incident.code}</div>
          <div className="text-[11px] text-text-secondary mt-0.5 truncate">
            {incident.species} • {incident.tier}
          </div>
        </div>

        {/* Declarative Navigation items rendered dynamically from route registry */}
        <nav className="flex flex-col p-space-md space-y-1" aria-label="Main Navigation">
          {routes.map((route) => {
            const isActive = activeTab === route.id;
            const hasAlertBadge = route.id === 'replanning' && !replanState.confirmed;

            return (
              <button
                key={route.id}
                id={`nav-btn-${route.id}`}
                onClick={() => setActiveTab(route.id)}
                className={`flex items-center justify-between px-space-md py-space-sm rounded-lg transition-colors text-left w-full cursor-pointer ${
                  isActive
                    ? 'bg-surface-elevated text-text-primary font-semibold border border-border-subtle shadow-sm'
                    : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
                }`}
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <span
                    className={`material-symbols-outlined text-[20px] shrink-0 ${
                      isActive ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    {route.icon}
                  </span>
                  <span className="text-[14px] truncate">{route.title}</span>
                </div>
                {hasAlertBadge && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-semibold bg-status-critical/20 text-status-critical shrink-0">
                    Alert
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Testing / Fixtures Sandbox & Future API Controls */}
        <div className="mx-space-md my-1 p-2 rounded-lg bg-surface-elevated/40 border border-border-subtle/50 text-[11px] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-text-muted font-mono uppercase tracking-wider">
            <span>Data / API Engine</span>
            <button
              onClick={handleToggleApiMode}
              className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold transition-colors cursor-pointer ${
                isMockMode
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-tertiary/15 text-tertiary border border-tertiary/30'
              }`}
              title="Click to toggle between Mock Fixtures and Live API integration"
            >
              {isMockMode ? 'MOCK FIXTURES' : 'LIVE API'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={triggerSimulatedStockout}
              title="Simulate Hospital B stockout to trigger replan workflow"
              className="py-1 px-1.5 rounded bg-status-critical/10 hover:bg-status-critical/20 text-status-critical text-[10px] font-medium truncate transition-colors text-center cursor-pointer"
            >
              Sim Stockout
            </button>
            <button
              onClick={resetToFixtures}
              title="Reset state to initial fixture values"
              className="py-1 px-1.5 rounded bg-surface-container hover:bg-surface-container-high text-text-secondary hover:text-text-primary text-[10px] truncate transition-colors text-center cursor-pointer"
            >
              Reset Fixture
            </button>
          </div>

          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="w-full py-1 px-2 rounded bg-surface-elevated hover:bg-surface-bright text-text-secondary hover:text-text-primary border border-border-subtle/70 text-[10px] flex items-center justify-between transition-colors cursor-pointer"
            title="Configure global theme, colors, and component style tokens"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px] text-primary">palette</span>
              <span>Theme & Style:</span>
            </span>
            <span className="font-mono text-text-primary font-semibold truncate ml-1">{currentTheme.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Telemetry Hub Status Footer */}
      <div className="p-space-md border-t border-border-subtle bg-surface-container-low">
        <div className="flex items-center justify-between text-text-muted text-[11px]">
          <span className="font-mono">Route: #{activeTab}</span>
          <span className="flex items-center gap-1.5 font-mono text-tertiary">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            SYNC
          </span>
        </div>
      </div>
    </aside>
  );
};
