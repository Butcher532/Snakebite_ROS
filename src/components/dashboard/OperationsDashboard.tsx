import React from 'react';
import { useCarePath } from '../../context/CarePathContext';
import { TacticalMap } from './TacticalMap';
import { APP_CONFIG } from '../../config/appConfig';

export const OperationsDashboard: React.FC = () => {
  const {
    incident,
    ambulance,
    facilities,
    events,
    pathway,
    setIsWhyModalOpen,
    setIsHandoffModalOpen,
    downloadCsv,
    showToast,
  } = useCarePath();

  const hospitalB = facilities.find((f) => f.id === 'hosp-b') || facilities[0];

  const handleContactER = () => {
    showToast(
      'Direct ED Line Connected',
      `Connecting to Dr. Mathew (${hospitalB.coordinator.phone}). Trauma Bay 2 radio open.`,
      'info',
    );
  };

  return (
    <div className="flex flex-col w-full px-space-lg py-space-md gap-space-lg text-text-primary animate-fade-in">
      {/* Top KPI Summary Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Active Incidents */}
        <div className="bg-surface-secondary rounded-xl p-space-md flex flex-col justify-between shadow-sm relative overflow-hidden border border-border-subtle/50">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-text-muted uppercase tracking-wider">Active Incidents</span>
            <span className="material-symbols-outlined text-primary text-[18px]">emergency</span>
          </div>
          <div className="flex items-baseline gap-space-sm mt-space-sm">
            <span className="text-[32px] font-semibold text-text-primary leading-tight">
              {APP_CONFIG.kpis.activeIncidents}
            </span>
            <div className="flex items-center gap-space-xs text-[12px] text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-status-critical animate-pulse"></span>
              <span className="text-status-critical font-medium">1 Critical</span>
              <span className="text-text-muted">•</span>
              <span>11 Stable</span>
            </div>
          </div>
          <div className="mt-space-sm flex items-center justify-between text-[11px] text-text-muted">
            <span>State Health Mission Feed</span>
            <span>Synced 12s ago</span>
          </div>
        </div>

        {/* Replanning in Progress */}
        <div className="bg-surface-secondary rounded-xl p-space-md flex flex-col justify-between shadow-sm relative overflow-hidden border border-border-subtle/50">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-text-muted uppercase tracking-wider">
              Replanning in Progress
            </span>
            <span className="material-symbols-outlined text-status-warning text-[18px]">alt_route</span>
          </div>
          <div className="flex items-baseline gap-space-sm mt-space-sm">
            <span className="text-[32px] font-semibold text-text-primary leading-tight">
              {APP_CONFIG.kpis.replanningInProgress}
            </span>
            <div className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-status-warning/10 text-status-warning text-[12px]">
              <span className="w-1.5 h-1.5 rounded-full bg-status-warning animate-ping"></span>
              <span>ASV Re-routing</span>
            </div>
          </div>
          <div className="mt-space-sm flex items-center justify-between text-[11px] text-text-muted">
            <span>Autonomous Protocol V2</span>
            <span>Optimization active</span>
          </div>
        </div>

        {/* Facilities Ready */}
        <div className="bg-surface-secondary rounded-xl p-space-md flex flex-col justify-between shadow-sm relative overflow-hidden border border-border-subtle/50">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-text-muted uppercase tracking-wider">Facilities Ready</span>
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
          </div>
          <div className="flex items-baseline gap-space-sm mt-space-sm">
            <span className="text-[32px] font-semibold text-text-primary leading-tight">
              {APP_CONFIG.kpis.facilitiesReady}
            </span>
            <span className="text-[16px] text-text-muted font-medium">/ {APP_CONFIG.kpis.facilitiesTotal}</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-tertiary/15 text-tertiary text-[12px] font-medium font-mono">
              {APP_CONFIG.kpis.facilitiesReadyPercent}%
            </span>
          </div>
          <div className="mt-space-sm flex items-center justify-between text-[11px] text-text-muted">
            <span>Cold Chain Polling Hub</span>
            <span className="text-tertiary flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>Normal
            </span>
          </div>
        </div>

        {/* Transport Units En Route */}
        <div className="bg-surface-secondary rounded-xl p-space-md flex flex-col justify-between shadow-sm relative overflow-hidden border border-border-subtle/50">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-text-muted uppercase tracking-wider">
              Transport Units En Route
            </span>
            <span className="material-symbols-outlined text-secondary text-[18px]">ambulance</span>
          </div>
          <div className="flex items-baseline gap-space-sm mt-space-sm">
            <span className="text-[32px] font-semibold text-text-primary leading-tight">
              {APP_CONFIG.kpis.transportUnitsEnRoute}
            </span>
            <span className="text-[12px] text-text-secondary font-medium">Median ETA 18m</span>
          </div>
          <div className="mt-space-sm flex items-center justify-between text-[11px] text-text-muted">
            <span>Kerala EMS Mesh Network</span>
            <span>All Telemetry Active</span>
          </div>
        </div>
      </section>

      {/* Main Incident Command Console (Incident SB-1042) */}
      <section className="bg-surface rounded-xl p-space-lg flex flex-col gap-space-lg shadow-md border border-border-subtle/60 relative">
        {/* Header Meta Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-wrap items-center gap-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-status-critical animate-ping"></span>
              <h2 className="text-[24px] font-semibold text-text-primary tracking-tight">
                Active Incident {incident.code}
              </h2>
            </div>
            <div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-status-critical/15 text-status-critical text-[12px] font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              SUSPECTED SNAKEBITE • REPORTED {incident.reportedMinutesAgo} MIN AGO
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-elevated text-text-secondary text-[12px] border border-border-subtle/50">
              <span className="w-1.5 h-1.5 rounded-full bg-status-warning"></span>
              {incident.species}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-space-sm">
            <button
              id="whyPathwayBtn"
              onClick={() => setIsWhyModalOpen(true)}
              className="px-space-md py-2 rounded-lg bg-surface-elevated hover:bg-surface-bright text-text-primary text-[13px] font-medium transition-all flex items-center gap-1.5 shadow-sm border border-border-subtle/60 active:scale-[0.98]"
              type="button"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
              Why this pathway?
            </button>
            <button
              id="viewHandoffBtn"
              onClick={() => setIsHandoffModalOpen(true)}
              className="px-space-md py-2 rounded-lg bg-primary-container hover:brightness-110 text-on-primary-container text-[13px] font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
              View Pre-Arrival Handoff
            </button>
          </div>
        </div>

        {/* 3-Column Interactive Layout: Map / Timeline / Facility Readiness */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
          {/* Luminous Tactical Map Canvas (6 cols) */}
          <TacticalMap />

          {/* Center-Right: Pathway Timeline (3 cols) */}
          <div className="xl:col-span-3 bg-surface-secondary rounded-xl p-space-lg flex flex-col justify-between shadow-sm border border-border-subtle/40">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <span className="text-[16px] font-semibold text-text-primary">Pathway Timeline</span>
                <span className="text-[11px] text-primary px-2 py-0.5 rounded bg-primary/10 font-mono font-semibold">
                  STAGE {pathway.currentStageNumber} OF {pathway.totalStages}
                </span>
              </div>

              <div className="relative pl-6 space-y-space-lg">
                {/* Timeline Vertical Spine */}
                <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-border-subtle"></div>

                {/* Node 1: Incident Location */}
                <div className="relative flex flex-col">
                  <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                  </span>
                  <span className="text-[13px] font-medium text-text-primary">Patient Incident Ground</span>
                  <span className="text-[13px] text-text-secondary">Near Aluva, Kerala</span>
                  <span className="text-[11px] text-tertiary mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">done</span> Picked up 12:44 PM
                  </span>
                </div>

                {/* Node 2: In-Transit (Active) */}
                <div className="relative flex flex-col">
                  <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-text-primary">Ambulance #17 (ALS)</span>
                    <span className="px-1.5 py-0.5 rounded bg-secondary/15 text-secondary text-[11px] font-semibold font-mono">
                      ETA {ambulance.etaMinutes}m
                    </span>
                  </div>
                  <span className="text-[13px] text-text-secondary">Paramedic Unit Active</span>
                  <span className="text-[11px] text-text-muted mt-0.5">
                    Vitals streaming • Pressure immobilization verified
                  </span>
                </div>

                {/* Node 3: Target Hospital */}
                <div className="relative flex flex-col">
                  <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-text-primary">{hospitalB.name.split(' ')[0]} {hospitalB.name.split(' ')[1]} (Tertiary)</span>
                    <span className="material-symbols-outlined text-tertiary text-[16px]">verified</span>
                  </div>
                  <span className="text-[13px] text-text-secondary">Destination Confirmed</span>
                  <span className="text-[11px] text-text-muted mt-0.5">Expected arrival 01:13 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-space-md mt-space-md border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
              <span>Protocol: Golden Hour Tier-1</span>
              <span className="text-text-secondary font-mono">ID: PTW-8820</span>
            </div>
          </div>

          {/* Right Column: Receiving Facility Readiness: Hospital B (3 cols) */}
          <div className="xl:col-span-3 bg-surface-secondary rounded-xl p-space-lg flex flex-col justify-between shadow-sm border border-border-subtle/40">
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-text-muted uppercase tracking-wider">
                    Receiving Facility
                  </span>
                  <span className="text-[16px] font-semibold text-text-primary">{hospitalB.name}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-tertiary/15 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[18px]">local_hospital</span>
                </div>
              </div>

              {/* ASV Stock Status: Key Decision Factor */}
              <div className="bg-surface-elevated p-space-md rounded-lg flex flex-col gap-1.5 border border-border-subtle/40">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-text-secondary">Polyvalent ASV Vials</span>
                  <span className="inline-flex items-center gap-1 text-tertiary text-[12px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> {hospitalB.asvStock.availableVials} in Stock
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-tertiary h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${hospitalB.asvStock.percent}%` }}
                  ></div>
                </div>
                <span className="text-[11px] text-text-muted mt-0.5">{hospitalB.asvStock.verifiedTime}</span>
              </div>

              {/* Readiness Matrix Checklist */}
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-elevated/50 border border-border-subtle/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">check_box</span>
                    <span className="text-[13px] text-text-primary">Snakebite Team</span>
                  </div>
                  <span className="text-[12px] text-tertiary font-medium">On-Call Ready</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-elevated/50 border border-border-subtle/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-status-warning">
                      indeterminate_check_box
                    </span>
                    <span className="text-[13px] text-text-primary">ICU Bed Availability</span>
                  </div>
                  <span className="text-[12px] text-status-warning font-medium">Limited (2 Resv)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-elevated/50 border border-border-subtle/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">check_box</span>
                    <span className="text-[13px] text-text-primary">Whole Blood Clotting Test</span>
                  </div>
                  <span className="text-[12px] text-tertiary font-medium">20WBCT Station Open</span>
                </div>
              </div>
            </div>

            <div className="pt-space-sm border-t border-border-subtle flex items-center justify-between">
              <span className="text-[11px] text-text-muted">Coordinator: {hospitalB.coordinator.name}</span>
              <button
                onClick={handleContactER}
                className="text-primary hover:underline text-[12px] font-medium flex items-center gap-0.5 transition-all"
                type="button"
              >
                Contact ER <span className="material-symbols-outlined text-[14px]">call</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Workspace: Real-Time Event Telemetry Stream & Patient Clinical Status */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Real-time chronological activity stream (8 cols) */}
        <div className="lg:col-span-8 bg-surface-secondary rounded-xl p-space-lg flex flex-col justify-between shadow-sm border border-border-subtle/40">
          <div>
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">dynamic_feed</span>
                <span className="text-[16px] font-semibold text-text-primary">Live Operations Event Stream</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span className="text-[11px] text-text-muted uppercase tracking-wider font-mono">
                  Realtime Telemetry Active
                </span>
              </div>
            </div>

            <div className="space-y-space-sm max-h-[340px] overflow-y-auto pr-1">
              {events.slice(0, 4).map((evt) => (
                <div
                  key={evt.id}
                  className="p-space-md rounded-lg bg-surface-elevated flex items-start justify-between gap-space-md hover:bg-surface-bright transition-colors border border-border-subtle/30"
                >
                  <div className="flex items-start gap-space-md">
                    <div
                      className={`w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                        evt.badgeType === 'success'
                          ? 'bg-tertiary/15 text-tertiary'
                          : evt.badgeType === 'primary'
                          ? 'bg-primary/15 text-primary'
                          : evt.badgeType === 'critical'
                          ? 'bg-status-critical/15 text-status-critical'
                          : 'bg-surface-secondary text-text-secondary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{evt.icon}</span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-text-primary">{evt.title}</span>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.2 rounded text-[11px] font-mono ${
                            evt.badgeType === 'success'
                              ? 'text-tertiary bg-tertiary/10'
                              : evt.badgeType === 'primary'
                              ? 'text-primary bg-primary/10'
                              : evt.badgeType === 'critical'
                              ? 'text-status-critical bg-status-critical/10'
                              : 'text-text-secondary bg-surface-container-high'
                          }`}
                        >
                          {evt.badgeText}
                        </span>
                      </div>
                      <span className="text-[13px] text-text-secondary mt-0.5 leading-snug">{evt.description}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[13px] text-text-primary font-mono font-medium">{evt.timeFormatted}</span>
                    <span className="text-[11px] text-text-muted block">{evt.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-space-md pt-space-sm border-t border-border-subtle flex items-center justify-between text-text-muted text-[11px]">
            <span>Logged automatically by CarePath Audit Engine</span>
            <button
              onClick={downloadCsv}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              Download Immutable Incident Log (.csv)
            </button>
          </div>
        </div>

        {/* Quick Clinical Telemetry & Verification Card (4 cols) */}
        <div className="lg:col-span-4 bg-surface-secondary rounded-xl p-space-lg flex flex-col justify-between shadow-sm border border-border-subtle/40">
          <div className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-semibold text-text-primary">Patient Clinical Status</span>
              <span className="px-2 py-0.5 rounded bg-status-critical/15 text-status-critical text-[12px] font-semibold">
                {incident.tier}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-space-sm">
              <div className="p-space-sm bg-surface-elevated rounded-lg flex flex-col border border-border-subtle/30">
                <span className="text-[11px] text-text-muted uppercase">BITE LOCATION</span>
                <span className="text-[13px] text-text-primary font-semibold mt-0.5">{incident.biteLocation}</span>
              </div>
              <div className="p-space-sm bg-surface-elevated rounded-lg flex flex-col border border-border-subtle/30">
                <span className="text-[11px] text-text-muted uppercase">SNAKE TAXON</span>
                <span className="text-[13px] text-text-primary font-semibold mt-0.5">{incident.snakeTaxon}</span>
              </div>
              <div className="p-space-sm bg-surface-elevated rounded-lg flex flex-col border border-border-subtle/30">
                <span className="text-[11px] text-text-muted uppercase">SWELLING RATE</span>
                <span className="text-[13px] text-status-warning font-semibold mt-0.5 font-mono">{incident.swellingRate}</span>
              </div>
              <div className="p-space-sm bg-surface-elevated rounded-lg flex flex-col border border-border-subtle/30">
                <span className="text-[11px] text-text-muted uppercase">20WBCT RESULT</span>
                <span className="text-[13px] text-text-primary font-semibold mt-0.5">{incident.wbct20Result}</span>
              </div>
            </div>

            {/* Clinical Guidelines & Protocols */}
            <div className="p-space-md rounded-lg bg-surface-elevated flex flex-col gap-1.5 border border-border-subtle/30">
              <span className="text-[12px] text-text-primary font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">assignment</span>
                Mandated Care Protocol
              </span>
              <ul className="text-[13px] text-text-secondary space-y-1 pl-4 list-disc marker:text-primary leading-snug">
                {incident.mandatedProtocol.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-space-sm border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
            <span>Verified by Medical Command Protocol</span>
            <span className="text-tertiary font-medium">Synced with EMS Unit #17</span>
          </div>
        </div>
      </section>
    </div>
  );
};
