import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  NavigationTab,
  Incident,
  Facility,
  AmbulanceUnit,
  ClinicalPathway,
  EventStreamItem,
  ReplanningState,
} from '../types';
import { INCIDENT_SB_1042, ALL_INCIDENTS } from '../fixtures/incidents';
import { ALL_FACILITIES } from '../fixtures/facilities';
import { INITIAL_EVENT_STREAM } from '../fixtures/events';
import { AMBULANCE_17, CLINICAL_PATHWAY_SB_1042 } from '../fixtures/pathways';
import { APP_ROUTES, RouteConfig, getRouteById, getRouteByPathOrHash } from '../config/routes';
import {
  ThemePreset,
  AVAILABLE_THEMES,
  DEFAULT_THEME_ID,
  applyThemeToDOM,
} from '../config/theme';
import { apiClient } from '../api/apiClient';
import { incidentService } from '../api/services/incidentService';
import { routingService } from '../api/services/routingService';
import { auditService } from '../api/services/auditService';

interface ToastState {
  show: boolean;
  title: string;
  subtitle: string;
  type: 'success' | 'warning' | 'info';
}

interface CarePathContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentRoute: RouteConfig;
  routes: RouteConfig[];
  currentTheme: ThemePreset;
  setThemeById: (id: ThemePreset['id']) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  isMockMode: boolean;
  setIsMockMode: (mock: boolean) => void;
  incident: Incident;
  allIncidents: Incident[];
  setIncidentById: (id: string) => void;
  ambulance: AmbulanceUnit;
  facilities: Facility[];
  events: EventStreamItem[];
  pathway: ClinicalPathway;
  replanState: ReplanningState;
  toast: ToastState;
  isWhyModalOpen: boolean;
  setIsWhyModalOpen: (open: boolean) => void;
  isHandoffModalOpen: boolean;
  setIsHandoffModalOpen: (open: boolean) => void;
  isProvenanceOpen: boolean;
  setIsProvenanceOpen: (open: boolean) => void;
  showToast: (title: string, subtitle: string, type?: 'success' | 'warning' | 'info') => void;
  confirmReplanning: () => Promise<void>;
  notifyAmbulanceAndFamily: () => Promise<void>;
  transmitHandoff: () => Promise<void>;
  downloadCsv: () => void;
  resetToFixtures: () => void;
  triggerSimulatedStockout: () => void;
}

const CarePathContext = createContext<CarePathContextType | undefined>(undefined);

export const CarePathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Determine initial route from URL hash if present
  const getInitialTab = (): NavigationTab => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const match = getRouteByPathOrHash(window.location.hash);
      if (match) return match.id;
    }
    return 'operations-dashboard';
  };

  // Determine initial theme from localStorage or config default
  const getInitialThemeId = (): ThemePreset['id'] => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('carepath_theme_id') as ThemePreset['id'];
      if (saved && AVAILABLE_THEMES[saved]) {
        return saved;
      }
    }
    return DEFAULT_THEME_ID;
  };

  const [activeTab, setActiveTabState] = useState<NavigationTab>(getInitialTab);
  const [themeId, setThemeId] = useState<ThemePreset['id']>(getInitialThemeId);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isMockMode, setIsMockModeState] = useState<boolean>(apiClient.isUsingMock());
  const [incident, setIncident] = useState<Incident>(INCIDENT_SB_1042);
  const [ambulance, setAmbulance] = useState<AmbulanceUnit>(AMBULANCE_17);
  const [facilities, setFacilities] = useState<Facility[]>(ALL_FACILITIES);
  const [events, setEvents] = useState<EventStreamItem[]>(INITIAL_EVENT_STREAM);
  const [pathway, setPathway] = useState<ClinicalPathway>(CLINICAL_PATHWAY_SB_1042);

  const [replanState, setReplanState] = useState<ReplanningState>({
    isInvalidated: true,
    invalidatedReason:
      'St. Jude Regional (Hospital B) declared 0 available vials at 12:49 PM due to concurrent emergency administration.',
    invalidatedTimestamp: '12:49:14 Local',
    elapsedReplanTime: '+00:01:18 in replan',
    previousFacilityId: 'hosp-b',
    recommendedFacilityId: 'hosp-c',
    confidenceScore: 98.4,
    confirmed: false,
    dispatchesNotified: false,
    provenanceOpen: false,
  });

  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: '',
    subtitle: '',
    type: 'success',
  });

  const [isWhyModalOpen, setIsWhyModalOpen] = useState<boolean>(false);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState<boolean>(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState<boolean>(false);

  // Sync state tab with browser hash and history
  const setActiveTab = useCallback((tab: NavigationTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const targetRoute = getRouteById(tab);
      if (window.location.hash !== targetRoute.hash) {
        window.location.hash = targetRoute.hash;
      }
    }
  }, []);

  // Listen for browser navigation (forward / back buttons and hash changes)
  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash;
      const matched = getRouteByPathOrHash(currentHash);
      if (matched && matched.id !== activeTab) {
        setActiveTabState(matched.id);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial sync
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.location.hash = getRouteById(activeTab).hash;
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  // Apply theme to DOM and persist
  const currentTheme = AVAILABLE_THEMES[themeId] || AVAILABLE_THEMES[DEFAULT_THEME_ID];

  useEffect(() => {
    applyThemeToDOM(currentTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('carepath_theme_id', themeId);
    }
  }, [currentTheme, themeId]);

  const setThemeById = useCallback((id: ThemePreset['id']) => {
    if (AVAILABLE_THEMES[id]) {
      setThemeId(id);
    }
  }, []);

  const setIsMockMode = useCallback((mock: boolean) => {
    apiClient.setMockMode(mock);
    setIsMockModeState(mock);
  }, []);

  const showToast = useCallback(
    (title: string, subtitle: string, type: 'success' | 'warning' | 'info' = 'success') => {
      setToast({ show: true, title, subtitle, type });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4000);
    },
    [],
  );

  // Switch active incident for testing
  const setIncidentById = useCallback((id: string) => {
    const found = ALL_INCIDENTS.find((i) => i.id === id);
    if (found) {
      setIncident(found);
    }
  }, []);

  // Confirm Replan: Hospital C becomes the confirmed target via routingService
  const confirmReplanning = useCallback(async () => {
    setReplanState((prev) => ({
      ...prev,
      confirmed: true,
    }));

    // Update target in incident and ambulance
    setIncident((prev) => ({
      ...prev,
      targetFacilityId: 'hosp-c',
      distanceRemainingKm: 14.8,
    }));

    setAmbulance((prev) => ({
      ...prev,
      distanceToTargetKm: 14.8,
      etaMinutes: 21,
    }));

    // Dispatch via service layer
    await routingService.pushNavVector('ALS-17', 'hosp-c', 'route-reroute-hosp-c');

    const newEvent: EventStreamItem = {
      id: `evt-${Date.now()}`,
      title: 'Pathway reroute confirmed: Hospital C (District Medical)',
      description: 'Nav-vector pushed to Ambulance #17 console. Pre-arrival handoff dispatch prepared for Bay 2.',
      badgeText: 'Reroute Confirmed',
      badgeType: 'success',
      icon: 'check_circle',
      timeFormatted: '12:50 PM',
      timeAgo: 'Just now',
    };

    setEvents((prev) => [newEvent, ...prev]);

    showToast(
      'Pathway Confirmed & Active',
      'Ambulance #17 rerouted to Hospital C (District Medical). 14 ASV vials reserved.',
      'success',
    );
  }, [showToast]);

  // Notify ambulance & family
  const notifyAmbulanceAndFamily = useCallback(async () => {
    setReplanState((prev) => ({
      ...prev,
      dispatchesNotified: true,
    }));

    const notifyEvent: EventStreamItem = {
      id: `evt-${Date.now()}`,
      title: 'Reroute telematics dispatched to ALS Unit 17 & family SMS gateway',
      description: 'Paramedic lead Capt. R. Thomas acknowledged reroute. ETA adjusted to 21 min.',
      badgeText: 'Dispatched',
      badgeType: 'primary',
      icon: 'send_to_mobile',
      timeFormatted: '12:50 PM',
      timeAgo: 'Just now',
    };
    setEvents((prev) => [notifyEvent, ...prev]);

    showToast(
      'Dispatches Transmitted',
      'Telemetry vector acknowledged by Ambulance #17. Family contact updated via SMS.',
      'info',
    );
  }, [showToast]);

  // Transmit pre-arrival handoff package via incidentService
  const transmitHandoff = useCallback(async () => {
    const targetFacility = facilities.find((f) => f.id === incident.targetFacilityId) || facilities[0];

    await incidentService.transmitHandoff(incident.id, targetFacility.id, {
      vitals: incident.vitals,
      species: incident.species,
      etaMinutes: ambulance.etaMinutes,
    });

    const handoffEvent: EventStreamItem = {
      id: `evt-${Date.now()}`,
      title: `Pre-Arrival Package Sent to ${targetFacility.name}`,
      description: `Comprehensive telemetry, bite morphology, and lyophilized ASV pre-mix order sent to Triage Desk.`,
      badgeText: 'Package Delivered',
      badgeType: 'success',
      icon: 'done_all',
      timeFormatted: '12:50 PM',
      timeAgo: 'Just now',
    };

    setEvents((prev) => [handoffEvent, ...prev]);
    showToast(
      'Pre-Arrival Package Sent',
      `Acknowledged by ED Triage Desk (${targetFacility.shortName})`,
      'success',
    );
  }, [facilities, incident.id, incident.targetFacilityId, incident.vitals, incident.species, ambulance.etaMinutes, showToast]);

  // Download immutable CSV audit trail
  const downloadCsv = useCallback(() => {
    const csvContent = auditService.generateCsvContent(events);

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `carepath_audit_${incident.code.toLowerCase()}_1249.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Download Complete', `Immutable audit trail saved for ${incident.code}`, 'info');
  }, [events, incident.code, showToast]);

  // Reset to initial fixtures (ideal for testing scenarios)
  const resetToFixtures = useCallback(() => {
    setIncident(INCIDENT_SB_1042);
    setAmbulance(AMBULANCE_17);
    setFacilities(ALL_FACILITIES);
    setEvents(INITIAL_EVENT_STREAM);
    setPathway(CLINICAL_PATHWAY_SB_1042);
    setReplanState({
      isInvalidated: true,
      invalidatedReason:
        'St. Jude Regional (Hospital B) declared 0 available vials at 12:49 PM due to concurrent emergency administration.',
      invalidatedTimestamp: '12:49:14 Local',
      elapsedReplanTime: '+00:01:18 in replan',
      previousFacilityId: 'hosp-b',
      recommendedFacilityId: 'hosp-c',
      confidenceScore: 98.4,
      confirmed: false,
      dispatchesNotified: false,
      provenanceOpen: false,
    });
    showToast('Fixtures Reset', 'Application test state restored to initial prototype fixtures.', 'info');
  }, [showToast]);

  // Helper to toggle simulation for stockout
  const triggerSimulatedStockout = useCallback(() => {
    setFacilities((prev) =>
      prev.map((f) =>
        f.id === 'hosp-b'
          ? {
              ...f,
              asvStock: {
                ...f.asvStock,
                availableVials: 0,
                percent: 0,
                status: 'stockout',
                verifiedTime: '12:49 PM Stockout Declared',
              },
            }
          : f,
      ),
    );
    setActiveTab('replanning');
    showToast('Stockout Invalidation', 'Hospital B reported ASV stock depletion. Switched to Replanning console.', 'warning');
  }, [setActiveTab, showToast]);

  const currentRoute = getRouteById(activeTab);

  return (
    <CarePathContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentRoute,
        routes: APP_ROUTES,
        currentTheme,
        setThemeById,
        isThemeModalOpen,
        setIsThemeModalOpen,
        isMockMode,
        setIsMockMode,
        incident,
        allIncidents: ALL_INCIDENTS,
        setIncidentById,
        ambulance,
        facilities,
        events,
        pathway,
        replanState,
        toast,
        isWhyModalOpen,
        setIsWhyModalOpen,
        isHandoffModalOpen,
        setIsHandoffModalOpen,
        isProvenanceOpen,
        setIsProvenanceOpen,
        showToast,
        confirmReplanning,
        notifyAmbulanceAndFamily,
        transmitHandoff,
        downloadCsv,
        resetToFixtures,
        triggerSimulatedStockout,
      }}
    >
      {children}
    </CarePathContext.Provider>
  );
};

export const useCarePath = (): CarePathContextType => {
  const context = useContext(CarePathContext);
  if (!context) {
    throw new Error('useCarePath must be used within a CarePathProvider');
  }
  return context;
};
