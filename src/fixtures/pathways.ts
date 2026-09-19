import { AmbulanceUnit, ClinicalPathway } from '../types';

export const AMBULANCE_17: AmbulanceUnit = {
  id: 'amb-17',
  unitCode: 'Unit ALS-17',
  type: 'ALS',
  callSign: 'Ambulance #17',
  speedKmh: 62,
  paramedicLead: 'Capt. R. Thomas',
  asvOnboardVials: 10,
  asvType: 'Lyophilized Polyvalent ASV (10 Vials)',
  distanceToTargetKm: 18.4,
  etaMinutes: 24,
  telemetryActive: true,
  currentLocation: {
    lat: 10.082,
    lng: 76.342,
    description: 'En-route NH-544 near Kalamassery bypass',
  },
  headingDeg: 215,
};

export const CLINICAL_PATHWAY_SB_1042: ClinicalPathway = {
  id: 'ptw-8820',
  incidentId: 'sb-1042',
  protocolName: 'Golden Hour Tier-1 • Protocol V3-RUSSELL',
  currentStageNumber: 2,
  totalStages: 3,
  stages: [
    {
      stageNumber: 1,
      title: 'Stage 1: Patient Incident',
      subtitle: 'Patient Incident Ground',
      time: '12:35 PM',
      status: 'completed',
      details: {
        location: 'Near Aluva, Kerala (Rubber estate grounds)',
        coordinates: '10.1076° N, 76.3516° E',
        dispatchedTime: '12:37 PM',
        callerAuth: 'Rapid Dispatch Authenticated',
      },
      notes: 'Picked up 12:44 PM • Zero tourniquet compliance verified',
      badge: 'Completed',
    },
    {
      stageNumber: 2,
      title: 'Stage 2: Ambulance #17 (ALS)',
      subtitle: 'Paramedic Unit Active',
      time: '12:44 PM - Present',
      status: 'active',
      details: {
        paramedicLead: 'Capt. R. Thomas',
        asvOnboard: '10 Vials Lyophilized Polyvalent',
        speed: '62 km/h',
        distance: '18.4 km',
        eta: '24 min (13:13 Local)',
      },
      notes: 'Vitals streaming • Pressure immobilization verified • WBCT20 kit pre-warmed',
      badge: 'Active Unit (Live)',
    },
    {
      stageNumber: 3,
      title: 'Stage 3: Hospital B Emergency',
      subtitle: 'Destination Confirmed (Tertiary Care Center)',
      time: 'Est. 13:13 PM',
      status: 'pending',
      details: {
        facility: 'Hospital B Medical Center (St. Jude Regional)',
        bay: 'Designated Trauma Bay 2 prepped',
        specialties: 'Hemodialysis standby & toxicologist team assigned',
        status: 'Bay 2 Locked',
      },
      notes: 'Pre-notification acknowledged • 18 ASV vials confirmed in reserve',
      badge: 'Destination Confirmed',
    },
  ],
  whyFactors: [
    {
      title: 'Guaranteed ASV Stock (Hospital B)',
      description:
        'Hospital A was 6 min closer, but reported zero polyvalent ASV in reserve at 12:38 PM. Diverting to Hospital A would have required emergency secondary transit.',
      icon: 'check_circle',
      verified: true,
    },
    {
      title: 'Immediate Hematology Capabilities',
      description:
        'Hospital B operates 24/7 dedicated 20WBCT clotting assays and nephrology backup for potential Russell\'s viper acute kidney injury.',
      icon: 'check_circle',
      verified: true,
    },
    {
      title: 'Traffic-Optimized Corridor',
      description:
        'Autonomous routing via NH-544 bypasses ongoing bridge maintenance at Periyar River, saving an estimated 14 minutes.',
      icon: 'check_circle',
      verified: true,
    },
  ],
  decisionTreeVersion: 'CarePath Engine v4.2 • NeuroVasc-ER v2.4',
};

export const REPLAN_ORCHESTRATION_STEPS = [
  {
    step: 1,
    time: '12:49:02',
    title: 'Regional Facility Scanning',
    description: 'Evaluated 6 centers within 35km radius against Envenomation Tier 2 criteria.',
    completed: true,
  },
  {
    step: 2,
    time: '12:49:05',
    title: 'Inventory & Clinical Resource Lock',
    description: 'Validated active cold-chain ASV storage (>10 vials required) and dedicated on-call toxicologist.',
    completed: true,
  },
  {
    step: 3,
    time: '12:49:08',
    title: 'Telemetry & Navigation Sync',
    description: 'Assessed traffic choke points along Hwy 4; East Ring Bypass gives 3.2 min advantage for Ambulance #17.',
    completed: true,
  },
  {
    step: 4,
    time: '12:49:11',
    title: 'Optimal Target Selected: Hospital C',
    description: 'District Medical Center designated as prime recipient. Automated pre-arrival handoff dispatch prepared.',
    completed: true,
    isTarget: true,
  },
];

export const PROVENANCE_AUDIT_DATA = [
  {
    title: 'Invalidation Trigger',
    source: 'Hospital B Pharmacy Node #4',
    detail: 'Depleted via automated Pyxis dispense record #PX-9821 for incoming polytrauma code at 12:49:14.',
  },
  {
    title: 'Candidate Comparison',
    source: 'Hospital C vs Hospital E',
    detail: 'Hospital E had ASV but zero pediatric ICU overflow slots. Hospital C holds 100% capacity balance with 14 cold-chain vials.',
  },
  {
    title: 'Telemetry Verification',
    source: 'CAD & DOT Traffic Hub',
    detail: 'Signal preemption clear on East Ring Expressway. Estimated 99th-percentile transit variance: ±90 sec.',
  },
];
