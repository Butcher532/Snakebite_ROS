/**
 * @file routes.ts
 * @description Central declarative route registry for CarePath.
 * Designed so that new screens and views can be added in a single configuration block,
 * complete with navigation metadata, breadcrumbs, and associated backend API endpoint contracts.
 */

import { NavigationTab } from '../types';

export interface RouteConfig {
  id: NavigationTab;
  path: string;
  hash: string;
  title: string;
  shortLabel: string;
  icon: string;
  description: string;
  category: 'primary' | 'operational' | 'analytics';
  /**
   * Future API endpoints consumed or managed by this view
   * Developers can inspect or mock these contracts directly
   */
  futureApiEndpoints: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    description: string;
  }[];
}

export const APP_ROUTES: RouteConfig[] = [
  {
    id: 'operations-dashboard',
    path: '/dashboard',
    hash: '#/dashboard',
    title: 'Operations Dashboard',
    shortLabel: 'Dashboard',
    icon: 'dashboard',
    description: 'Real-time multi-facility command center, tactical GIS map, and telemetry feed.',
    category: 'primary',
    futureApiEndpoints: [
      { method: 'GET', endpoint: '/api/v1/incidents/sb-1042', description: 'Active envenomation telemetry' },
      { method: 'GET', endpoint: '/api/v1/kpis', description: 'Regional operational KPIs' },
      { method: 'GET', endpoint: '/api/v1/audit/sb-1042/events', description: 'Event log stream' },
    ],
  },
  {
    id: 'carepath-live',
    path: '/live',
    hash: '#/live',
    title: 'CarePath Live Tracking',
    shortLabel: 'CarePath Live',
    icon: 'route',
    description: 'En-route GIS navigation with high-resolution satellite overlay and sensor gateway.',
    category: 'primary',
    futureApiEndpoints: [
      { method: 'GET', endpoint: '/api/v1/routing/ambulances/ALS-17', description: 'Ambulance live GPS and speed' },
      { method: 'GET', endpoint: '/api/v1/incidents/sb-1042/vitals', description: 'Patient continuous vital signs' },
      { method: 'POST', endpoint: '/api/v1/incidents/sb-1042/handoff', description: 'Transmit handoff package' },
    ],
  },
  {
    id: 'replanning',
    path: '/replanning',
    hash: '#/replanning',
    title: 'Dynamic CarePath Replanning',
    shortLabel: 'Replanning',
    icon: 'alt_route',
    description: 'Autonomous rerouting engine handling stockouts, bed saturation, and road closures.',
    category: 'operational',
    futureApiEndpoints: [
      { method: 'POST', endpoint: '/api/v1/routing/replan', description: 'Multi-constraint path re-evaluation' },
      { method: 'POST', endpoint: '/api/v1/routing/ambulances/ALS-17/nav-vector', description: 'Push nav vectors' },
      { method: 'POST', endpoint: '/api/v1/facilities/hosp-c/reservations', description: 'Auto-reserve alternative bay' },
    ],
  },
  {
    id: 'facility-directory',
    path: '/facilities',
    hash: '#/facilities',
    title: 'Regional Facility Directory',
    shortLabel: 'Facilities',
    icon: 'local_hospital',
    description: 'Live antivenom cold-chain reserve levels, ICU bed occupancy, and toxicology readiness.',
    category: 'operational',
    futureApiEndpoints: [
      { method: 'GET', endpoint: '/api/v1/facilities', description: 'All regional hospitals directory' },
      { method: 'GET', endpoint: '/api/v1/facilities/:id/asv-inventory', description: 'Real-time ASV vial stock' },
    ],
  },
  {
    id: 'handoff-reports',
    path: '/handoff',
    hash: '#/handoff',
    title: 'Handoff & Audit Reports',
    shortLabel: 'Handoff Reports',
    icon: 'assignment_turned_in',
    description: 'Immutable legal audit logs, pre-arrival handoffs, and CSV data exports.',
    category: 'analytics',
    futureApiEndpoints: [
      { method: 'GET', endpoint: '/api/v1/audit/sb-1042/events', description: 'Full event audit sequence' },
      { method: 'GET', endpoint: '/api/v1/audit/export/csv', description: 'RFC-4180 audit trail download' },
    ],
  },
];

/**
 * Find route by path or hash
 */
export function getRouteByPathOrHash(pathOrHash: string): RouteConfig | undefined {
  const normalized = pathOrHash.replace(/^#/, '').replace(/\/$/, '') || '/dashboard';
  return APP_ROUTES.find(
    (r) => r.path === normalized || r.hash === `#${normalized}` || r.id === normalized.replace(/^\//, '')
  );
}

/**
 * Get route by navigation ID
 */
export function getRouteById(id: NavigationTab): RouteConfig {
  return APP_ROUTES.find((r) => r.id === id) || APP_ROUTES[0];
}
