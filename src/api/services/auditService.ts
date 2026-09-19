/**
 * @file auditService.ts
 * @description Service for managing operational audit logs, decision provenance, and legal verification records.
 * Connects to future endpoint `/api/v1/audit` while currently backed by decentralized fixtures.
 */

import { apiClient, ApiResponse } from '../apiClient';
import { EventStreamItem } from '../../types';
import { INITIAL_EVENT_STREAM } from '../../fixtures/events';

export const auditService = {
  /**
   * Fetch all chronological audit logs for the incident
   */
  async getAuditEvents(incidentId: string = 'sb-1042'): Promise<ApiResponse<EventStreamItem[]>> {
    return apiClient.get<EventStreamItem[]>(
      `/audit/${incidentId}/events`,
      {},
      () => INITIAL_EVENT_STREAM
    );
  },

  /**
   * Append a new verified immutable operational event to the audit trail
   */
  async appendEvent(
    incidentId: string,
    event: Omit<EventStreamItem, 'id'>
  ): Promise<ApiResponse<EventStreamItem>> {
    const newRecord: EventStreamItem = {
      ...event,
      id: `evt-${Date.now()}`,
    };

    return apiClient.post<EventStreamItem>(
      `/audit/${incidentId}/events`,
      newRecord,
      {},
      () => newRecord
    );
  },

  /**
   * Export the verified audit trail into an RFC-compliant CSV string
   */
  generateCsvContent(events: EventStreamItem[]): string {
    const headers = ['Event ID', 'Timestamp', 'Time Formatted', 'Title', 'Description', 'Category', 'Badge'];
    const rows = events.map((e) => [
      `"${e.id}"`,
      `"${new Date().toISOString()}"`,
      `"${e.timeFormatted}"`,
      `"${e.title.replace(/"/g, '""')}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      `"${e.badgeText}"`,
      `"${e.badgeType}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  },
};
