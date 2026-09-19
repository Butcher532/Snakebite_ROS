import React, { useState } from 'react';
import { useCarePath } from '../../context/CarePathContext';

export const PreArrivalHandoffModal: React.FC = () => {
  const { isHandoffModalOpen, setIsHandoffModalOpen, incident, ambulance, facilities, transmitHandoff } = useCarePath();
  const [isTransmitting, setIsTransmitting] = useState(false);

  if (!isHandoffModalOpen) return null;

  const targetFacility = facilities.find((f) => f.id === incident.targetFacilityId) || facilities[0];

  const handleTransmit = async () => {
    setIsTransmitting(true);
    await new Promise((res) => setTimeout(res, 800));
    await transmitHandoff();
    setIsTransmitting(false);
    setIsHandoffModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-canvas-base/80 backdrop-blur-md"
      onClick={() => setIsHandoffModalOpen(false)}
    >
      <div
        className="bg-surface-elevated border border-border-subtle max-w-2xl w-full rounded-xl p-space-lg flex flex-col gap-space-lg shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">clinical_notes</span>
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-text-primary">
                Emergency Pre-Arrival Handoff Package
              </h3>
              <span className="text-[11px] text-text-muted font-mono">
                Incident #{incident.code} • Dispatched via State EMS Mesh
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsHandoffModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-surface hover:bg-surface-bright text-text-secondary flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-space-md max-h-[60vh] overflow-y-auto pr-1">
          {/* Patient & Transport Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
            <div className="p-space-sm bg-surface rounded-lg">
              <span className="text-[11px] text-text-muted uppercase">Target ED Center</span>
              <div className="text-[13px] font-semibold text-text-primary mt-0.5">{targetFacility.shortName}</div>
              <span className="text-[11px] text-tertiary">Bay 2 Reserved</span>
            </div>
            <div className="p-space-sm bg-surface rounded-lg">
              <span className="text-[11px] text-text-muted uppercase">En-Route ETA</span>
              <div className="text-[13px] font-semibold text-text-primary mt-0.5">{ambulance.etaMinutes} min remaining</div>
              <span className="text-[11px] text-text-secondary">Speed: {ambulance.speedKmh} km/h</span>
            </div>
            <div className="p-space-sm bg-surface rounded-lg">
              <span className="text-[11px] text-text-muted uppercase">Envenomation Risk</span>
              <div className="text-[13px] font-semibold text-status-warning mt-0.5">{incident.tier}</div>
              <span className="text-[11px] text-text-secondary">{incident.species}</span>
            </div>
          </div>

          {/* Vitals Summary Strip */}
          <div className="p-space-sm bg-surface rounded-lg flex items-center justify-around text-center">
            <div>
              <span className="text-[10px] text-text-muted uppercase block">Blood Pressure</span>
              <span className="text-[14px] font-mono font-semibold text-text-primary">{incident.vitals.bp}</span>
            </div>
            <div className="h-6 w-px bg-border-subtle"></div>
            <div>
              <span className="text-[10px] text-text-muted uppercase block">Heart Rate</span>
              <span className="text-[14px] font-mono font-semibold text-text-primary">{incident.vitals.hr} bpm</span>
            </div>
            <div className="h-6 w-px bg-border-subtle"></div>
            <div>
              <span className="text-[10px] text-text-muted uppercase block">SpO₂</span>
              <span className="text-[14px] font-mono font-semibold text-tertiary">{incident.vitals.spo2}%</span>
            </div>
            <div className="h-6 w-px bg-border-subtle"></div>
            <div>
              <span className="text-[10px] text-text-muted uppercase block">Swelling Rate</span>
              <span className="text-[14px] font-mono font-semibold text-status-warning">{incident.swellingRate}</span>
            </div>
          </div>

          {/* Clinical Mandates Checklist */}
          <div className="p-space-md rounded-lg bg-surface flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
              Care Protocol Verified Actions
            </span>
            <ul className="text-[13px] text-text-secondary space-y-1 pl-5 list-disc marker:text-primary">
              {incident.mandatedProtocol.map((protocol, i) => (
                <li key={i}>{protocol}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border-subtle pt-space-sm">
          <span className="text-[11px] text-text-muted">
            Coordinator Sign-off: Dr. Elena Vance
          </span>
          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => setIsHandoffModalOpen(false)}
              className="px-space-md py-2 rounded-lg bg-surface hover:bg-surface-bright text-text-primary text-[13px] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleTransmit}
              disabled={isTransmitting}
              className="px-space-md py-2 rounded-lg bg-primary-container hover:brightness-110 text-on-primary-container text-[13px] font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span className={`material-symbols-outlined text-[18px] ${isTransmitting ? 'animate-spin' : ''}`}>
                {isTransmitting ? 'refresh' : 'send_to_mobile'}
              </span>
              <span>{isTransmitting ? 'Transmitting Package...' : 'Transmit Handoff Package'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
