import React, { useState, useEffect } from 'react';
import { useCarePath } from '../../context/CarePathContext';
import { APP_CONFIG } from '../../config/appConfig';

export const CarePathLive: React.FC = () => {
  const { incident, ambulance, facilities, transmitHandoff, showToast } = useCarePath();

  const [activeLayer, setActiveLayer] = useState<'Route' | 'Facilities' | 'Traffic'>('Route');
  const [isRationaleOpen, setIsRationaleOpen] = useState(false);
  const [isTransmittingHandoff, setIsTransmittingHandoff] = useState(false);
  const [timeSinceBite, setTimeSinceBite] = useState({ minutes: 38, seconds: 14 });

  // Simulate ticking clock for time since bite
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSinceBite((prev) => {
        if (prev.seconds >= 59) {
          return { minutes: prev.minutes + 1, seconds: 0 };
        }
        return { ...prev, seconds: prev.seconds + 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTransmitHandoff = async () => {
    setIsTransmittingHandoff(true);
    await new Promise((res) => setTimeout(res, 900));
    await transmitHandoff();
    setIsTransmittingHandoff(false);
  };

  const handleDirectEDLine = () => {
    showToast(
      'ED Radio Channel Active',
      'Connecting to St. Jude Regional (Hospital B) Trauma Bay 2 coordinator...',
      'info',
    );
  };

  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* Top Banner Bar */}
      <div className="w-full bg-surface-container-low px-space-lg py-space-md shadow-sm border-b border-border-subtle/50">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-sm">
              <span className="px-space-sm py-0.5 rounded-full bg-surface-elevated text-primary text-[11px] font-semibold uppercase tracking-wider border border-border-subtle/40">
                Active Incident
              </span>
              <h1 className="text-[24px] font-semibold text-text-primary tracking-tight">#{incident.code}</h1>
              <span className="text-text-muted text-[14px]">•</span>
              <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-status-critical/15 text-status-critical text-[12px] font-medium">
                <span className="w-2 h-2 rounded-full bg-status-critical animate-ping"></span>
                Suspected Snakebite
              </span>
              <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-elevated text-secondary text-[12px] border border-border-subtle/40">
                <span className="material-symbols-outlined text-[14px]">biotech</span>
                Russell's Viper Probable (Localized Oedema + Fang Punctures)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-space-md text-text-secondary text-[14px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                <span className="text-text-primary font-medium">In Transit</span>
                <span className="text-text-muted">via {ambulance.unitCode}</span>
              </div>
              <span className="text-text-muted">•</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">local_hospital</span>
                <span>Target:</span>
                <span className="text-text-primary font-medium">St. Jude Medical Center (Hospital B)</span>
              </div>
              <span className="text-text-muted">•</span>
              <div className="flex items-center gap-1 text-tertiary font-medium font-mono">
                <span className="material-symbols-outlined text-[16px]">timer</span>
                <span>ETA: {ambulance.etaMinutes} min (13:13 Local)</span>
              </div>
            </div>
          </div>

          {/* Right Live Sensor Gateway Feed */}
          <div className="flex items-center gap-space-md bg-surface-elevated px-space-md py-space-sm rounded-xl border border-border-subtle/50 shadow-sm">
            <div className="flex items-center gap-space-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-[12px] text-text-primary font-semibold">Telemetry Feed Live</span>
                <span className="text-[11px] text-text-muted font-mono">{ambulance.unitCode} Sensor Gateway</span>
              </div>
            </div>

            <div className="h-7 w-px bg-border-subtle/50"></div>
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] text-text-muted uppercase">SpO₂</span>
              <span className="text-[16px] text-tertiary font-mono font-semibold">{incident.vitals.spo2}%</span>
            </div>

            <div className="h-7 w-px bg-border-subtle/50"></div>
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] text-text-muted uppercase">HR</span>
              <span className="text-[16px] text-text-primary font-mono font-semibold">{incident.vitals.hr}</span>
              <span className="text-[11px] text-text-muted">bpm</span>
            </div>

            <div className="h-7 w-px bg-border-subtle/50"></div>
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] text-text-muted uppercase">BP</span>
              <span className="text-[16px] text-text-primary font-mono font-semibold">{incident.vitals.bp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg p-space-lg items-start">
        {/* Left Column: Map & Telemetry Stats (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          {/* Luminous Map Viewport */}
          <div className="relative w-full h-[620px] rounded-xl bg-surface-secondary overflow-hidden shadow-xl flex flex-col justify-between p-space-md border border-border-subtle/50">
            {/* Hotlinked Map Photo Background */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none"
              data-location="Aluva to Ernakulam, Kerala, India"
              style={{ backgroundImage: `url('${APP_CONFIG.mapConfig.mapBackgroundUrl}')` }}
            ></div>

            {/* Glowing Tactical Route SVG overlay */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
              viewBox="0 0 700 620"
            >
              <defs>
                <linearGradient id="routeGlow" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#59d6f7" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#5b8cff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#47dfa4" stopOpacity="1" />
                </linearGradient>
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M 120 480 Q 230 410, 310 330 T 490 190 Q 540 140, 580 120"
                stroke="#161D27"
                strokeLinecap="round"
                strokeWidth="12"
              />
              <path
                d="M 120 480 Q 230 410, 310 330 T 490 190 Q 540 140, 580 120"
                filter="url(#softGlow)"
                stroke="url(#routeGlow)"
                strokeDasharray="6 4"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <path
                d="M 120 480 Q 230 410, 310 330"
                stroke="#47dfa4"
                strokeLinecap="round"
                strokeWidth="4"
              />
            </svg>

            {/* Top GIS Header and Layer Toggles */}
            <div className="relative z-20 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-space-xs bg-surface-elevated/90 backdrop-blur-md px-space-md py-space-xs rounded-lg shadow-md border border-border-subtle/50">
                <span className="material-symbols-outlined text-secondary text-[18px]">satellite_alt</span>
                <span className="text-[12px] font-medium text-text-primary">Aluva Corridor Corridor GPS v5</span>
                <span className="text-text-muted text-[11px] font-mono">• Precision ±2.1m</span>
              </div>

              <div className="flex items-center gap-space-xs bg-surface-elevated/90 backdrop-blur-md p-1 rounded-lg border border-border-subtle/50">
                {(['Route', 'Facilities', 'Traffic'] as const).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setActiveLayer(layer)}
                    className={`px-space-sm py-1 rounded text-[12px] font-medium transition-colors ${
                      activeLayer === layer
                        ? 'text-text-primary bg-surface-container shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Markers Layer */}
            <div className="relative z-20 w-full h-full pointer-events-none">
              {/* Origin Marker */}
              <div className="absolute left-[100px] top-[460px] pointer-events-auto flex flex-col items-center group">
                <div className="px-space-sm py-0.5 rounded bg-surface-elevated text-text-secondary text-[11px] mb-1 whitespace-nowrap shadow-md border border-border-subtle/40">
                  Origin: Aluva Plantation Site
                </div>
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-text-muted shadow-lg ring-2 ring-border-subtle">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                </div>
              </div>

              {/* Active Ambulance #17 Marker */}
              <div className="absolute left-[295px] top-[315px] pointer-events-auto flex flex-col items-center">
                <div className="px-space-sm py-1 rounded-lg bg-surface-elevated text-secondary text-[12px] font-semibold flex items-center gap-1 mb-1 shadow-lg border border-border-subtle/50 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  Ambulance #17 ({ambulance.speedKmh} km/h)
                </div>
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute h-8 w-8 rounded-full bg-primary opacity-40"></span>
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-xl">
                    <span className="material-symbols-outlined text-[22px]">directions_car</span>
                  </div>
                </div>
              </div>

              {/* Destination Hospital B Marker */}
              <div className="absolute left-[550px] top-[90px] pointer-events-auto flex flex-col items-center group">
                <div className="px-space-md py-1.5 rounded-lg bg-tertiary-container text-on-tertiary-container text-[12px] font-semibold mb-1 shadow-lg flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Hospital B (Target ED)
                </div>
                <div className="relative flex items-center justify-center">
                  <span className="animate-pulse absolute h-12 w-12 rounded-full bg-tertiary opacity-30"></span>
                  <div className="w-10 h-10 rounded-full bg-surface-elevated ring-2 ring-tertiary flex items-center justify-center text-tertiary shadow-xl">
                    <span className="material-symbols-outlined text-[20px]">local_hospital</span>
                  </div>
                </div>
              </div>

              {/* Secondary Alternate Facilities Waypoints */}
              <div className="absolute left-[240px] top-[170px] pointer-events-auto flex items-center gap-1 text-text-muted opacity-75 hover:opacity-100 transition-opacity">
                <div className="w-3 h-3 rounded-full bg-surface-container-high ring-1 ring-border-subtle"></div>
                <span className="text-[11px] bg-surface-elevated/90 px-1.5 py-0.5 rounded border border-border-subtle/40">
                  Hosp C (No ASV)
                </span>
              </div>

              <div className="absolute left-[440px] top-[430px] pointer-events-auto flex items-center gap-1 text-text-muted opacity-75 hover:opacity-100 transition-opacity">
                <div className="w-3 h-3 rounded-full bg-surface-container-high ring-1 ring-border-subtle"></div>
                <span className="text-[11px] bg-surface-elevated/90 px-1.5 py-0.5 rounded border border-border-subtle/40">
                  Hosp A (ICU Full)
                </span>
              </div>
            </div>

            {/* Bottom Floating Telemetry Sub-panel */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-space-sm bg-surface-elevated/95 backdrop-blur-md p-space-md rounded-xl shadow-lg border border-border-subtle/60">
              <div className="flex items-center gap-space-lg">
                <div>
                  <div className="text-[11px] text-text-muted uppercase font-medium">Distance Remaining</div>
                  <div className="text-[16px] font-semibold text-text-primary font-mono">
                    {incident.distanceRemainingKm} km
                  </div>
                </div>
                <div className="h-8 w-px bg-border-subtle"></div>
                <div>
                  <div className="text-[11px] text-text-muted uppercase font-medium">Traffic Index</div>
                  <div className="text-[16px] font-semibold text-tertiary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">traffic</span>
                    Clear (Flow Grade A)
                  </div>
                </div>
                <div className="h-8 w-px bg-border-subtle"></div>
                <div>
                  <div className="text-[11px] text-text-muted uppercase font-medium">Corridor Priority</div>
                  <div className="text-[16px] font-semibold text-secondary">Green Wave Active</div>
                </div>
              </div>

              <div className="flex items-center gap-space-xs">
                <button
                  onClick={() => showToast('GPS Re-centered', 'Centered view on ALS-17 active navigation lock', 'info')}
                  className="p-2 rounded-lg bg-surface-container hover:bg-surface-bright text-text-secondary hover:text-text-primary transition-colors border border-border-subtle/40"
                  title="Recenter Track"
                >
                  <span className="material-symbols-outlined text-[18px]">my_location</span>
                </button>
                <button
                  onClick={() => showToast('Viewport Fullscreen', 'Full-screen tactical overlay expanded', 'info')}
                  className="p-2 rounded-lg bg-surface-container hover:bg-surface-bright text-text-secondary hover:text-text-primary transition-colors border border-border-subtle/40"
                  title="Expand Viewport"
                >
                  <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Metric Cards Under Map */}
          <div className="grid grid-cols-3 gap-space-md">
            <div className="bg-surface-secondary p-space-md rounded-xl flex flex-col justify-between border border-border-subtle/40">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="text-[12px] font-medium text-text-muted">Time Since Bite</span>
                <span className="material-symbols-outlined text-text-muted text-[16px]">acute</span>
              </div>
              <div className="text-[18px] font-semibold text-text-primary font-mono">
                {timeSinceBite.minutes}m {timeSinceBite.seconds.toString().padStart(2, '0')}s
              </div>
              <div className="text-[11px] text-text-muted mt-1">Target Window: &lt; 90 min</div>
            </div>

            <div className="bg-surface-secondary p-space-md rounded-xl flex flex-col justify-between border border-border-subtle/40">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="text-[12px] font-medium text-text-muted">Coagulation Risk</span>
                <span className="material-symbols-outlined text-status-warning text-[16px]">warning</span>
              </div>
              <div className="text-[18px] font-semibold text-status-warning">WBCT20 Pending</div>
              <div className="text-[11px] text-text-muted mt-1">Kit pre-warmed on ALS-17</div>
            </div>

            <div className="bg-surface-secondary p-space-md rounded-xl flex flex-col justify-between border border-border-subtle/40">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="text-[12px] font-medium text-text-muted">Tourniquet Check</span>
                <span className="material-symbols-outlined text-tertiary text-[16px]">check_circle</span>
              </div>
              <div className="text-[18px] font-semibold text-tertiary">None (Compliant)</div>
              <div className="text-[11px] text-text-muted mt-1">Immobilization splint applied</div>
            </div>
          </div>
        </div>

        {/* Right Column: Clinical Care Pathway & Actions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <div className="bg-surface-secondary p-space-lg rounded-xl shadow-lg flex flex-col gap-space-lg border border-border-subtle/40">
            {/* Pathway Header */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold text-text-primary">Clinical Care Pathway</span>
                <span className="text-[11px] text-text-muted">Dynamic Routing Sequence • Protocol V3-RUSSELL</span>
              </div>
              <span className="px-space-sm py-1 rounded-full bg-primary/10 text-primary text-[12px] font-semibold font-mono">
                Stage 2 of 3
              </span>
            </div>

            {/* Vertical Flow Steps */}
            <div className="relative pl-6 flex flex-col gap-space-lg">
              <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-border-subtle"></div>

              {/* Stage 1 */}
              <div className="relative flex items-start gap-space-md">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-surface-elevated ring-2 ring-tertiary flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[12px]">check</span>
                </div>
                <div className="flex-1 bg-surface-elevated p-space-md rounded-xl border border-border-subtle/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-text-primary">Stage 1: Patient Incident</span>
                    <span className="text-[11px] text-text-muted font-mono">12:35 PM</span>
                  </div>
                  <p className="text-[13px] text-text-secondary mt-1">
                    Location confirmed at rubber estate grounds. Caller authenticated by Rapid Dispatch.
                  </p>
                  <div className="mt-space-xs flex items-center gap-space-sm text-text-muted text-[11px]">
                    <span className="font-mono">Coordinates: 10.1076° N, 76.3516° E</span>
                    <span>•</span>
                    <span className="text-tertiary font-medium">Dispatched 12:37 PM</span>
                  </div>
                </div>
              </div>

              {/* Stage 2 (Active) */}
              <div className="relative flex items-start gap-space-md">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-surface-container-lowest animate-pulse"></span>
                </div>
                <div className="flex-1 bg-surface-elevated p-space-md rounded-xl ring-1 ring-primary/40 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-text-primary">Stage 2: Ambulance #17</span>
                      <span className="px-space-xs py-0.5 rounded bg-primary/20 text-primary text-[10px] uppercase font-semibold">
                        Active Unit
                      </span>
                    </div>
                    <span className="text-[11px] text-tertiary font-mono font-semibold">Live</span>
                  </div>
                  <div className="grid grid-cols-2 gap-space-sm mt-space-sm text-[13px]">
                    <div className="bg-surface-container p-space-xs rounded flex flex-col border border-border-subtle/30">
                      <span className="text-[10px] text-text-muted uppercase">Paramedic Lead</span>
                      <span className="text-text-primary font-medium">{ambulance.paramedicLead}</span>
                    </div>
                    <div className="bg-surface-container p-space-xs rounded flex flex-col border border-border-subtle/30">
                      <span className="text-[10px] text-text-muted uppercase">ASV Onboard</span>
                      <span className="text-tertiary font-medium">{ambulance.asvOnboardVials} Vials Lyophilized</span>
                    </div>
                  </div>
                  <div className="mt-space-sm flex items-center justify-between text-[11px] text-text-secondary pt-space-xs">
                    <span>Speed: {ambulance.speedKmh} km/h</span>
                    <span>Distance to target: {ambulance.distanceToTargetKm} km</span>
                    <span className="text-primary font-semibold font-mono">ETA: {ambulance.etaMinutes} min</span>
                  </div>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="relative flex items-start gap-space-md">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-surface-elevated ring-1 ring-border-subtle flex items-center justify-center text-text-muted">
                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                </div>
                <div className="flex-1 bg-surface-elevated p-space-md rounded-xl opacity-90 border border-border-subtle/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-text-primary">Stage 3: Hospital B Emergency</span>
                    <span className="text-[11px] text-text-muted font-mono">Est. 13:13 PM</span>
                  </div>
                  <p className="text-[13px] text-text-secondary mt-1">
                    Designated Trauma Bay 2 prepped with hemodialysis standby & toxicologist team assigned.
                  </p>
                  <div className="mt-space-xs flex items-center gap-space-sm">
                    <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-tertiary/15 text-tertiary text-[11px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Bay 2 Locked
                    </span>
                    <span className="text-text-muted text-[11px]">Pre-notification acknowledged</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Facility Readiness & Freshness Box */}
            <div className="bg-surface-container p-space-md rounded-xl flex flex-col gap-space-sm border border-border-subtle/40">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-text-muted uppercase tracking-wider">
                  Facility Readiness & Freshness
                </span>
                <span className="text-[11px] text-text-muted">Hospital B Verification</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                <div className="bg-surface-secondary p-space-sm rounded-lg flex flex-col border border-border-subtle/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-text-muted">ASV Stock</span>
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  </div>
                  <span className="text-[13px] text-tertiary font-semibold mt-0.5">Available (28v)</span>
                  <span className="text-[10px] text-text-muted">Verified 12:42 PM</span>
                </div>

                <div className="bg-surface-secondary p-space-sm rounded-lg flex flex-col border border-border-subtle/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-text-muted">ICU Resv.</span>
                    <span className="w-2 h-2 rounded-full bg-status-warning"></span>
                  </div>
                  <span className="text-[13px] text-status-warning font-semibold mt-0.5">Limited (1 Bed)</span>
                  <span className="text-[10px] text-text-muted">Reserved SB-1042</span>
                </div>

                <div className="bg-surface-secondary p-space-sm rounded-lg flex flex-col border border-border-subtle/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-text-muted">Protocol</span>
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  </div>
                  <span className="text-[13px] text-tertiary font-semibold mt-0.5">Activated</span>
                  <span className="text-[10px] text-text-muted">Toxicology Lead In</span>
                </div>
              </div>
            </div>

            {/* Collapsible AI Rationale Drawer */}
            {isRationaleOpen && (
              <div className="bg-surface-elevated p-space-md rounded-xl border border-primary/30 flex flex-col gap-space-xs transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                    <span className="text-[13px] font-semibold">CarePath AI Decision Support Rationale</span>
                  </div>
                  <button
                    onClick={() => setIsRationaleOpen(false)}
                    className="text-text-muted hover:text-text-primary text-[18px] cursor-pointer"
                  >
                    ×
                  </button>
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  Hospital B was ranked higher than Hospital A (4 min closer) due to stock exhaustion of polyvalent
                  anti-snake venom (ASV) at Hospital A reported at 12:20 PM. Hospital B maintains 28 verified cold-chain
                  vials and an open pediatric/adult critical resuscitation bay with active mechanical ventilation.
                </p>
                <div className="flex items-center gap-space-sm pt-space-xs text-text-muted text-[11px] font-mono">
                  <span>Confidence Index: 98.4%</span>
                  <span>•</span>
                  <span>Routing Model: NeuroVasc-ER v2.4</span>
                </div>
              </div>
            )}

            {/* Quick Actions Strip */}
            <div className="flex flex-col gap-space-sm">
              <button
                onClick={() => setIsRationaleOpen(!isRationaleOpen)}
                className="w-full flex items-center justify-between px-space-md py-space-sm rounded-lg bg-surface-elevated hover:bg-surface-bright text-text-primary transition-colors text-left shadow-sm border border-border-subtle/50"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-secondary text-[18px]">auto_awesome</span>
                  <span className="text-[13px] font-medium">Why this pathway?</span>
                </div>
                <span className="material-symbols-outlined text-text-muted text-[18px]">
                  {isRationaleOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <button
                  id="handoff-btn"
                  onClick={handleTransmitHandoff}
                  disabled={isTransmittingHandoff}
                  className="flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary-container text-on-primary-container text-[13px] font-semibold hover:brightness-110 active:scale-[0.98] transition-all shadow-md cursor-pointer disabled:opacity-75"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isTransmittingHandoff ? 'animate-spin' : ''}`}>
                    {isTransmittingHandoff ? 'refresh' : 'send_to_mobile'}
                  </span>
                  <span>{isTransmittingHandoff ? 'Transmitting...' : 'Transmit Handoff'}</span>
                </button>

                <button
                  onClick={handleDirectEDLine}
                  className="flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-elevated text-text-primary text-[13px] font-semibold hover:bg-surface-bright active:scale-[0.98] transition-all shadow-sm border border-border-subtle/50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-tertiary">phone_in_talk</span>
                  <span>Direct ED Line</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
