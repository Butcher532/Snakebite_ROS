/**
 * @file incidentService.ts
 * @description Service for managing active envenomation incidents, telemetry streams, and handoffs.
 * Connects to future endpoint `/api/v1/incidents` while currently backed by decentralized fixtures.
 */

import { apiClient, ApiResponse } from '../apiClient';
import { Incident, VitalsTelemetry } from '../../types';
import { INCIDENT_SB_1042 } from '../../fixtures/incidents';

export const incidentService = {
  /**
   * Fetch details for an active incident
   */
  async getIncident(incidentId: string = 'sb-1042'): Promise<ApiResponse<Incident>> {
    return apiClient.get<Incident>(
      `/incidents/${incidentId}`,
      {},
      () => INCIDENT_SB_1042
    );
  },

  /**
   * Update vitals streamed from the in-transit transport unit
   */
  async updateVitals(
    incidentId: string,
    vitals: Partial<VitalsTelemetry>
  ): Promise<ApiResponse<Incident>> {
    return apiClient.put<Incident>(
      `/incidents/${incidentId}/vitals`,
      { vitals },
      {},
      () => ({
        ...INCIDENT_SB_1042,
        vitals: { ...INCIDENT_SB_1042.vitals, ...vitals },
      })
    );
  },

  /**
   * Transmit pre-arrival emergency handoff package to target emergency department
   */
  async transmitHandoff(
    incidentId: string,
    facilityId: string,
    packagePayload: Record<string, unknown>
  ): Promise<ApiResponse<{ success: boolean; transmissionId: string; timestamp: string }>> {
    return apiClient.post<{ success: boolean; transmissionId: string; timestamp: string }>(
      `/incidents/${incidentId}/handoff`,
      { facilityId, ...packagePayload },
      {},
      () => ({
        success: true,
        transmissionId: `TX-HND-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString(),
      })
    );
  },
};
