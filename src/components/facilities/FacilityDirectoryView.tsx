import React, { useState } from 'react';
import { useCarePath } from '../../context/CarePathContext';
import { Facility } from '../../types';

export const FacilityDirectoryView: React.FC = () => {
  const { facilities, showToast } = useCarePath();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_stock' | 'stockout'>('all');

  const filteredFacilities = facilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'in_stock' && f.asvStock.status === 'in_stock') ||
      (filterStatus === 'stockout' && f.asvStock.status === 'stockout');
    return matchesSearch && matchesStatus;
  });

  const handleCallFacility = (f: Facility) => {
    showToast('Facility Direct Line Connected', `Connected to ${f.coordinator.name} (${f.coordinator.phone})`, 'info');
  };

  return (
    <div className="flex flex-col w-full p-space-lg gap-space-lg text-text-primary animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <h1 className="text-[24px] font-semibold text-text-primary tracking-tight">Regional Facility Directory</h1>
          <p className="text-[13px] text-text-secondary mt-0.5">
            Real-time cold chain ASV stock, ICU resuscitation bed status, and verified toxicology response capabilities.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2 text-[18px] text-text-muted">search</span>
            <input
              type="text"
              placeholder="Search facilities or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface-elevated border border-border-subtle pl-9 pr-3 py-1.5 rounded-lg text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary w-64"
            />
          </div>

          <div className="flex items-center p-0.5 bg-surface-elevated rounded-lg border border-border-subtle">
            {(['all', 'in_stock', 'stockout'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded text-[12px] font-medium capitalize transition-colors ${
                  filterStatus === status
                    ? 'bg-surface-container text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {status === 'in_stock' ? 'ASV In Stock' : status === 'stockout' ? 'Stockouts' : 'All Facilities'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-lg">
        {filteredFacilities.map((fac) => {
          const isStockout = fac.asvStock.status === 'stockout';
          return (
            <div
              key={fac.id}
              className={`rounded-xl p-space-lg flex flex-col justify-between shadow-sm border transition-all ${
                isStockout
                  ? 'bg-surface-secondary/60 border-status-critical/30 opacity-90'
                  : 'bg-surface-secondary border-border-subtle/50 hover:border-border-subtle'
              }`}
            >
              <div className="space-y-space-md">
                <div className="flex items-start justify-between gap-space-sm">
                  <div>
                    <span className="text-[11px] font-mono text-primary uppercase font-semibold tracking-wider">
                      {fac.type}
                    </span>
                    <h3 className="text-[16px] font-semibold text-text-primary mt-0.5">{fac.name}</h3>
                    <p className="text-[12px] text-text-muted truncate mt-0.5">{fac.address}</p>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isStockout ? 'bg-status-critical/15 text-status-critical' : 'bg-tertiary/15 text-tertiary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isStockout ? 'block' : 'local_hospital'}
                    </span>
                  </div>
                </div>

                {/* ASV Stock indicator */}
                <div className="bg-surface-elevated p-space-sm rounded-lg border border-border-subtle/30 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-text-secondary">Polyvalent ASV Reserve</span>
                    <span
                      className={`font-semibold font-mono flex items-center gap-1 ${
                        isStockout ? 'text-status-critical' : 'text-tertiary'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isStockout ? 'bg-status-critical' : 'bg-tertiary'
                        }`}
                      ></span>
                      {isStockout ? '0 Vials (Exhausted)' : `${fac.asvStock.availableVials} Vials in Stock`}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        isStockout ? 'bg-status-critical' : 'bg-tertiary'
                      }`}
                      style={{ width: `${Math.max(fac.asvStock.percent, 3)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-text-muted">{fac.asvStock.verifiedTime}</span>
                </div>

                {/* Capabilities matrix */}
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-surface-elevated/60 text-text-primary">
                    <span
                      className={`material-symbols-outlined text-[15px] ${
                        fac.capabilities.snakebiteTeamReady ? 'text-tertiary' : 'text-status-warning'
                      }`}
                    >
                      {fac.capabilities.snakebiteTeamReady ? 'check_circle' : 'cancel'}
                    </span>
                    <span>Tox Team On-Call</span>
                  </div>

                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-surface-elevated/60 text-text-primary">
                    <span
                      className={`material-symbols-outlined text-[15px] ${
                        fac.capabilities.wbct20StationOpen ? 'text-tertiary' : 'text-status-warning'
                      }`}
                    >
                      {fac.capabilities.wbct20StationOpen ? 'check_circle' : 'cancel'}
                    </span>
                    <span>20WBCT Clotting</span>
                  </div>

                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-surface-elevated/60 text-text-primary">
                    <span
                      className={`material-symbols-outlined text-[15px] ${
                        fac.capabilities.nephrologyBackup ? 'text-tertiary' : 'text-text-muted'
                      }`}
                    >
                      {fac.capabilities.nephrologyBackup ? 'check_circle' : 'remove_circle_outline'}
                    </span>
                    <span>Hemodialysis</span>
                  </div>

                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-surface-elevated/60 text-text-primary">
                    <span
                      className={`material-symbols-outlined text-[15px] ${
                        fac.icuBeds.available > 0 ? 'text-tertiary' : 'text-status-critical'
                      }`}
                    >
                      {fac.icuBeds.available > 0 ? 'bed' : 'no_crash'}
                    </span>
                    <span>{fac.icuBeds.available} ICU Beds Free</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-space-md mt-space-md border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
                <div>
                  <span>Contact: </span>
                  <span className="text-text-primary font-medium">{fac.coordinator.name}</span>
                </div>
                <button
                  onClick={() => handleCallFacility(fac)}
                  className="px-2.5 py-1 rounded bg-surface-elevated hover:bg-surface-bright text-primary hover:text-text-primary text-[12px] font-medium flex items-center gap-1 transition-colors border border-border-subtle/50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  Direct Call
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
