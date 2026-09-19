/**
 * @file theme.ts
 * @description Centralized Theming & Appearance Configuration for CarePath.
 * 
 * To change the visual style, colors, corner radius, borders, or spacing of the entire
 * application, you only need to edit THIS SINGLE FILE.
 * 
 * Features:
 * - 4 Pre-configured Archetype Themes:
 *   1. 'tactical-dark' (Default): Low-light emergency command console
 *   2. 'clinical-light': High-contrast clean medical hospital theme
 *   3. 'midnight-sapphire': Deep ocean navy and vivid cyan HUD
 *   4. 'stealth-monochrome': Minimalist tactical slate for sunlight operations
 * - Component Appearance Tokens (corner radii, border widths, shadow elevations, density scales)
 * - Dynamic CSS variable injector that updates the live UI instantly.
 */

export interface ThemeColors {
  canvasBase: string;
  surface: string;
  surfaceSecondary: string;
  surfaceElevated: string;
  surfaceBright: string;
  surfaceContainer: string;
  surfaceContainerLow: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  surfaceContainerLowest: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  tertiary: string;
  tertiaryContainer: string;
  statusCritical: string;
  statusWarning: string;
}

export interface ComponentStyleTokens {
  /**
   * Border radius for main cards and containers (e.g., '8px', '12px', '16px', '20px')
   */
  cardRadius: string;
  /**
   * Border radius for interactive buttons and pills
   */
  buttonRadius: string;
  /**
   * Border radius for status badges and tags
   */
  badgeRadius: string;
  /**
   * Base border width on cards ('0px', '1px', '2px')
   */
  borderWidth: string;
  /**
   * Card elevation shadow intensity
   */
  cardShadow: string;
  /**
   * Density / Spacing scale factor ('compact' | 'comfortable' | 'spacious')
   */
  density: 'compact' | 'comfortable' | 'spacious';
  /**
   * Primary font family stack
   */
  fontFamily: string;
}

export interface ThemePreset {
  id: 'tactical-dark' | 'clinical-light' | 'midnight-sapphire' | 'stealth-monochrome';
  name: string;
  description: string;
  isDark: boolean;
  colors: ThemeColors;
  components: ComponentStyleTokens;
}

/**
 * ============================================================================
 * PRESET 1: TACTICAL DARK (Default Operations Center)
 * Low-strain, high-contrast dark room optimized for emergency response consoles.
 * ============================================================================
 */
export const TACTICAL_DARK_THEME: ThemePreset = {
  id: 'tactical-dark',
  name: 'Tactical Dark (Default)',
  description: 'Obsidian & luminous HUD designed for 24/7 command center operations.',
  isDark: true,
  colors: {
    canvasBase: '#0B0F14',
    surface: '#0e141d',
    surfaceSecondary: '#161D27',
    surfaceElevated: '#1B2430',
    surfaceBright: '#343944',
    surfaceContainer: '#1a2029',
    surfaceContainerLow: '#161c25',
    surfaceContainerHigh: '#242a34',
    surfaceContainerHighest: '#2f353f',
    surfaceContainerLowest: '#080e17',
    borderSubtle: '#26313D',
    textPrimary: '#F4F7FA',
    textSecondary: '#A8B3C2',
    textMuted: '#6F7B89',
    primary: '#b2c5ff',
    primaryContainer: '#5b8cff',
    onPrimary: '#002c72',
    onPrimaryContainer: '#002665',
    secondary: '#59d6f7',
    secondaryContainer: '#00a7c6',
    tertiary: '#47dfa4',
    tertiaryContainer: '#00a574',
    statusCritical: '#FF5C6C',
    statusWarning: '#F5B942',
  },
  components: {
    cardRadius: '12px',
    buttonRadius: '8px',
    badgeRadius: '9999px',
    borderWidth: '1px',
    cardShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    density: 'comfortable',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
};

/**
 * ============================================================================
 * PRESET 2: CLINICAL LIGHT (Hospital & Field Medical Ward)
 * Crisp, clean off-white canvas with deep navy typography for daylight readability.
 * ============================================================================
 */
export const CLINICAL_LIGHT_THEME: ThemePreset = {
  id: 'clinical-light',
  name: 'Clinical Light',
  description: 'High-visibility medical hospital grade theme for daylight ED wards.',
  isDark: false,
  colors: {
    canvasBase: '#F4F6F9',
    surface: '#FFFFFF',
    surfaceSecondary: '#E9EEF5',
    surfaceElevated: '#FFFFFF',
    surfaceBright: '#D8E2ED',
    surfaceContainer: '#E2E8F0',
    surfaceContainerLow: '#EDF2F7',
    surfaceContainerHigh: '#CBD5E1',
    surfaceContainerHighest: '#94A3B8',
    surfaceContainerLowest: '#F8FAFC',
    borderSubtle: '#D3DCE6',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    primary: '#2563EB',
    primaryContainer: '#3B82F6',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#FFFFFF',
    secondary: '#0284C7',
    secondaryContainer: '#0EA5E9',
    tertiary: '#059669',
    tertiaryContainer: '#10B981',
    statusCritical: '#DC2626',
    statusWarning: '#D97706',
  },
  components: {
    cardRadius: '10px',
    buttonRadius: '8px',
    badgeRadius: '6px',
    borderWidth: '1px',
    cardShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
    density: 'comfortable',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
};

/**
 * ============================================================================
 * PRESET 3: MIDNIGHT SAPPHIRE (Cyber Emergency Telematics)
 * Deep oceanic navy with electric cyan highlights.
 * ============================================================================
 */
export const MIDNIGHT_SAPPHIRE_THEME: ThemePreset = {
  id: 'midnight-sapphire',
  name: 'Midnight Sapphire',
  description: 'Oceanic dark HUD with neon cyan and electric sapphire telemetry.',
  isDark: true,
  colors: {
    canvasBase: '#060B18',
    surface: '#0A1226',
    surfaceSecondary: '#101B38',
    surfaceElevated: '#16244C',
    surfaceBright: '#26376E',
    surfaceContainer: '#131F3F',
    surfaceContainerLow: '#0D1730',
    surfaceContainerHigh: '#1C2C59',
    surfaceContainerHighest: '#273C74',
    surfaceContainerLowest: '#040710',
    borderSubtle: '#1F315F',
    textPrimary: '#F0F5FF',
    textSecondary: '#94AADB',
    textMuted: '#6075A6',
    primary: '#709CFF',
    primaryContainer: '#3D77FF',
    onPrimary: '#00194A',
    onPrimaryContainer: '#00143D',
    secondary: '#38BDF8',
    secondaryContainer: '#0284C7',
    tertiary: '#34D399',
    tertiaryContainer: '#059669',
    statusCritical: '#FB7185',
    statusWarning: '#FBBF24',
  },
  components: {
    cardRadius: '14px',
    buttonRadius: '10px',
    badgeRadius: '9999px',
    borderWidth: '1px',
    cardShadow: '0 8px 24px rgba(2, 6, 23, 0.6)',
    density: 'comfortable',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
};

/**
 * ============================================================================
 * PRESET 4: STEALTH MONOCHROME (Graphite Tactical)
 * Highly utilitarian neutral slate, minimal distraction for field medics.
 * ============================================================================
 */
export const STEALTH_MONOCHROME_THEME: ThemePreset = {
  id: 'stealth-monochrome',
  name: 'Stealth Monochrome',
  description: 'Graphite neutral styling designed for sunlight legibility and high contrast.',
  isDark: true,
  colors: {
    canvasBase: '#121417',
    surface: '#181B20',
    surfaceSecondary: '#21252C',
    surfaceElevated: '#282E37',
    surfaceBright: '#3B424E',
    surfaceContainer: '#232831',
    surfaceContainerLow: '#1A1E24',
    surfaceContainerHigh: '#2F3642',
    surfaceContainerHighest: '#3C4554',
    surfaceContainerLowest: '#0E1013',
    borderSubtle: '#333A46',
    textPrimary: '#FAFAFA',
    textSecondary: '#B4BCC8',
    textMuted: '#788291',
    primary: '#E2E8F0',
    primaryContainer: '#94A3B8',
    onPrimary: '#0F172A',
    onPrimaryContainer: '#0F172A',
    secondary: '#CBD5E1',
    secondaryContainer: '#64748B',
    tertiary: '#A7F3D0',
    tertiaryContainer: '#34D399',
    statusCritical: '#F87171',
    statusWarning: '#FCD34D',
  },
  components: {
    cardRadius: '6px',
    buttonRadius: '4px',
    badgeRadius: '4px',
    borderWidth: '1.5px',
    cardShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    density: 'compact',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
};

/**
 * All Available Themes in Registry
 */
export const AVAILABLE_THEMES: Record<ThemePreset['id'], ThemePreset> = {
  'tactical-dark': TACTICAL_DARK_THEME,
  'clinical-light': CLINICAL_LIGHT_THEME,
  'midnight-sapphire': MIDNIGHT_SAPPHIRE_THEME,
  'stealth-monochrome': STEALTH_MONOCHROME_THEME,
};

/**
 * ACTIVE DEFAULT THEME CONFIGURATION
 * ----------------------------------------------------------------------------
 * EDIT THIS LINE to change the default appearance of the entire app:
 * Options: 'tactical-dark' | 'clinical-light' | 'midnight-sapphire' | 'stealth-monochrome'
 * ----------------------------------------------------------------------------
 */
export const DEFAULT_THEME_ID: ThemePreset['id'] = 'tactical-dark';

/**
 * Injects theme variables dynamically into the DOM
 */
export function applyThemeToDOM(theme: ThemePreset): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Colors
  root.style.setProperty('--app-canvas-base', theme.colors.canvasBase);
  root.style.setProperty('--app-surface', theme.colors.surface);
  root.style.setProperty('--app-surface-secondary', theme.colors.surfaceSecondary);
  root.style.setProperty('--app-surface-elevated', theme.colors.surfaceElevated);
  root.style.setProperty('--app-surface-bright', theme.colors.surfaceBright);
  root.style.setProperty('--app-surface-container', theme.colors.surfaceContainer);
  root.style.setProperty('--app-surface-container-low', theme.colors.surfaceContainerLow);
  root.style.setProperty('--app-surface-container-high', theme.colors.surfaceContainerHigh);
  root.style.setProperty('--app-surface-container-highest', theme.colors.surfaceContainerHighest);
  root.style.setProperty('--app-surface-container-lowest', theme.colors.surfaceContainerLowest);
  root.style.setProperty('--app-border-subtle', theme.colors.borderSubtle);
  root.style.setProperty('--app-text-primary', theme.colors.textPrimary);
  root.style.setProperty('--app-text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--app-text-muted', theme.colors.textMuted);
  root.style.setProperty('--app-primary', theme.colors.primary);
  root.style.setProperty('--app-primary-container', theme.colors.primaryContainer);
  root.style.setProperty('--app-on-primary', theme.colors.onPrimary);
  root.style.setProperty('--app-on-primary-container', theme.colors.onPrimaryContainer);
  root.style.setProperty('--app-secondary', theme.colors.secondary);
  root.style.setProperty('--app-secondary-container', theme.colors.secondaryContainer);
  root.style.setProperty('--app-tertiary', theme.colors.tertiary);
  root.style.setProperty('--app-tertiary-container', theme.colors.tertiaryContainer);
  root.style.setProperty('--app-status-critical', theme.colors.statusCritical);
  root.style.setProperty('--app-status-warning', theme.colors.statusWarning);

  // Component Tokens
  root.style.setProperty('--app-card-radius', theme.components.cardRadius);
  root.style.setProperty('--app-button-radius', theme.components.buttonRadius);
  root.style.setProperty('--app-badge-radius', theme.components.badgeRadius);
  root.style.setProperty('--app-border-width', theme.components.borderWidth);
  root.style.setProperty('--app-card-shadow', theme.components.cardShadow);

  // Set dark/light class attribute for global cascade
  if (theme.isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}
