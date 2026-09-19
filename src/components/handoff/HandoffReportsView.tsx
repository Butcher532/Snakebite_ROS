import React, { useState } from 'react';
import { useCarePath } from '../../context/CarePathContext';

export const HandoffReportsView: React.FC = () => {
  const { incident, events, downloadCsv, transmitHandoff, showToast } = useCarePath();
  const [selectedIncident, setSelectedIncident] = useState(incident.code);

  return (
    <div className="flex flex-col w-full p-space-lg gap-space-lg text-text-primary animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <h1 className="text-[24px] font-semibold text-text-primary tracking-tight">
            Handoff Transmissions & Audit Logs
          </h1>
          <p className="text-[13px] text-text-secondary mt-0.5">
            Immutable emergency logs, automated telemetry dispatches, and pre-arrival clinical handoff documentation.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => transmitHandoff()}
            className="px-space-md py-2 rounded-lg bg-primary-container hover:brightness-110 text-on-primary-container text-[13px] font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">send_to_mobile</span>
            Generate New Handoff
          </button>
          <button
            onClick={downloadCsv}
            className="px-space-md py-2 rounded-lg bg-surface-elevated hover:bg-surface-bright text-text-primary text-[13px] font-semibold flex items-center gap-1.5 shadow-sm border border-border-subtle transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Audit (.csv)
          </button>
        </div>
      </div>

      {/* Incident Dossier Summary Card */}
      <div className="bg-surface-secondary rounded-xl p-space-lg border border-border-subtle/50 shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-wrap items-center justify-between pb-space-sm border-b border-border-subtle gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-mono px-2 py-0.5 rounded bg-primary/15 text-primary font-semibold">
              INCIDENT RECORD
            </span>
            <span className="text-[16px] font-semibold text-text-primary">#{incident.code}</span>
            <span className="text-text-muted">•</span>
            <span className="text-[13px] text-text-secondary">{incident.species}</span>
          </div>
          <span className="text-[12px] text-tertiary flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            Telemetry Authenticated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md text-[13px]">
          <div className="p-space-sm bg-surface-elevated rounded-lg border border-border-subtle/30">
            <span className="text-[11px] text-text-muted uppercase block">Patient Geo Location</span>
            <span className="text-text-primary font-medium mt-0.5 block">{incident.geoCoordinates.locationName}</span>
            <span className="text-[11px] font-mono text-text-secondary">{incident.geoCoordinates.formatted.split('(')[0]}</span>
          </div>

          <div className="p-space-sm bg-surface-elevated rounded-lg border border-border-subtle/30">
            <span className="text-[11px] text-text-muted uppercase block">Bite Morphology</span>
            <span className="text-text-primary font-medium mt-0.5 block">{incident.biteLocation}</span>
            <span className="text-[11px] text-status-warning font-mono">{incident.swellingRate}</span>
          </div>

          <div className="p-space-sm bg-surface-elevated rounded-lg border border-border-subtle/30">
            <span className="text-[11px] text-text-muted uppercase block">Vitals at 12:49 PM</span>
            <span className="text-text-primary font-medium mt-0.5 block font-mono">
              BP {incident.vitals.bp} • HR {incident.vitals.hr}
            </span>
            <span className="text-[11px] text-tertiary font-mono">SpO₂ {incident.vitals.spo2}%</span>
          </div>

          <div className="p-space-sm bg-surface-elevated rounded-lg border border-border-subtle/30">
            <span className="text-[11px] text-text-muted uppercase block">Pre-Mix ASV Protocol</span>
            <span className="text-text-primary font-medium mt-0.5 block">10 Vials Lyophilized</span>
            <span className="text-[11px] text-tertiary">Zero Tourniquet Confirmed</span>
          </div>
        </div>
      </div>

      {/* Immutable Event Log Table */}
      <div className="bg-surface-secondary rounded-xl p-space-lg border border-border-subtle/50 shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
            <span className="text-[16px] font-semibold text-text-primary">Immutable Audit Event Trail</span>
          </div>
          <span className="text-[12px] text-text-muted font-mono">{events.length} records verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-border-subtle text-text-muted text-[11px] font-mono uppercase">
                <th className="pb-3 font-medium">Timestamp</th>
                <th className="pb-3 font-medium">Event & Telemetry Description</th>
                <th className="pb-3 font-medium">Tag / Category</th>
                <th className="pb-3 font-medium">Audit Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-surface-elevated/40 transition-colors">
                  <td className="py-3 font-mono text-text-secondary whitespace-nowrap text-[12px]">
                    {evt.timeFormatted}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-text-primary font-medium">{evt.title}</div>
                    <div className="text-text-muted text-[12px] mt-0.5">{evt.description}</div>
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono ${
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
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-tertiary text-[11px] font-mono">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
