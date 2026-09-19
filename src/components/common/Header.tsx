import React, { useState } from 'react';
import { useCarePath } from '../../context/CarePathContext';
import { APP_CONFIG } from '../../config/appConfig';

export const Header: React.FC = () => {
  const {
    incident,
    allIncidents,
    setIncidentById,
    showToast,
    replanState,
    currentRoute,
    isMockMode,
    currentTheme,
    setIsThemeModalOpen,
    isSidebarOpen,
    toggleSidebar,
  } = useCarePath();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showIncidentPicker, setShowIncidentPicker] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);

  return (
    <header className="w-full h-16 bg-surface-secondary/90 backdrop-blur-xl border-b border-border-subtle z-30 px-space-md sm:px-space-lg flex items-center justify-between shrink-0">
      {/* Left Info & Status */}
      <div className="flex items-center gap-space-sm sm:gap-space-md min-w-0">
        {/* Sidebar Open/Collapse Toggle Button */}
        <button
          id="header-sidebar-toggle-btn"
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-surface-elevated hover:bg-surface-bright text-text-secondary hover:text-text-primary border border-border-subtle transition-colors cursor-pointer flex items-center justify-center shrink-0"
          title={isSidebarOpen ? 'Collapse sidebar (press [)' : 'Expand sidebar (press [)'}
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isSidebarOpen ? 'menu_open' : 'menu'}
          </span>
        </button>

        {/* Active Route Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[12px] font-mono text-text-muted hidden sm:inline">CarePath</span>
          <span className="text-[12px] text-text-muted hidden sm:inline">/</span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-elevated border border-border-subtle shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-primary">{currentRoute.icon}</span>
            <span className="text-[12px] font-semibold text-text-primary">{currentRoute.title}</span>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-space-xs text-text-secondary text-[12px]">
          <span className="material-symbols-outlined text-[15px] text-text-muted">schedule</span>
          <span>Synchronized:</span>
          <span className="text-[12px] text-text-primary font-mono font-medium">{APP_CONFIG.system.defaultTime}</span>
        </div>

        {/* Incident Quick Selector for Fixture Testing */}
        <div className="relative">
          <button
            onClick={() => setShowIncidentPicker(!showIncidentPicker)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-elevated hover:bg-surface-container-high border border-border-subtle text-[12px] text-text-secondary transition-colors cursor-pointer"
            title="Switch incident fixture"
          >
            <span className="font-mono text-primary">{incident.code}</span>
            <span className="material-symbols-outlined text-[14px]">unfold_more</span>
          </button>

          {showIncidentPicker && (
            <div className="absolute left-0 mt-1 w-64 rounded-xl bg-surface-elevated border border-border-subtle shadow-2xl p-2 z-50">
              <div className="text-[11px] font-mono text-text-muted px-2 py-1 uppercase tracking-wider">
                Select Active Fixture
              </div>
              {allIncidents.map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => {
                    setIncidentById(inc.id);
                    setShowIncidentPicker(false);
                    showToast('Fixture Switched', `Loaded test incident ${inc.code}`, 'info');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] flex items-center justify-between transition-colors cursor-pointer ${
                    inc.id === incident.id
                      ? 'bg-primary/15 text-primary font-semibold'
                      : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                  }`}
                >
                  <span className="font-mono">{inc.code}</span>
                  <span className="text-[10px] text-text-muted truncate ml-2">{inc.species.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-space-sm sm:gap-space-md">
        {/* Future API Contract Inspector */}
        <div className="relative">
          <button
            onClick={() => setShowApiModal(!showApiModal)}
            className="px-2.5 py-1 rounded-lg bg-surface-elevated hover:bg-surface-bright text-text-secondary hover:text-text-primary border border-border-subtle text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Inspect API endpoints and future integration schema"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">api</span>
            <span className="hidden md:inline">API Contracts</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${isMockMode ? 'bg-primary' : 'bg-tertiary'}`}
            ></span>
          </button>

          {showApiModal && (
            <div className="absolute right-0 mt-2 w-96 rounded-xl bg-surface-elevated border border-border-subtle shadow-2xl p-space-md z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">developer_board</span>
                  <span className="text-[13px] font-semibold text-text-primary">Route API Specifications</span>
                </div>
                <button
                  onClick={() => setShowApiModal(false)}
                  className="text-text-muted hover:text-text-primary cursor-pointer text-[16px]"
                >
                  ✕
                </button>
              </div>

              <div className="py-2 text-[12px] space-y-2">
                <p className="text-text-secondary leading-relaxed">
                  CarePath is built with a decentralized adapter layer. Connect real backend APIs by pointing{' '}
                  <code className="px-1 py-0.5 rounded bg-surface-container font-mono text-[11px]">VITE_API_BASE_URL</code>{' '}
                  to your server.
                </p>

                <div className="text-[11px] font-medium text-text-muted uppercase tracking-wider pt-1">
                  Endpoints for {currentRoute.title}:
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {currentRoute.futureApiEndpoints.map((api, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-surface-secondary border border-border-subtle/40 flex flex-col gap-0.5"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span
                          className={`px-1 rounded font-bold text-[10px] ${
                            api.method === 'GET'
                              ? 'bg-primary/15 text-primary'
                              : api.method === 'POST'
                              ? 'bg-tertiary/15 text-tertiary'
                              : 'bg-status-warning/15 text-status-warning'
                          }`}
                        >
                          {api.method}
                        </span>
                        <span className="text-text-primary truncate ml-1">{api.endpoint}</span>
                      </div>
                      <span className="text-[11px] text-text-muted mt-0.5">{api.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Current status:</span>
                <span className="font-mono text-tertiary font-semibold">
                  {isMockMode ? 'Fixture Mock Active' : 'Remote API Mode'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Global Theme & Styles Trigger */}
        <button
          onClick={() => setIsThemeModalOpen(true)}
          className="px-2.5 py-1 rounded-lg bg-surface-elevated hover:bg-surface-bright text-text-secondary hover:text-text-primary border border-border-subtle text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Open Global Theme & Component Appearance Engine"
        >
          <span className="material-symbols-outlined text-[15px] text-primary">palette</span>
          <span className="hidden sm:inline">Theme:</span>
          <span className="text-text-primary font-semibold hidden md:inline">{currentTheme.name.split(' ')[0]}</span>
        </button>

        {/* Notifications Toggle */}
        <div className="relative">
          <button
            id="notifications-btn"
            aria-label="Alert Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 rounded-lg bg-surface-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {!replanState.confirmed && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-critical ring-2 ring-surface-secondary"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-surface-elevated border border-border-subtle shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <span className="text-[13px] font-semibold text-text-primary">System Notifications</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-critical/15 text-status-critical">
                  1 Critical
                </span>
              </div>
              <div className="py-2 space-y-2">
                <div className="p-2 rounded-lg bg-status-critical/10 border border-status-critical/20 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-[11px] text-status-critical font-medium">
                    <span>ASV Stockout Alert</span>
                    <span className="font-mono">12:49 PM</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Hospital B (St. Jude Regional) reported zero available vials. Replan protocol triggered.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-surface flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-[11px] text-tertiary font-medium">
                    <span>Telematics Synchronized</span>
                    <span className="font-mono">12:44 PM</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    ALS Unit 17 continuous multi-channel vitals streaming normal.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border-subtle"></div>

        {/* User Profile */}
        <div className="flex items-center gap-space-md pl-space-xs">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[13px] font-medium text-text-primary leading-tight">
              {APP_CONFIG.system.currentUser.name}
            </span>
            <span className="text-[11px] text-text-muted">{APP_CONFIG.system.currentUser.role}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm font-semibold text-[13px]">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
