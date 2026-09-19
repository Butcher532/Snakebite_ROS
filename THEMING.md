# CarePath Theming & Styling Manual

CarePath provides a **Single-File Theming and Appearance Engine**. You can adjust colors, contrast, card corner curvature, button styling, borders, and spacing across all 5 screens and modals by editing one file:

👉 **`src/config/theme.ts`**

---

## 1. Quick Start: How to Change the Theme

Open `src/config/theme.ts`. At the bottom of the file, you will find:

```typescript
export const DEFAULT_THEME_ID: ThemePreset['id'] = 'tactical-dark';
```

Change it to any of the 4 pre-configured presets:
- `'tactical-dark'` — Obsidian dark command center HUD (Default)
- `'clinical-light'` — High-contrast clinical medical hospital theme
- `'midnight-sapphire'` — Deep oceanic navy with vivid cyan accents
- `'stealth-monochrome'` — Minimalist graphite tactical slate

Save the file, and the entire interface adapts instantly.

---

## 2. Interactive In-App Theme Switcher

You can test themes interactively inside the running application:
1. Click the **Palette Icon (`Theme`)** in the top **Header** or the **Theme & Style** button in the **Sidebar**.
2. A modal will open displaying color swatches and component token values for each preset.
3. Click any preset to preview the layout, colors, and curvature in real time without refreshing.
4. Your choice is automatically remembered in browser storage.

---

## 3. How to Customize Component Appearance Tokens

Inside each theme in `src/config/theme.ts`, you have full control over component tokens:

```typescript
components: {
  // Corner radius of main cards, telemetry containers, and modals
  cardRadius: '12px',      // Try '4px' (sharp), '12px' (smooth), or '20px' (curved)

  // Corner radius of buttons and interactive controls
  buttonRadius: '8px',     // Try '4px' (boxy) or '9999px' (pill)

  // Corner radius of badges, status indicators, and chips
  badgeRadius: '9999px',   // Pill tags

  // Border stroke width applied to containers
  borderWidth: '1px',      // '1px' or '1.5px'

  // Elevation shadow depth
  cardShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',

  // Density factor
  density: 'comfortable',  // 'compact' | 'comfortable' | 'spacious'

  // Font family
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
}
```

---

## 4. How to Customize Colors

Every theme defines a comprehensive color palette. Modifying any hex color updates all Tailwind utility classes and CSS variables in the app:

| Token Name | Description | Example (Tactical Dark) |
| :--- | :--- | :--- |
| `canvasBase` | Root background of the viewport | `#0B0F14` |
| `surface` | Card background color | `#0e141d` |
| `surfaceSecondary` | Sidebar & header background | `#161D27` |
| `surfaceElevated` | Raised modal and popover background | `#1B2430` |
| `borderSubtle` | Divider and card border stroke | `#26313D` |
| `textPrimary` | Primary high-contrast text | `#F4F7FA` |
| `textSecondary` | Subdued label text | `#A8B3C2` |
| `textMuted` | Timestamps & captions | `#6F7B89` |
| `primary` | Main accent / selection color | `#b2c5ff` |
| `tertiary` | Success / normal telemetry green | `#47dfa4` |
| `statusCritical` | Emergency / alert / stockout red | `#FF5C6C` |
| `statusWarning` | Warning / yellow status | `#F5B942` |

---

## 5. How to Add a Brand New Custom Theme

To create your own custom theme (e.g. "Desert Rescue" or "Nordic Frost"):

1. In `src/config/theme.ts`, define a new `ThemePreset`:
```typescript
export const DESERT_RESCUE_THEME: ThemePreset = {
  id: 'desert-rescue',
  name: 'Desert Rescue',
  description: 'Warm amber and sand tones for arid tactical operations.',
  isDark: true,
  colors: {
    canvasBase: '#120F0C',
    surface: '#1A1612',
    surfaceSecondary: '#241F1A',
    surfaceElevated: '#2E2721',
    surfaceBright: '#473D35',
    surfaceContainer: '#221C16',
    surfaceContainerLow: '#181410',
    surfaceContainerHigh: '#2B231C',
    surfaceContainerHighest: '#3B3026',
    surfaceContainerLowest: '#0F0C0A',
    borderSubtle: '#3A3026',
    textPrimary: '#FFF8F0',
    textSecondary: '#D1C2B4',
    textMuted: '#8C7E72',
    primary: '#F59E0B',
    primaryContainer: '#D97706',
    onPrimary: '#261400',
    onPrimaryContainer: '#261400',
    secondary: '#FB923C',
    secondaryContainer: '#EA580C',
    tertiary: '#10B981',
    tertiaryContainer: '#059669',
    statusCritical: '#EF4444',
    statusWarning: '#FBBF24',
  },
  components: {
    cardRadius: '10px',
    buttonRadius: '6px',
    badgeRadius: '9999px',
    borderWidth: '1px',
    cardShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    density: 'comfortable',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
};
```

2. Register it in `AVAILABLE_THEMES`:
```typescript
export const AVAILABLE_THEMES = {
  'tactical-dark': TACTICAL_DARK_THEME,
  'clinical-light': CLINICAL_LIGHT_THEME,
  'midnight-sapphire': MIDNIGHT_SAPPHIRE_THEME,
  'stealth-monochrome': STEALTH_MONOCHROME_THEME,
  'desert-rescue': DESERT_RESCUE_THEME, // <--- Added!
};
```

3. It will immediately appear in the in-app Theme Switcher modal and can be set as the default with `DEFAULT_THEME_ID = 'desert-rescue'`.
