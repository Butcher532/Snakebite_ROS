/**
 * @license CarePath Operations Command Configuration
 * Decentralized configuration definitions for easy calibration and modular testing.
 */

export const APP_CONFIG = {
  system: {
    name: 'CarePath',
    subTitle: 'Operations Command',
    version: 'Telemetry Hub v4.2',
    syncStatus: 'SYNC',
    currentUser: {
      name: 'Dr. Elena Vance',
      role: 'Lead Trauma Coordinator',
      badge: 'ER-DIR',
      avatarUrl: '',
    },
    defaultTime: '12:49 PM',
    refreshIntervalMs: 4000,
    voiceIntakeEnabled: true,
  },

  clinicalProtocols: {
    snakebiteGoldenHourMinutes: 90,
    maxPermissibleTransitMinutes: 120,
    swellingRateCriticalThresholdCmPerHour: 3.0,
    targetASVReservePerFacility: 10,
    standardPolyvalentDoseVials: 10,
    recheckIntervalMinutes20WBCT: 30,
    recommendedSpeciesProtocol: 'V3-RUSSELL (Vipera berus / Daboia russelii)',
  },

  mapConfig: {
    center: {
      lat: 10.1076,
      lng: 76.3516,
    },
    defaultZoom: 12,
    patientGeoString: '10.1076° N, 76.3516° E (Near Aluva, Kerala)',
    mapBackgroundUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_7Q1sQMrVE21OWjqGUDke7nsVXoFVE4jefqx0nsm95ar8BYGzuCoIuUSSJZyS78nUFF65FMyIU_u6sMTjarVirZTSFITdvZXIm7Bjo3RIa2WWEh4hN_k6OB1OFgLMRdS4qkFEwqltAk60dPGu-6_6-lNI10UqN7h58hnp7_KFA-b_IlZ-vcTf39VPA9ISDujQGGiDjVlY6Sd39blVPiJlrFANaGh9sh6fRvUphoen_cYT1yZdzQ',
    gisFrequency: 'RT-GIS 5Hz',
  },

  trafficBypass: {
    corridorName: 'NH-544 (Kochi-Salem Corridor)',
    defaultStatus: 'Minimal (NH-544 Clear)',
    routeLockVerified: true,
    corridorPriority: 'Green Wave Active',
  },

  kpis: {
    activeIncidents: 12,
    criticalIncidents: 1,
    stableIncidents: 11,
    replanningInProgress: 3,
    facilitiesReady: 43,
    facilitiesTotal: 48,
    facilitiesReadyPercent: 89.5,
    transportUnitsEnRoute: 9,
    medianEtaMinutes: 18,
    lastSyncTime: 'Synced 12s ago',
  },
};
