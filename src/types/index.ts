export type NavigationTab =
  | 'operations-dashboard'
  | 'carepath-live'
  | 'replanning'
  | 'facility-directory'
  | 'handoff-reports';

export type IncidentStatus = 'critical' | 'stable' | 'diverting' | 'resolved';

export interface VitalsTelemetry {
  bp: string;
  hr: number;
  spo2: number;
  temperature?: string;
  respiratoryRate?: number;
  lastUpdated: string;
}

export interface Incident {
  id: string;
  code: string;
  species: string;
  commonName: string;
  tier: 'Tier 1 Mild' | 'Tier 2 Moderate' | 'Tier 3 Severe';
  status: IncidentStatus;
  reportedMinutesAgo: number;
  timeSinceBiteMinutes: number;
  biteLocation: string;
  snakeTaxon: string;
  swellingRate: string;
  wbct20Result: string;
  geoCoordinates: {
    lat: number;
    lng: number;
    formatted: string;
    locationName: string;
  };
  mandatedProtocol: string[];
  vitals: VitalsTelemetry;
  assignedAmbulanceId: string;
  targetFacilityId: string;
  distanceRemainingKm: number;
  trafficCondition: string;
  routeLockVerified: boolean;
  tourniquetCompliant: boolean;
  notes?: string;
}

export interface Facility {
  id: string;
  name: string;
  shortName: string;
  type: 'Tertiary Care Center' | 'District Medical Center' | 'Community Health Center' | 'Specialized Trauma';
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
  etaMinutes: number;
  asvStock: {
    availableVials: number;
    capacityVials: number;
    percent: number;
    verifiedTime: string;
    lotNumber?: string;
    status: 'in_stock' | 'limited' | 'stockout';
  };
  icuBeds: {
    available: number;
    total: number;
    reserved: number;
    status: 'ready' | 'limited' | 'full';
  };
  capabilities: {
    snakebiteTeamReady: boolean;
    wbct20StationOpen: boolean;
    nephrologyBackup: boolean;
    mechanicalVentilation: boolean;
    pediatricIcu: boolean;
  };
  coordinator: {
    name: string;
    role: string;
    phone: string;
  };
  address: string;
  status: 'normal' | 'congested' | 'divert' | 'offline';
}

export interface AmbulanceUnit {
  id: string;
  unitCode: string;
  type: 'ALS' | 'BLS';
  callSign: string;
  speedKmh: number;
  paramedicLead: string;
  asvOnboardVials: number;
  asvType: string;
  distanceToTargetKm: number;
  etaMinutes: number;
  telemetryActive: boolean;
  currentLocation: {
    lat: number;
    lng: number;
    description: string;
  };
  headingDeg: number;
}

export interface PathwayStage {
  stageNumber: number;
  title: string;
  subtitle: string;
  time: string;
  status: 'completed' | 'active' | 'pending';
  details?: Record<string, string>;
  notes?: string;
  badge?: string;
}

export interface ClinicalPathway {
  id: string;
  incidentId: string;
  protocolName: string;
  currentStageNumber: number;
  totalStages: number;
  stages: PathwayStage[];
  whyFactors: {
    title: string;
    description: string;
    icon: string;
    verified: boolean;
  }[];
  decisionTreeVersion: string;
}

export interface EventStreamItem {
  id: string;
  title: string;
  description: string;
  badgeText: string;
  badgeType: 'success' | 'primary' | 'warning' | 'critical' | 'neutral';
  icon: string;
  timeFormatted: string;
  timeAgo: string;
  lotNumber?: string;
}

export interface ReplanningState {
  isInvalidated: boolean;
  invalidatedReason: string;
  invalidatedTimestamp: string;
  elapsedReplanTime: string;
  previousFacilityId: string;
  recommendedFacilityId: string;
  confidenceScore: number;
  confirmed: boolean;
  dispatchesNotified: boolean;
  provenanceOpen: boolean;
}

export interface SystemKPIs {
  activeIncidents: number;
  criticalIncidents: number;
  stableIncidents: number;
  replanningInProgress: number;
  facilitiesReady: number;
  facilitiesTotal: number;
  facilitiesReadyPercent: number;
  transportUnitsEnRoute: number;
  medianEtaMinutes: number;
  lastSyncTime: string;
}
