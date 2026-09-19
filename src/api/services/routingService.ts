/**
 * @file routingService.ts
 * @description Service for managing GIS navigation, ambulance telemetry streams, and dynamic CarePath rerouting.
 * Connects to future endpoint `/api/v1/routing` while currently backed by decentralized fixtures.
 */

import { apiClient, ApiResponse } from '../apiClient';
import { AmbulanceUnit } from '../../types';
import { AMBULANCE_17 } from '../../fixtures/pathways';

export const routingService = {
  /**
   * Fetch real-time telemetry from active transport unit
   */
  async getAmbulanceTelemetry(unitCode: string = 'ALS-17'): Promise<ApiResponse<AmbulanceUnit>> {
    return apiClient.get<AmbulanceUnit>(
      `/routing/ambulances/${unitCode}`,
      {},
      () => AMBULANCE_17
    );
  },

  /**
   * Request an autonomous replan when an existing pathway becomes invalid
   */
  async requestReplan(
    incidentId: string,
    invalidatedFacilityId: string
  ): Promise<ApiResponse<{ recommendedFacilityId: string; distanceRemainingKm: number; etaMinutes: number }>> {
    return apiClient.post<{ recommendedFacilityId: string; distanceRemainingKm: number; etaMinutes: number }>(
      '/routing/replan',
      { incidentId, invalidatedFacilityId },
      {},
      () => ({
        recommendedFacilityId: 'hosp-c',
        distanceRemainingKm: 14.8,
        etaMinutes: 21,
      })
    );
  },

  /**
   * Push an approved route vector directly to the transport unit's onboard MDT console
   */
  async pushNavVector(
    unitCode: string,
    targetFacilityId: string,
    routeId: string
  ): Promise<ApiResponse<{ delivered: boolean; ackTime: string }>> {
    return apiClient.post<{ delivered: boolean; ackTime: string }>(
      `/routing/ambulances/${unitCode}/nav-vector`,
      { targetFacilityId, routeId },
      {},
      () => ({
        delivered: true,
        ackTime: new Date().toISOString(),
      })
    );
  },
};
