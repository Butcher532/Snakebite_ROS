/**
 * @file facilityService.ts
 * @description Service for querying regional hospitals, cold-chain antivenom stock, and bed readiness.
 * Connects to future endpoint `/api/v1/facilities` while currently backed by decentralized fixtures.
 */

import { apiClient, ApiResponse } from '../apiClient';
import { Facility } from '../../types';
import { ALL_FACILITIES } from '../../fixtures/facilities';

export const facilityService = {
  /**
   * Fetch all regional facilities with active cold-chain stock levels
   */
  async getFacilities(): Promise<ApiResponse<Facility[]>> {
    return apiClient.get<Facility[]>(
      '/facilities',
      {},
      () => ALL_FACILITIES
    );
  },

  /**
   * Check real-time ASV inventory for a specific facility
   */
  async checkAsvInventory(
    facilityId: string
  ): Promise<ApiResponse<{ availableVials: number; status: string; timestamp: string }>> {
    return apiClient.get<{ availableVials: number; status: string; timestamp: string }>(
      `/facilities/${facilityId}/asv-inventory`,
      {},
      () => {
        const facility = ALL_FACILITIES.find((f: Facility) => f.id === facilityId);
        return {
          availableVials: facility ? facility.asvStock.availableVials : 0,
          status: facility ? facility.asvStock.status : 'unknown',
          timestamp: new Date().toISOString(),
        };
      }
    );
  },

  /**
   * Reserve an emergency trauma bay or ICU bed for an incoming patient
   */
  async reserveBed(
    facilityId: string,
    incidentId: string,
    bedType: 'ICU' | 'Trauma Bay' = 'Trauma Bay'
  ): Promise<ApiResponse<{ reservationId: string; bedNumber: string; confirmed: boolean }>> {
    return apiClient.post<{ reservationId: string; bedNumber: string; confirmed: boolean }>(
      `/facilities/${facilityId}/reservations`,
      { incidentId, bedType },
      {},
      () => ({
        reservationId: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
        bedNumber: bedType === 'ICU' ? 'Bed 4 (ICU)' : 'Trauma Bay 2',
        confirmed: true,
      })
    );
  },
};
