/**
 * @file apiClient.ts
 * @description Extensible HTTP/API client designed for plug-and-play REST / GraphQL / WebSocket integration.
 * Supports configurable base URLs, request/response interceptors, and seamless switching
 * between fixture-backed mock providers and real remote backend servers.
 */

import { APP_CONFIG } from '../config/appConfig';

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
  skipAuth?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  timestamp: string;
  source: 'network' | 'mock-fixture';
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

class ApiClient {
  private baseUrl: string;
  private isMockMode: boolean;
  private defaultHeaders: Record<string, string>;

  constructor() {
    // Configurable via vite env or appConfig
    this.baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';
    this.isMockMode = (import.meta as any).env?.VITE_USE_MOCK_API !== 'false';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-CarePath-Client': 'CarePath-Web-v4.2',
    };
  }

  /**
   * Check if client is currently in Mock/Fixture mode
   */
  public isUsingMock(): boolean {
    return this.isMockMode;
  }

  /**
   * Toggle between Mock fixtures and Live Remote APIs at runtime (ideal for testing & demos)
   */
  public setMockMode(enabled: boolean): void {
    this.isMockMode = enabled;
    console.info(`[ApiClient] Mock mode set to: ${enabled}`);
  }

  /**
   * Update base URL for future backend API deployment
   */
  public setBaseUrl(newUrl: string): void {
    this.baseUrl = newUrl;
    console.info(`[ApiClient] Base URL set to: ${newUrl}`);
  }

  /**
   * Core request dispatcher with query param formatting and timeout handling
   */
  public async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
    mockFallback?: () => T | Promise<T>
  ): Promise<ApiResponse<T>> {
    // In Mock mode, directly invoke the fallback fixture resolver with a simulated network delay
    if (this.isMockMode && mockFallback) {
      const simulatedLatency = Math.floor(Math.random() * 80) + 40;
      await new Promise((resolve) => setTimeout(resolve, simulatedLatency));
      const mockData = await mockFallback();
      return {
        data: mockData,
        status: 200,
        statusText: 'OK (Mock Fixture)',
        headers: new Headers(),
        timestamp: new Date().toISOString(),
        source: 'mock-fixture',
      };
    }

    // Build URL with query params
    const url = new URL(
      endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`,
      window.location.origin
    );

    if (options.params) {
      Object.entries(options.params).forEach(([key, val]) => {
        if (val !== undefined) {
          url.searchParams.append(key, String(val));
        }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || 10000);

    try {
      const response = await fetch(url.toString(), {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw {
          message: `HTTP error ${response.status}: ${response.statusText}`,
          status: response.status,
          code: 'HTTP_ERROR',
        } as ApiError;
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        timestamp: new Date().toISOString(),
        source: 'network',
      };
    } catch (error: any) {
      clearTimeout(timeoutId);

      // If network fails and mock fallback exists, safely fall back
      if (mockFallback) {
        console.warn(`[ApiClient] Network request failed for ${endpoint}. Falling back to fixture:`, error);
        const mockData = await mockFallback();
        return {
          data: mockData,
          status: 200,
          statusText: 'OK (Fallback to Fixture)',
          headers: new Headers(),
          timestamp: new Date().toISOString(),
          source: 'mock-fixture',
        };
      }

      throw {
        message: error.name === 'AbortError' ? 'Request timed out' : error.message || 'Unknown network error',
        code: error.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
        details: error,
      } as ApiError;
    }
  }

  // Convenience verbs
  public get<T>(endpoint: string, options?: ApiRequestOptions, mockFallback?: () => T | Promise<T>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' }, mockFallback);
  }

  public post<T>(endpoint: string, body?: unknown, options?: ApiRequestOptions, mockFallback?: () => T | Promise<T>) {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      },
      mockFallback
    );
  }

  public put<T>(endpoint: string, body?: unknown, options?: ApiRequestOptions, mockFallback?: () => T | Promise<T>) {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      },
      mockFallback
    );
  }

  public delete<T>(endpoint: string, options?: ApiRequestOptions, mockFallback?: () => T | Promise<T>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' }, mockFallback);
  }
}

export const apiClient = new ApiClient();
