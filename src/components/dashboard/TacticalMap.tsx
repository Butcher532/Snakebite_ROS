import React from 'react';
import { useCarePath } from '../../context/CarePathContext';

export const TacticalMap: React.FC = () => {
  const { incident, ambulance } = useCarePath();

  return (
    <div className="xl:col-span-6 bg-surface-container-lowest rounded-xl overflow-hidden relative min-h-[380px] flex flex-col justify-between shadow-inner border border-border-subtle/40">
      {/* Ambient grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#5b8cff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      ></div>

      {/* Live Map Header Telemetry */}
      <div className="relative z-10 p-space-md flex items-center justify-between bg-gradient-to-b from-surface-container-lowest to-transparent">
        <div className="flex items-center gap-space-sm bg-surface/80 backdrop-blur-md px-3 py-1 rounded-lg border border-border-subtle/30">
          <span className="material-symbols-outlined text-primary text-[16px]">navigation</span>
          <span className="text-[11px] text-text-secondary font-medium">PATIENT GEO:</span>
          <span className="text-[12px] text-text-primary font-mono">{incident.geoCoordinates.formatted}</span>
        </div>
        <div className="bg-surface/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-text-muted flex items-center gap-1 border border-border-subtle/30">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
          RT-GIS 5Hz
        </div>
      </div>

      {/* Tactical Route SVG Canvas */}
      <div className="relative w-full h-[250px] flex items-center justify-center p-space-lg">
        <svg
          className="w-full h-full max-w-lg select-none"
          fill="none"
          viewBox="0 0 540 240"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="routeGradient" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#FF5C6C" />
              <stop offset="45%" stopColor="#59D6F7" />
              <stop offset="100%" stopColor="#47DFA4" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base Topographic Contour Lines */}
          <path
            d="M20,190 Q120,130 240,160 T480,110"
            fill="none"
            stroke="#26313D"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <path
            d="M40,70 Q160,110 320,50 T520,80"
            fill="none"
            stroke="#26313D"
            strokeDasharray="2 4"
            strokeWidth="1"
          />

          {/* Active En-Route Pathway Track */}
          <path
            d="M80,180 C140,160 170,120 220,115 C280,110 340,150 450,70"
            fill="none"
            stroke="#59D6F7"
            strokeLinecap="round"
            strokeOpacity="0.2"
            strokeWidth="8"
          />
          <path
            className="animate-pulse"
            d="M80,180 C140,160 170,120 220,115 C280,110 340,150 450,70"
            fill="none"
            stroke="url(#routeGradient)"
            strokeDasharray="6 3"
            strokeLinecap="round"
            strokeWidth="3"
          />

          {/* Waypoint 1: Incident Origin (Aluva) */}
          <g transform="translate(80, 180)">
            <circle className="animate-ping" fill="#FF5C6C" fillOpacity="0.15" r="16" />
            <circle fill="#FF5C6C" fillOpacity="0.4" r="8" />
            <circle fill="#FF5C6C" filter="url(#glow)" r="4" />
            <text fill="#A8B3C2" fontFamily="Inter" fontSize="10" fontWeight="500" x="-35" y="24">
              Aluva Rural (0m)
            </text>
          </g>

          {/* Active Unit: Ambulance #17 */}
          <g transform="translate(220, 115)">
            <circle className="animate-pulse" fill="#59D6F7" fillOpacity="0.2" r="14" />
            <circle fill="#59D6F7" filter="url(#glow)" r="6" />
            <g transform="translate(-10, -28)">
              <rect fill="#161D27" fillOpacity="0.95" height="20" rx="4" width="88" stroke="#26313D" strokeWidth="0.5" />
              <text fill="#59D6F7" fontFamily="Inter" fontSize="10" fontWeight="600" x="6" y="14">
                AMB #17 • {ambulance.speedKmh} km/h
              </text>
            </g>
          </g>

          {/* Destination: Hospital B (Tertiary Care Center) */}
          <g transform="translate(450, 70)">
            <circle fill="#47DFA4" fillOpacity="0.15" r="18" />
            <circle fill="#47DFA4" fillOpacity="0.3" r="9" />
            <circle fill="#47DFA4" filter="url(#glow)" r="5" />
            <g transform="translate(-32, -34)">
              <rect fill="#1B2430" height="24" rx="6" width="104" stroke="#47DFA4" strokeOpacity="0.4" strokeWidth="1" />
              <text fill="#47DFA4" fontFamily="Inter" fontSize="10" fontWeight="700" x="8" y="16">
                HOSPITAL B (ETA {ambulance.etaMinutes}m)
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Real-Time Flight & Ground Telemetry Sub-strip */}
      <div className="relative z-10 p-space-md bg-surface-secondary/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-space-sm border-t border-border-subtle/50">
        <div className="flex items-center gap-space-md">
          <div>
            <span className="text-[11px] text-text-muted block font-medium">DISTANCE REMAINING</span>
            <span className="text-[13px] text-text-primary font-mono font-semibold">
              {incident.distanceRemainingKm} km
            </span>
          </div>
          <div className="w-px h-6 bg-border-subtle"></div>
          <div>
            <span className="text-[11px] text-text-muted block font-medium">TRAFFIC CONGESTION</span>
            <span className="text-[13px] text-tertiary font-medium">{incident.trafficCondition}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-text-secondary text-[12px]">
          <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
          <span>Route Lock Verified</span>
        </div>
      </div>
    </div>
  );
};
