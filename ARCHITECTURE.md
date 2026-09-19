# CarePath Architecture & Developer Guide

Welcome to the **CarePath Emergency Operations & Autonomous Routing** system. This guide provides an in-depth breakdown of the component architecture, routing engine, decentralized data fixtures, theming engine, and the pluggable API layer designed for future backend integrations.

---

## 1. Directory & File Structure

```text
/
├── .env.example                     # Environment variables declaration (API Base URLs, Keys)
├── index.html                       # HTML entry point with Inter font & Material Symbols
├── metadata.json                    # Application metadata & permissions
├── package.json                     # Dependencies & build scripts
├── tsconfig.json                    # Strict TypeScript configuration
├── vite.config.ts                   # Vite + Tailwind CSS plugin setup
├── ARCHITECTURE.md                  # Comprehensive architectural reference
├── THEMING.md                       # Quick-reference guide for styling & themes
│
├── src/
│   ├── main.tsx                     # Application bootstrap & DOM root render
│   ├── App.tsx                      # Root shell, routing view switcher, and modal host
│   ├── index.css                    # Tailwind CSS imports & reactive theme variables
│   │
│   ├── types/
│   │   └── index.ts                 # Domain TypeScript interfaces (Incident, Facility, Pathway, etc.)
│   │
│   ├── config/
│   │   ├── theme.ts                 # CENTRAL THEME & APPEARANCE CONFIG (Colors, Radii, Density)
│   │   ├── appConfig.ts             # Central app constants, KPIs, and GIS map configurations
│   │   └── routes.ts                # Declarative route registry & future API contracts
│   │
│   ├── context/
│   │   └── CarePathContext.tsx      # Central state manager, theme injector, & router sync
│   │
│   ├── api/
│   │   ├── apiClient.ts             # Extensible HTTP client supporting Mock vs. Live switching
│   │   └── services/
│   │       ├── incidentService.ts   # Incident fetching, vitals telemetry, & handoffs
│   │       ├── facilityService.ts   # Facility directory, ASV stock, & ICU bed reservations
│   │       ├── routingService.ts    # GPS navigation, replanning triggers, & MDT nav-vectors
│   │       └── auditService.ts      # Immutable operational audit logging & CSV generator
│   │
│   ├── fixtures/                    # Decentralized mock datasets for testing & QA
│   │   ├── incidents.ts             # Incident SB-1042 & test incident collection
│   │   ├── facilities.ts            # Regional hospitals (Hospital A, B, C) with ASV levels
│   │   ├── events.ts                # Chronological telemetry event stream items
│   │   └── pathways.ts              # Ambulance 17 state, pathway stages, & decision trees
│   │
│   └── components/
│       ├── common/
│       │   ├── Header.tsx           # Status bar, incident picker, theme launcher & API inspector
│       │   ├── Sidebar.tsx          # Dynamic route navigation, theme button & Data Engine toggle
│       │   └── Toast.tsx            # Floating transient notification toast
│       │
│       ├── dashboard/
│       │   ├── OperationsDashboard.tsx # Screen 1: Command console, KPIs, & telemetry
│       │   └── TacticalMap.tsx      # Interactive SVG tactical GIS vector map
│       │
│       ├── live/
│       │   └── CarePathLive.tsx     # Screen 2: High-res satellite tracking & sensor gateway
│       │
│       ├── replanning/
│       │   └── ReplanningView.tsx   # Screen 3: Autonomous divergence rerouting console
│       │
│       ├── facilities/
│       │   └── FacilityDirectoryView.tsx # Filterable hospital directory & stock matrix
│       │
│       ├── handoff/
│       │   └── HandoffReportsView.tsx # Pre-arrival reports & immutable CSV audit logs
│       │
│       └── modals/
│           ├── ThemeCustomizerModal.tsx # Interactive theme selector & token previewer
│           ├── WhyPathwayModal.tsx  # Algorithmic decision tree rationale dialog
│           ├── PreArrivalHandoffModal.tsx # Clinical handoff package transmission
│           └── ProvenanceModal.tsx  # Verification chain and decision provenance
```

---

## 2. Centralized Theming & Component Appearance System

You can modify the colors, card styles, corner radii, borders, and density of all components across the entire application from **one single file**:
👉 **`src/config/theme.ts`**

### Key Features:
1. **Four Pre-built Archetype Themes**:
   - **`tactical-dark` (Default)**: Deep obsidian (`#0B0F14`) background with high-contrast tactical HUD accents.
   - **`clinical-light`**: High-contrast, clean medical hospital aesthetic (`#F4F6F9` canvas, crisp white surfaces, sapphire primary, emerald success).
   - **`midnight-sapphire`**: Deep ocean navy (`#060B18`) with electric cyan telemetry overlays.
   - **`stealth-monochrome`**: Neutral graphite and slate for high-glare sunlight or field deployment.
2. **Component Appearance Tokens**:
   - `cardRadius`: Corner curvature of cards across all screens (`'6px'`, `'10px'`, `'12px'`, `'16px'`).
   - `buttonRadius`: Corner radius of interactive buttons and action triggers.
   - `badgeRadius`: Curvature of pills, tags, and status chips.
   - `borderWidth`: Border stroke weight (`'1px'`, `'1.5px'`, `'2px'`).
   - `cardShadow`: Depth and elevation shadow on containers.
   - `density`: Spacing scale (`'compact'` | `'comfortable'` | `'spacious'`).

### How to Change the Appearance from `src/config/theme.ts`:

#### Option A: Change the Default Theme
Change one line at the bottom of `src/config/theme.ts`:
```typescript
// Choose: 'tactical-dark' | 'clinical-light' | 'midnight-sapphire' | 'stealth-monochrome'
export const DEFAULT_THEME_ID: ThemePreset['id'] = 'clinical-light';
```

#### Option B: Customize Specific Colors
Open `src/config/theme.ts` and modify any hex value in the active theme object:
```typescript
export const TACTICAL_DARK_THEME: ThemePreset = {
  ...
  colors: {
    canvasBase: '#0B0F14',       // Main viewport background
    surface: '#0e141d',          // Card & container background
    primary: '#b2c5ff',          // Main brand / highlight color
    statusCritical: '#FF5C6C',   // Red emergency alert color
    tertiary: '#47dfa4',         // Verified / normal status green
    ...
  },
  components: {
    cardRadius: '14px',          // Change all card corners at once!
    buttonRadius: '8px',         // Change all button corners at once!
    borderWidth: '1px',
    ...
  }
};
```

#### Option C: Interactive Live Preview
Users and QA testers can click the **Palette icon** (`Theme`) in the top Header or Sidebar to test and switch between all themes live with zero reloads.

---

## 3. Declarative Routing Engine

CarePath utilizes an extensible, declarative routing configuration located in `src/config/routes.ts`.

### How It Works:
- **URL Synchronization**: Routes are synchronized with browser URL hashes (`#/dashboard`, `#/live`, `#/replanning`, `#/facilities`, `#/handoff`).
- **History & Deep Linking**: Browser forward and backward buttons work naturally via the native `hashchange` event listener in `CarePathContext`. Direct links can be bookmarked or shared.
- **Dynamic Menus**: Navigation components (like `Sidebar.tsx`) automatically map through `APP_ROUTES`.

### How to Add a New Route in 3 Simple Steps:

#### Step 1: Add the route ID to `src/types/index.ts`
```typescript
export type NavigationTab =
  | 'operations-dashboard'
  | 'carepath-live'
  | 'replanning'
  | 'facility-directory'
  | 'handoff-reports'
  | 'analytics-view'; // <--- Your new route ID
```

#### Step 2: Register the route in `src/config/routes.ts`
```typescript
{
  id: 'analytics-view',
  path: '/analytics',
  hash: '#/analytics',
  title: 'Operational Analytics',
  shortLabel: 'Analytics',
  icon: 'monitoring',
  description: 'Regional time-to-treatment metrics and antivenom consumption trends.',
  category: 'analytics',
  futureApiEndpoints: [
    { method: 'GET', endpoint: '/api/v1/analytics/trends', description: 'Monthly envenomation trends' }
  ]
}
```

#### Step 3: Map the component in `src/App.tsx`
```typescript
case 'analytics-view':
  return <AnalyticsView />;
```

---

## 4. Pluggable API Layer & Future Integration

To ensure the application remains modular and ready for real production backends, CarePath separates the UI from data access via **`apiClient`** and **Domain Services**.

### 1. The API Client (`src/api/apiClient.ts`)
The `apiClient` manages HTTP requests (`GET`, `POST`, `PUT`, `DELETE`). It contains:
- **Configurable Base URL**: Defined via `import.meta.env.VITE_API_BASE_URL` (default: `/api/v1`).
- **Mock vs. Live Switching**: Controlled via `import.meta.env.VITE_USE_MOCK_API` or toggled at runtime directly from the UI.
- **Graceful Fallback**: If a network call fails while prototyping, the client can fall back to the fixture data automatically.

### 2. Domain Services (`src/api/services/`)
- **`incidentService.ts`**: Handles incident details, vitals updates, and handoff package transmissions.
- **`facilityService.ts`**: Queries regional hospital stock levels and handles bed reservations.
- **`routingService.ts`**: Connects to the GIS routing engine and pushes nav-vectors to ambulances.
- **`auditService.ts`**: Appends audit logs and formats RFC-4180 CSV exports.

### 3. How to Connect a Real Backend API:
1. In your `.env` or deployment environment:
   ```env
   VITE_API_BASE_URL=https://api.carepath.health/v1
   VITE_USE_MOCK_API=false
   ```
2. Click the **Data / API Engine** toggle in the sidebar (`MOCK FIXTURES` / `LIVE API`).
3. Click the **API Contracts** button in the header to view expected schemas for the current route.

---

## 5. Component Breakdown

| Component | File Path | Purpose |
| :--- | :--- | :--- |
| **`Sidebar`** | `src/components/common/Sidebar.tsx` | Main navigation, active incident snapshot, theme launcher, simulation triggers, and API toggle. |
| **`Header`** | `src/components/common/Header.tsx` | Breadcrumbs, system clock, incident picker, notification center, theme selector, and API inspector. |
| **`OperationsDashboard`** | `src/components/dashboard/OperationsDashboard.tsx` | Command console with KPI cards, pathway timeline, receiving hospital readiness, and telemetry. |
| **`TacticalMap`** | `src/components/dashboard/TacticalMap.tsx` | Vector SVG map rendering real-time route gradients, terrain contours, and GPS waypoint markers. |
| **`CarePathLive`** | `src/components/live/CarePathLive.tsx` | High-resolution satellite tracking view with live sensor gateway and handoff generation. |
| **`ReplanningView`** | `src/components/replanning/ReplanningView.tsx` | Autonomous rerouting console triggered on stockouts with candidate facility comparisons. |
| **`FacilityDirectoryView`** | `src/components/facilities/FacilityDirectoryView.tsx` | Filterable regional hospital directory with real-time ASV vials and bed occupancy. |
| **`HandoffReportsView`** | `src/components/handoff/HandoffReportsView.tsx` | Pre-arrival clinical dispatches and immutable RFC-4180 CSV audit trail export. |
| **`ThemeCustomizerModal`** | `src/components/modals/ThemeCustomizerModal.tsx` | Interactive modal to preview themes, color swatches, and component tokens. |

---

## 6. Build & Verification Commands

```bash
# Verify TypeScript typing and syntax
npm run lint

# Compile production Vite bundle
npm run build
```
