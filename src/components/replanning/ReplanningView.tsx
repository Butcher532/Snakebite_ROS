import React, { useState } from 'react';
import { useCarePath } from '../../context/CarePathContext';
import { REPLAN_ORCHESTRATION_STEPS, PROVENANCE_AUDIT_DATA } from '../../fixtures/pathways';

export const ReplanningView: React.FC = () => {
  const {
    incident,
    ambulance,
    replanState,
    confirmReplanning,
    notifyAmbulanceAndFamily,
    setIsProvenanceOpen,
    showToast,
  } = useCarePath();

  const [isProvenanceDrawerOpen, setIsProvenanceDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col w-full animate-fade-in">
      <div className="p-margin space-y-space-lg">
        {/* Top System Alert Banner: Calm Urgency */}
        <div className="relative overflow-hidden rounded-xl bg-surface-secondary shadow-xl border border-border-subtle/50">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-status-critical"></div>
          <div className="p-space-lg sm:p-space-xl flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
            <div className="flex items-start gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-status-critical/15 text-status-critical flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[24px]">alt_route</span>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-space-sm">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-status-critical/15 text-status-critical text-[12px] uppercase tracking-wider font-semibold">
                    <span className="w-2 h-2 rounded-full bg-status-critical animate-pulse"></span>
                    Pathway Invalidation Detected
                  </span>
                  <span className="text-text-muted text-[11px] font-mono">Incident #{incident.code}</span>
                  <span className="text-text-muted text-[11px]">•</span>
                  <span className="text-text-secondary text-[11px] font-mono">
                    Timestamp: {replanState.invalidatedTimestamp}
                  </span>
                </div>
                <h1 className="text-[24px] font-semibold text-text-primary tracking-tight">
                  Hospital B Reported Antivenom (ASV) Depleted
                </h1>
                <p className="text-[14px] text-text-secondary max-w-3xl leading-relaxed">
                  {replanState.invalidatedReason} Previous transit pathway was immediately invalidated to preserve
                  critical golden-hour intervention.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-space-sm self-end lg:self-center shrink-0">
              <div className="px-space-md py-space-sm rounded-lg bg-surface-elevated text-right border border-border-subtle/50 shadow-sm">
                <div className="text-[11px] text-text-muted uppercase tracking-wider font-medium">Elapsed Time Delta</div>
                <div className="text-[13px] text-status-warning font-mono font-semibold">
                  {replanState.elapsedReplanTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace Grid: Map Telemetry + Dynamic Re-evaluation */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
          {/* Left / Center: Interactive Rerouting Vector Map & Pathway Delta (7 cols) */}
          <div className="xl:col-span-7 flex flex-col space-y-space-lg">
            {/* Live Divergent Vector Viewport */}
            <div className="relative rounded-xl bg-surface-secondary overflow-hidden shadow-xl min-h-[380px] flex flex-col border border-border-subtle/50">
              {/* Viewport Header Overlay */}
              <div className="absolute top-space-md left-space-md right-space-md z-10 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-space-xs bg-surface-elevated/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-border-subtle/40">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  <span className="text-[12px] text-text-primary font-mono font-medium">
                    LIVE TELEMETRY VECTOR: AMB-17
                  </span>
                </div>

                <div className="pointer-events-auto flex items-center gap-space-xs bg-surface-elevated/90 backdrop-blur-md px-2 py-1 rounded-lg border border-border-subtle/40">
                  <button
                    onClick={() => showToast('Re-centered', 'Re-centered vector around divergence node', 'info')}
                    className="p-1 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    title="Recenter"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">my_location</span>
                  </button>
                  <button
                    onClick={() => showToast('Layers', 'Multi-layer GIS overlay enabled', 'info')}
                    className="p-1 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    title="Toggle Layers"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">layers</span>
                  </button>
                </div>
              </div>

              {/* Synthetic Map Canvas Container */}
              <div className="relative w-full h-80 sm:h-96 bg-canvas-base flex-1 overflow-hidden">
                {/* Simulated Radar Grid & Divergence Vector SVG */}
                <svg className="absolute inset-0 w-full h-full text-border-subtle/40" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.75" />
                    </pattern>
                    <linearGradient id="activeRoute" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5B8CFF" />
                      <stop offset="100%" stopColor="#36D399" />
                    </linearGradient>
                  </defs>

                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Regional Boundaries / Isochrones */}
                  <circle cx="52%" cy="48%" r="140" fill="none" stroke="#26313D" strokeDasharray="4 4" strokeWidth="1" />
                  <circle cx="52%" cy="48%" r="220" fill="none" stroke="#26313D" strokeDasharray="2 4" strokeWidth="1" opacity="0.6" />

                  {/* Invalidated Path (To Hospital B) */}
                  <path
                    d="M 180 230 Q 280 180, 420 120"
                    fill="none"
                    stroke="#FF5C6C"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    opacity="0.8"
                  />

                  {/* Divergence / Switch Node Point */}
                  <circle cx="270" cy="184" r="5" fill="#F5B942" />
                  <circle cx="270" cy="184" r="12" fill="none" stroke="#F5B942" strokeWidth="1.5" opacity="0.5" />

                  {/* New Reroute Path (To Hospital C) */}
                  <path
                    d="M 270 184 Q 340 240, 520 280"
                    fill="none"
                    stroke="url(#activeRoute)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Vector Map Markers */}
                {/* Marker: Unit AMB-17 Diverting */}
                <div className="absolute top-[160px] left-[245px] -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none">
                  <div className="px-2 py-1 rounded bg-surface-elevated text-primary font-mono text-[12px] shadow-lg whitespace-nowrap flex items-center gap-1 border border-border-subtle/50">
                    <span className="material-symbols-outlined text-[14px]">directions_car</span>
                    <span>AMB-17 Diverting (68 km/h)</span>
                  </div>
                  <div className="w-3 h-3 bg-primary rotate-45 -mt-1.5"></div>
                </div>

                {/* Marker: Invalidated Hospital B */}
                <div className="absolute top-[120px] left-[420px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-surface-secondary text-status-critical flex items-center justify-center shadow-lg ring-2 ring-status-critical/40">
                    <span className="material-symbols-outlined text-[18px]">block</span>
                  </div>
                  <div className="mt-1 px-2 py-0.5 rounded bg-surface-secondary/95 text-text-muted text-[12px] line-through border border-border-subtle/40">
                    Hosp B (Stock 0)
                  </div>
                </div>

                {/* Marker: Destination Hospital C */}
                <div className="absolute top-[280px] left-[520px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                  <div className="relative">
                    <span className="absolute -inset-2 rounded-full bg-tertiary/20 animate-ping"></span>
                    <div className="w-9 h-9 rounded-full bg-tertiary text-canvas-base font-bold flex items-center justify-center shadow-xl">
                      <span className="material-symbols-outlined text-[20px]">local_hospital</span>
                    </div>
                  </div>
                  <div className="mt-1.5 px-2.5 py-1 rounded-md bg-surface-elevated text-text-primary text-[13px] font-medium shadow-xl flex items-center gap-1.5 border border-border-subtle/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    <span>Hospital C • ETA 21m</span>
                  </div>
                </div>

                {/* Map HUD overlay footer */}
                <div className="absolute bottom-space-md left-space-md right-space-md flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                  <div className="pointer-events-auto flex items-center gap-space-sm bg-surface-secondary/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-text-secondary text-[11px] border border-border-subtle/40">
                    <span className="flex items-center gap-1 text-status-critical">
                      <span className="w-2 h-0.5 bg-status-critical inline-block"></span> Invalidated
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      <span className="w-2 h-0.5 bg-primary inline-block"></span> New Transit Path
                    </span>
                    <span className="text-text-muted">| Sector: NW Regional Corridor</span>
                  </div>
                  <div className="pointer-events-auto bg-surface-secondary/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-text-primary font-mono text-[12px] border border-border-subtle/40">
                    Distance to Re-route: 14.8 km
                  </div>
                </div>
              </div>
            </div>

            {/* Pathway Comparison Matrix: Hospital B vs Hospital C */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {/* Old Invalidated Pathway Card */}
              <div className="rounded-xl bg-surface-secondary/60 p-space-lg flex flex-col justify-between opacity-75 hover:opacity-100 transition-opacity border border-border-subtle/30">
                <div className="space-y-space-md">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-text-muted text-[12px] uppercase tracking-wider line-through">
                      Previous Plan
                    </span>
                    <span className="inline-flex items-center gap-1 text-status-critical text-[12px] font-medium">
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                      Invalidated 12:49 PM
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-text-muted line-through">
                      Hospital B (St. Jude Regional)
                    </h3>
                    <p className="text-[13px] text-text-muted mt-0.5">Route: Hwy 4 North • Primary Trauma Center</p>
                  </div>
                  <div className="space-y-2 py-space-sm text-text-muted text-[13px]">
                    <div className="flex items-center justify-between py-1 bg-surface-container-low/50 px-2 rounded">
                      <span>Antivenom Stock:</span>
                      <span className="text-status-critical font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                        0 Vials (Stockout)
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 px-2">
                      <span>Projected Arrival:</span>
                      <span className="line-through font-mono">1:13 PM (24 min)</span>
                    </div>
                    <div className="flex items-center justify-between py-1 px-2">
                      <span>Telemetry Integrity:</span>
                      <span className="text-text-muted">Revoked by Facility Nurse</span>
                    </div>
                  </div>
                </div>

                <div className="pt-space-md text-text-muted text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Transferred to standby backup registry
                </div>
              </div>

              {/* New Recommended Alternative Pathway Card */}
              <div className="rounded-xl bg-surface-elevated p-space-lg flex flex-col justify-between shadow-xl relative overflow-hidden border border-border-subtle/60">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="space-y-space-md">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[12px] font-semibold uppercase tracking-wider">
                      Recommended New Pathway
                    </span>
                    <span className="inline-flex items-center gap-1 text-status-warning text-[12px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-warning animate-pulse"></span>
                      {replanState.confirmed ? 'Confirmed & Active' : 'Awaiting Confirmation'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-[18px] font-semibold text-text-primary">
                        Hospital C (District Medical)
                      </h3>
                      <span className="text-[13px] text-tertiary font-mono font-semibold">ETA 21 min (-3m)</span>
                    </div>
                    <p className="text-[13px] text-text-secondary mt-0.5">Vector: East Ring Expressway • Full Critical Care Suite</p>
                  </div>

                  {/* Node Sequence Flow */}
                  <div className="flex items-center gap-2 py-1 px-2 rounded bg-surface-secondary text-text-secondary text-[12px] overflow-x-auto border border-border-subtle/30 font-mono">
                    <span className="text-text-primary font-medium">Patient</span>
                    <span className="material-symbols-outlined text-[14px] text-text-muted">arrow_forward</span>
                    <span className="text-primary font-medium">AMB #17</span>
                    <span className="material-symbols-outlined text-[14px] text-text-muted">arrow_forward</span>
                    <span className="text-tertiary font-medium">Hospital C (Bay 2)</span>
                  </div>

                  {/* Operational Readiness Attributes */}
                  <div className="space-y-2 py-space-xs text-[13px]">
                    <div className="flex items-center justify-between py-1 bg-surface-secondary/80 px-2 rounded">
                      <span className="text-text-secondary">ASV Cold-Chain Reserve:</span>
                      <span className="text-tertiary font-medium flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                        14 Vials Polyvalent
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 px-2">
                      <span className="text-text-secondary">ICU & Tox Response:</span>
                      <span className="text-text-primary flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[15px] text-tertiary">check_circle</span>
                        Bed 4 Reserved & Ready
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 px-2">
                      <span className="text-text-secondary">Provenance & Stock Verif:</span>
                      <span className="text-text-muted font-mono text-[11px]">Auto-polled 12:48 PM</span>
                    </div>
                  </div>
                </div>

                <div className="pt-space-md flex items-center justify-between text-[11px] text-text-muted">
                  <span>Confidence Score: {replanState.confidenceScore}%</span>
                  <span className="text-tertiary font-medium">No secondary reroutes anticipated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic CarePath Engine & Actions (5 cols) */}
          <div className="xl:col-span-5 flex flex-col space-y-space-lg">
            {/* Re-evaluation Orchestrator Checklist Card */}
            <div className="rounded-xl bg-surface-secondary p-space-lg sm:p-space-xl shadow-xl flex flex-col space-y-space-lg border border-border-subtle/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-elevated text-primary flex items-center justify-center border border-border-subtle/40">
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                  </div>
                  <div>
                    <h2 className="text-[16px] font-semibold text-text-primary">Dynamic CarePath Engine</h2>
                    <p className="text-[11px] text-text-muted">Automated Multi-Constraint Resolution</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-tertiary/15 text-tertiary font-mono text-[12px]">
                  Cycle: 840ms
                </span>
              </div>

              {/* Chronological Orchestration Sequence */}
              <div className="space-y-space-md">
                {REPLAN_ORCHESTRATION_STEPS.map((step) => (
                  <div
                    key={step.step}
                    className={`flex items-start gap-space-md p-space-sm rounded-lg ${
                      step.isTarget
                        ? 'bg-surface-elevated border border-primary/30'
                        : 'bg-surface-container-low border border-border-subtle/30'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        step.isTarget
                          ? 'bg-primary text-canvas-base'
                          : 'bg-tertiary/20 text-tertiary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {step.isTarget ? 'star' : 'check'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[13px] ${
                            step.isTarget ? 'font-semibold text-text-primary' : 'font-medium text-text-primary'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span
                          className={`text-[11px] font-mono ${
                            step.isTarget ? 'text-primary' : 'text-text-muted'
                          }`}
                        >
                          {step.time}
                        </span>
                      </div>
                      <p className="text-[13px] text-text-secondary mt-0.5 leading-snug">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clinical Context Insight Box */}
              <div className="p-space-md rounded-lg bg-surface-container-low space-y-2 border border-border-subtle/40">
                <div className="flex items-center gap-1.5 text-text-secondary text-[12px] font-medium">
                  <span className="material-symbols-outlined text-[16px] text-primary">clinical_notes</span>
                  <span>Clinical Guidance Note</span>
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  Vipera berus envenomations require ASV delivery within 120 minutes of bite. Current total transit
                  elapsed: 38 min. Reroute keeps patient well inside optimal window.
                </p>
              </div>
            </div>

            {/* Command Actions Box */}
            <div className="rounded-xl bg-surface-secondary p-space-lg sm:p-space-xl shadow-xl flex flex-col space-y-space-md border border-border-subtle/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-semibold text-text-primary">Coordinator Authority Required</span>
                <span className="text-[11px] text-text-muted font-mono">Action Timeout: 03:42</span>
              </div>

              {/* Primary CTA Button */}
              <button
                id="confirm-btn"
                onClick={confirmReplanning}
                disabled={replanState.confirmed}
                className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
                  replanState.confirmed
                    ? 'bg-tertiary text-canvas-base cursor-default'
                    : 'bg-primary hover:bg-primary-fixed-dim text-on-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {replanState.confirmed ? 'check' : 'check_circle'}
                </span>
                <span>
                  {replanState.confirmed ? 'Pathway Confirmed & Active' : 'Confirm Pathway to Hospital C'}
                </span>
              </button>

              {/* Secondary CTA */}
              <button
                id="notify-btn"
                onClick={notifyAmbulanceAndFamily}
                className="w-full py-2.5 px-4 rounded-xl bg-surface-elevated hover:bg-surface-container-high text-text-primary text-[13px] font-medium flex items-center justify-center gap-2 transition-colors border border-border-subtle/50 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-text-secondary">
                  {replanState.dispatchesNotified ? 'done_all' : 'send_to_mobile'}
                </span>
                <span>
                  {replanState.dispatchesNotified ? 'Dispatches Transmitted' : 'Notify Ambulance #17 & Patient Family'}
                </span>
              </button>

              {/* Tertiary & Auxiliary CTA */}
              <div className="flex items-center gap-space-sm pt-space-xs">
                <button
                  id="inspect-provenance-btn"
                  onClick={() => setIsProvenanceDrawerOpen(!isProvenanceDrawerOpen)}
                  className="flex-1 py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-text-secondary hover:text-text-primary text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors border border-border-subtle/30 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">history_edu</span>
                  <span>Why this change? (Inspect Provenance)</span>
                </button>

                <button
                  onClick={() => showToast('Abort Protocol', 'Manual override: maintain standby holding pattern', 'warning')}
                  className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-text-secondary hover:text-status-critical transition-colors border border-border-subtle/30 cursor-pointer"
                  title="Abort Reroute Protocol"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">emergency_home</span>
                </button>
              </div>

              {/* Confirmation Alert Container */}
              {replanState.confirmed && (
                <div
                  id="feedback-alert"
                  className="flex p-space-md rounded-lg bg-tertiary/15 text-tertiary items-center gap-space-sm text-[12px] border border-tertiary/30 animate-fade-in"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>
                    Reroute approved. Nav-vector pushed to Ambulance #17 console. Handoff initialized with Hospital C.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Provenance Drawer */}
        {isProvenanceDrawerOpen && (
          <div
            id="provenance-drawer"
            className="rounded-xl bg-surface-secondary p-space-lg shadow-xl space-y-space-md border border-border-subtle/50 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">policy</span>
                <span className="text-[16px] font-semibold text-text-primary">
                  Decision Provenance & Verification Chain
                </span>
              </div>
              <button
                onClick={() => setIsProvenanceDrawerOpen(false)}
                className="p-1 rounded text-text-muted hover:text-text-primary cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-xs">
              {PROVENANCE_AUDIT_DATA.map((item, index) => (
                <div key={index} className="p-space-md rounded-lg bg-surface-container-low space-y-1 border border-border-subtle/30">
                  <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium">
                    {item.title}
                  </span>
                  <div className="text-[13px] font-medium text-text-primary">{item.source}</div>
                  <p className="text-[13px] text-text-secondary leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
