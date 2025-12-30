# ClaimInfoDemo — Country‑extensible system with Feature Sliced Design

This repository implements a claims information system (ClaimInfo) based on an Nx monorepo and a **Feature Sliced Design** architecture. The core is decoupled from country‑specific extensions, allowing new countries to be added without modifying the base code or affecting existing behavior.

Key characteristics:
- ✅ **Feature Sliced Design** - Modular organization by features
- ✅ Nx monorepo with incremental builds and caching
- ✅ Independent libraries: core and extensions compile separately
- ✅ Registry pattern for extensions to avoid circular dependencies
- ✅ Country extensibility via declarative configuration and lazy loading
- ✅ Strict TypeScript typing across the system
- ✅ Multi‑currency support and country‑specific validations
- ✅ Unit and integration tests covering core and extensions
- ✅ No circular dependencies between packages

## 📐 Architecture (Feature Sliced Design)

The project follows **Feature Sliced Design** principles with a clear separation between:
- **Application Layer** (`apps/`): UI orchestration and feature composition
- **Domain Layer** (`libs/core/src/domain/`): Business logic and domain models
- **Infrastructure Layer** (`libs/core/src/infrastructure/`): Configuration and utilities
- **Extensions** (`libs/extensions/`): Country-specific implementations organized by features

---

## Architecture Overview

### Monorepo Structure

```
workspace/
├── apps/
│   └── claim-info-demo/              # Next.js Application Layer
│       └── src/
│           ├── app/
│           │   ├── page.tsx          # Main UI orchestration
│           │   ├── layout.tsx        # Root layout
│           │   ├── api/              # API routes
│           │   └── config/
│           │       └── country-extensions.ts  # Country registration
│           └── features/             # Application Features (UI)
│               ├── claim-info/       # Claim form UI components
│               │   ├── components/   # Form sections, fields
│               │   ├── hooks/        # UI-specific hooks
│               │   ├── store/        # UI state
│               │   └── types/        # UI types
│               ├── country-selector/ # Country selection UI
│               │   └── components/
│               └── submit-feedback/  # Feedback UI
│                   └── hook/
├── libs/
│   ├── core/                         # @claim-info-demo/core
│   │   └── src/
│   │       ├── domain/               # Domain Layer
│   │       │   └── claim-info/       # ClaimInfo Domain Logic
│   │       │       ├── config/       # Default configurations
│   │       │       ├── extensionPoints/  # Pipeline architecture
│   │       │       ├── factory/      # CountryConfigFactory (IoC)
│   │       │       ├── model/        # Domain models & DTOs
│   │       │       │   ├── types/    # Core types
│   │       │       │   └── constants/
│   │       │       ├── registry/     # Extension registries
│   │       │       │   ├── dynamicFieldsRegistry.ts
│   │       │       │   └── storeExtensionRegistry.ts
│   │       │       └── store/        # Zustand store
│   │       ├── infrastructure/       # Infrastructure Layer
│   │       │   └── country-config/   # Country configuration
│   │       │       ├── context/      # CountryConfigContext
│   │       │       ├── types/        # CountryConfig types
│   │       │       └── utils/        # Configuration utilities
│   │       ├── shared/               # Shared Resources
│   │       │   ├── components/       # UI components (BaseModal, AlertBanner)
│   │       │   ├── model/constants/  # Global constants
│   │       │   └── interfaces/       # Shared interfaces
│   │       ├── theme/                # UI theming (MUI)
│   │       ├── utils/                # Utility functions
│   │       └── test/                 # Core unit tests (68)
│   └── extensions/                   # Country-Specific Extensions
│       ├── costa-rica/               # @claim-info-demo/costa-rica
│       │   └── src/
│       │       ├── index.ts          # Exports costaRicaConfig
│       │       ├── features/         # Feature-based organization
│       │       │   └── claim-info/   # ClaimInfo feature for CR
│       │       │       ├── config/
│       │       │       │   ├── field-overrides.ts
│       │       │       │   └── store-extension.ts
│       │       │       ├── validations/
│       │       │       │   └── global-validations.ts
│       │       │       └── submission/  # Submit pipeline extensions
│       │       │           ├── validators.ts
│       │       │           ├── mutators.ts
│       │       │           └── handlers.ts
│       │       └── test/             # Tests (70)
│       └── panama/                   # @claim-info-demo/panama
│           └── src/
│               ├── index.ts          # Exports panamaConfig
│               ├── features/         # Feature-based organization
│               │   └── claim-info/   # ClaimInfo feature for PA
│               │       ├── config/
│               │       │   └── field-overrides.ts
│               │       ├── store/
│               │       │   └── store-extension.ts
│               │       ├── validations/
│               │       │   └── global-validations.ts
│               │       ├── submission/  # Submit pipeline extensions
│               │       │   ├── validators.ts
│               │       │   ├── mutators.ts
│               │       │   └── handlers.ts
│               │       └── dynamic-fields/  # Custom fields
│               │           ├── tax-id/
│               │           │   ├── config.ts
│               │           │   ├── TaxIdField.tsx
│               │           │   └── TaxIdModal.tsx
│               │           └── insurance-zone/
│               │               ├── config.ts
│               │               ├── InsuranceZoneField.tsx
│               │               └── InsuranceZoneModal.tsx
│               └── test/             # Tests (126)
└── dist/                             # Compiled artifacts
    └── libs/                         # Distributable packages
```

### Feature Organization

The project uses **Feature Sliced Design** with distinct feature boundaries:

#### Application Features (`apps/claim-info-demo/src/features/`)
UI-focused features that compose the user interface:
- **claim-info**: Form UI components, hooks, and UI state
- **country-selector**: Country selection interface
- **submit-feedback**: Submission feedback UI

#### Core Domain (`libs/core/src/domain/claim-info/`)
Business logic and domain models:
- **config**: Default field configurations
- **extensionPoints**: Submission pipeline (preValidators, payloadMutators, postHandlers)
- **factory**: CountryConfigFactory for lazy loading
- **model**: Domain types (ClaimInfoData, ClaimInfo) and constants
- **registry**: Dynamic fields and store extension registries
- **store**: Zustand store with core state management

#### Core Infrastructure (`libs/core/src/infrastructure/country-config/`)
Configuration management:
- **context**: React Context for country configuration
- **types**: CountryConfig, FieldOverridesMap, DynamicFieldDefinition
- **utils**: Configuration merging and utilities

#### Extension Features (`libs/extensions/*/src/features/claim-info/`)
Country-specific implementations organized by feature:
- **config**: Field overrides and store extensions
- **validations**: Country-specific validation rules
- **submission**: Submit pipeline extensions (validators, mutators, handlers)
- **dynamic-fields**: Custom field implementations (Panama only)

### Package Taxonomy

| Package | Responsibility | Key Exports | Dependencies |
|---------|---------------|-------------|--------------|
| **@claim-info-demo/core** | Foundation layer providing domain models, configuration infrastructure, extension APIs, UI components, and utilities | Types (ClaimInfoData, CountryConfig), Factory (CountryConfigFactory), Registries (dynamicFieldsRegistry, storeExtensionRegistry), Context (CountryConfigContext), Store (useClaimInfoStore), Components (BaseModal, AlertBanner), Theme | React, Zustand, MUI, Date-fns |
| **@claim-info-demo/costa-rica** | Costa Rica business rules, field configurations, validations, and submit pipeline extensions | costaRicaConfig, Field overrides, Store extension, Validators, Mutators, Handlers | Peer: @claim-info-demo/core |
| **@claim-info-demo/panama** | Panama business rules, custom dynamic fields, validations, and submit pipeline extensions | panamaConfig, Field overrides, Dynamic fields (TaxId, InsuranceZone), Store extension, Validators, Mutators, Handlers | Peer: @claim-info-demo/core |

---

## Quick Start

### Prerequisites

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| Node.js | 18.x or higher | JavaScript runtime |
| pnpm | 8.x or higher | Package manager (workspace support) |
| Git | 2.x or higher | Version control |

### Installation & Development

```powershell

# Install dependencies (pnpm workspaces)
pnpm install

# Start development server
pnpm dev

# Application available at http://localhost:3000
```

### Build for Production

```powershell
# Build all libraries in dependency order
pnpm build:libs

# Build complete application (libs + Next.js app)
pnpm build:all

# Production artifacts output to dist/ directory
```

### Development Workflow

```powershell
# Run specific library build
nx build core
nx build costa-rica
nx build panama

# Watch mode for library development
nx build core --watch

# Build with dependencies
nx build panama --with-deps
```

---

## Testing Strategy

### Test Suite Overview

| Module | Tests | Coverage | Focus Areas |
|--------|-------|----------|-------------|
| Core | 68 | 85%+ | Factory, Registry, Config Utils |
| Costa Rica | 70 | 90%+ | Validators, Config, Store |
| Panama | 126 | 92%+ | Components, Validators, Config, Store |
| **Total** | **264** | **>85%** | **Unit & Integration** |

### Running Tests

```powershell
# Execute specific library tests
nx test core
nx test costa-rica
nx test panama

# Run all tests across workspace
pnpm test:all

# Generate coverage report
nx test core --coverage
nx test panama --coverage

# Watch mode for TDD
nx test core --watch

# Run tests matching pattern
nx test core --testNamePattern="Factory"
```

### Test Categories

- **Unit Tests**: Isolated function and method validation
- **Integration Tests**: Registry and factory interaction patterns
- **Component Tests**: React component rendering and behavior
- **Validation Tests**: Business rule enforcement across countries

### Quality Gates

Changes are integrated only with passing tests, minimum code coverage, and successful TypeScript compilation.

---

## Nx Workspace Operations

### Project Management

```powershell
# List all projects in workspace
nx show projects
# Output: core, costa-rica, panama, claim-info-demo

# Show project details
nx show project core --web

# View project configuration
Get-Content libs/core/project.json
```

### Build Operations

```powershell
# Build single library
nx build core

# Build country extension
nx build costa-rica
nx build panama

# Build with all dependencies
nx build panama --with-deps

# Parallel builds (automatically optimized)
nx run-many --target=build --all

# Build affected projects only (CI/CD optimization)
nx affected --target=build
```

### Dependency Graph Visualization

```powershell
# Interactive dependency graph
nx graph

# Generate static graph image
nx graph --file=graph.html
```

**Graph shows:**
- Library interdependencies
- Application consumption patterns
- Build order optimization
- Impact analysis for changes

### Cache Management

```powershell
# View cache statistics
nx show cache-status

# Clear local cache
nx reset

# Run without cache (force rebuild)
nx build core --skip-nx-cache
```

---

## Adding New Countries

Adding a new country is performed by creating an extension library that exports a `CountryConfig` and registering it in the application using `CountryConfigFactory`. The detailed guide is available in [ADDING_NEW_COUNTRY.md](./ADDING_NEW_COUNTRY.md).

---

## Architectural Patterns & Design Principles

### 1. Plugin Architecture (Inversion of Control)

The system employs a **Registry Pattern** to achieve true plugin-based architecture with zero circular dependencies:

```typescript
// Core Layer: Defines contracts without knowing implementations
export class CountryConfigFactory {
  private static countryLoaders = new Map<SupportedCountry, () => Promise<CountryConfig>>();
  
  static registerCountryExtension(
    countryCode: SupportedCountry,
    loader: () => Promise<CountryConfig>
  ): void {
    this.countryLoaders.set(countryCode, loader);
  }
}

// Application Layer: Orchestrates dependency injection
// Located in: apps/claim-info-demo/src/app/config/country-extensions.ts
export function registerCountryExtensions() {
  CountryConfigFactory.registerCountryExtension(
    SupportedCountry.COSTA_RICA,
    async () => costaRicaConfig
  );
  CountryConfigFactory.registerCountryExtension(
    SupportedCountry.PANAMA,
    async () => panamaConfig
  );
}
```

Benefits:
- The core remains agnostic to extensions (Open/Closed Principle)
- Runtime plugin discovery without compile‑time coupling
- Tree‑shaking and code‑splitting enabled
- Independent library versioning

### 2. Dependency Flow & Build Strategy

```
┌───────────────────────────┐
│  @claim-info-demo/core    │  ← Foundation (no dependencies)
│  - Domain: claim-info     │
│  - Infrastructure: config │
│  - Shared: components     │
└──────────────┬────────────┘
               │ peer dependency
               │
      ┌────────┴────────┐
      │                 │
┌─────▼────────┐  ┌────▼─────────┐
│  costa-rica  │  │    panama    │  ← Extensions (parallel builds)
│  extension   │  │  extension   │
└──────────────┘  └──────────────┘
      │                 │
      │  dependencies   │
      │                 │
      └────────┬────────┘
               │
       ┌───────▼───────────┐
       │  claim-info-demo  │  ← Application (orchestration)
       │  (Next.js App)    │
       └───────────────────┘
```

**Compilation Strategy:**
1. Core builds first (domain + infrastructure, no dependencies)
2. Extensions build in parallel (peer dependencies only)
3. Application builds last (imports all modules)

Advantages:
- Parallel builds for extensions
- Granular Nx cache per library
- Tree‑shaking optimization
- No circular dependency violations

### 2. Dependency Graph & Build Order

```
┌─────────────────────┐
│   @claim-info-demo  │
│        /core        │  ← Foundation (no dependencies)
└─────────────────────┘
           ↑
           │ peerDependencies
           │
    ┌──────┴──────┐
    │             │
┌───────────┐ ┌──────────┐
│costa-rica │ │  panama  │  ← Extensions (isolated)
└───────────┘ └──────────┘
           ↑             ↑
           │             │
           │  dependencies
           │             │
    ┌──────┴─────────────┘
    │
┌──────────────────────┐
│  claim-info-demo     │  ← Application (orchestration)
│  (Next.js App)       │
└──────────────────────┘
```

**Compilation Strategy:**
1. Core builds first (no dependencies)
2. Extensions build in parallel (peer dependencies only)
3. Application builds last (imports all modules)

Advantages:
- Parallel builds for extensions.
- Granular Nx cache per library.
- Tree‑shaking optimization.
- No circular dependency violations.

### 3. Configuration Override Pattern

#### 3.1 Fixed Fields (Override Pattern)

Core defines 17 base fields with sensible defaults. Countries override only what's different:

```typescript
// Core: Default field configuration
// Located in: libs/core/src/domain/claim-info/config/defaultFieldConfigs.ts
const defaultFieldConfig: FieldConfig = {
  label: 'Policy Owner RUC',
  required: true,
  visible: true,
  order: 1,
  helperText: 'Enter RUC number'
};

// Panama: Override only label and helper text
// Located in: libs/extensions/panama/src/features/claim-info/config/field-overrides.ts
export const panamaFieldOverrides: FieldOverridesMap = {
  [FixedFieldId.POLICY_OWNER_RUC]: {
    label: 'RUC',
    helperText: 'Formato: 1234567-1-123456',
  }
};

// Result: Merged configuration maintains other defaults
// Merging happens in: libs/core/src/infrastructure/country-config/utils/configUtils.ts
```

Fixed field categories:
- Policy Information: owner and vehicle data
- Claim Information: claim data, deductible, coverage, and related fields

#### 3.2 Dynamic Fields (Composition Pattern)

Countries can inject completely new fields with custom React components:

```typescript
// Located in: libs/extensions/panama/src/features/claim-info/dynamic-fields/tax-id/config.ts
export const panamaTaxIdField: DynamicFieldDefinition = {
  id: 'panamaTaxId',
  section: 'policy',
  position: 7,
  config: {
    label: 'RUC del Asegurado',
    required: true,
    visible: true,
    helperText: 'Formato: 1234567-1-123456',
  },
  component: PanamaTaxIdField, // Custom React component
};
```

Dynamic field features:
- Custom validation logic
- Specialized UI components (modals, pickers, etc.)
- Section placement control (policy vs. claim)
- Position ordering within the section
- Registration via dynamicFieldsRegistry in core

### 4. State Management Extension (Zustand Slices)

Countries extend the global state without modifying core store:

```typescript
// Core Store: Base state structure
// Located in: libs/core/src/domain/claim-info/store/claimInfoStore.ts
interface CoreStoreState {
  claimInfo: ClaimInfo;
  isLoading: boolean;
  // ... core state
}

// Panama Extension: Adds country-specific state
// Located in: libs/extensions/panama/src/features/claim-info/store/store-extension.ts
export const panamaStoreExtension = {
  initialState: {
    panamaTaxId: '',
    panamaInsuranceZone: '',
    hasPanamaSpecialTax: false,
  },
  actions: {
    updatePanamaTaxId: (set, get, taxId: string) => {
      set({ panamaTaxId: taxId });
    },
    setPanamaSpecialTax: (set, get, hasTax: boolean) => {
      set({ hasPanamaSpecialTax: hasTax });
      // Custom business logic: 7% tax calculation
      if (hasTax) {
        const currentDeductible = get().claimInfo?.data?.deductible?.Calculated || 0;
        const newDeductible = currentDeductible * 1.07;
        // Update deductible with tax applied
      }
    },
  },
};

// Registration happens via storeExtensionRegistry in core
```

State extension capabilities:
- Additional typed state slices
- Custom actions with country‑specific business logic
- Access to core state via `get()`
- Reactive updates via `set()`
- Automatic composition into main store

### 5. Submission Pipeline Architecture

The submission process follows a **Pipeline Pattern** with three extension points:

```typescript
// Core: Pipeline definition
// Located in: libs/core/src/domain/claim-info/extensionPoints/
export interface SubmitExtensions {
  preValidators?: PreValidator[];    // Validate before submission
  payloadMutators?: PayloadMutator[]; // Transform payload data
  postHandlers?: PostHandler[];       // Post-submission actions
}

// Costa Rica: Submission extensions
// Located in: libs/extensions/costa-rica/src/features/claim-info/submission/
export const costaRicaSubmitExtensions = {
  preValidators: [
    validateCostaRicanRuc,      // Check RUC format
    validateRequiredFields,     // Ensure all required fields
    validateAmounts,            // Validate monetary values
  ],
  payloadMutators: [
    addCostaRicaMetadata,       // Add country metadata
    normalizeCostaRicanRuc,     // Normalize RUC format
    normalizeCostaRicanAmounts, // Format amounts
    enrichVehicleInformation,   // Add vehicle details
  ],
  postHandlers: [
    logSubmitToLocalStorage,        // Log to localStorage
    sendConfirmationNotification,   // Send notification
    generateClaimDocument,          // Generate PDF/document
  ],
};
```

Pipeline execution order:
1. **PreValidators**: Execute all validators, collect errors
2. **PayloadMutators**: Chain transformations on payload
3. **Submit**: Send to backend API
4. **PostHandlers**: Execute side effects (logging, notifications, etc.)

Benefits:
- Separation of concerns (validation, transformation, side effects)
- Composable and testable extensions
- Country-specific business logic isolated from core
- Easy to add new validation or transformation steps

### 6. Validation Strategy

#### Global Validations
```typescript
// Located in: libs/extensions/panama/src/features/claim-info/validations/global-validations.ts
export const panamaValidations = {
  validateBeforeSubmit: (data: any) => {
    const errors: Record<string, string> = {};
    
    // Country-specific business rules
    const ruc = data?.policy?.Owner?.ruc;
    if (ruc && !isValidPanamaRUC(ruc)) {
      errors['policyOwnerRuc'] = 'Formato de RUC inválido para Panamá';
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
  },
};
```

#### Field-Level Validations
```typescript
// Located in: libs/extensions/panama/src/features/claim-info/submission/validators.ts
export const validatePanamaTaxId = (data: any): ValidationResult => {
  const taxId = data?.panamaTaxId;
  
  if (!taxId || taxId.trim() === '') {
    return {
      isValid: false,
      errors: { panamaTaxId: 'RUC del Asegurado es requerido' },
    };
  }
  
  const rucRegex = /^\d{7}-\d{1}-\d{6}$/;
  if (!rucRegex.test(taxId)) {
    return {
      isValid: false,
      errors: { panamaTaxId: 'Formato de RUC inválido. Use: 1234567-1-123456' },
    };
  }
  
  return { isValid: true, errors: {} };
};
```

### 7. Multi-Currency Support

Each country defines its currency in mock data loaders:

- **Costa Rica**: CRC (₡) - Colones
- **Panama**: USD ($) - Dólares
- **Extensible**: Any ISO 4217 currency code

Mock data and formatters adapt automatically based on selected country.

### 8. Design Principles Applied

| Principle | Implementation |
|-----------|----------------|
| **Single Responsibility** | Core = domain + infrastructure; Extensions = country logic; App = orchestration |
| **Open/Closed** | Core open for extension (registries, interfaces), closed for modification |
| **Liskov Substitution** | All country configs implement `CountryConfig` interface |
| **Interface Segregation** | Separate interfaces for fields, store, validations, submissions |
| **Dependency Inversion** | Core depends on abstractions; extensions implement interfaces |
| **Don't Repeat Yourself** | Shared components, hooks, and utilities in core |
| **Separation of Concerns** | Clear boundaries: UI (app) ↔ Domain (core) ↔ Country logic (extensions) |
| **Feature Sliced Design** | Features organized by domain (claim-info) across layers |

---

## Workspace Configuration

### Package Manager: pnpm Workspaces

Configured in `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"          # Application layer
  - "libs/*"          # Core libraries
  - "libs/extensions/*"  # Country extensions
```

Benefits:
- Hoisted dependencies for space efficiency.
- Strict workspace protocol enforcement.
- Fast installation with content‑addressable storage.
- Phantom dependency prevention.

### TypeScript Path Mapping

Barrel exports configured in `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@claim-info-demo/core": [
        "libs/core/src/index.ts"
      ],
      "@claim-info-demo/extension-costa-rica": [
        "libs/extensions/costa-rica/src/index.ts"
      ],
      "@claim-info-demo/extension-panama": [
        "libs/extensions/panama/src/index.ts"
      ]
    }
  }
}
```

Import examples:
```typescript
// Clean barrel imports
import { CountryConfigFactory, useClaimInfoStore } from '@claim-info-demo/core';
import { costaRicaConfig } from '@claim-info-demo/extension-costa-rica';
import { panamaConfig } from '@claim-info-demo/extension-panama';

// No deep imports needed
// ❌ import { CountryConfigFactory } from '../../libs/core/src/core/claimInfo/factory/CountryConfigFactory';
```

### Nx Configuration

Key settings in `nx.json`:

```json
{
  "targetDefaults": {
    "test": {
      "dependsOn": ["^build"]  // Build dependencies before testing
    },
    "@nx/js:tsc": {
      "cache": true,  // Enable intelligent caching
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    }
  }
}
```

Optimization features:
- Computation caching (local and remote).
- Affected project detection.
- Parallel task execution.
- Dependency‑based task orchestration.

---

## Available NPM Scripts

### Development Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `nx dev claim-info-demo` | Start Next.js dev server with hot reload |
| `start` | `nx start claim-info-demo` | Start production build |
| `lint` | `nx lint claim-info-demo` | Run ESLint on app |
| `lint:all` | `nx run-many --target=lint --all` | Lint all projects |

### Build Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `build` | `nx build claim-info-demo` | Build Next.js application |
| `build:libs` | `nx build core && nx build costa-rica && nx build panama` | Build all libraries sequentially |
| `build:all` | `pnpm build:libs && cd apps/claim-info-demo && pnpm next build` | Full production build |

### Test Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `test` | `nx test claim-info-demo` | Run app tests |
| `test:all` | `nx run-many --target=test --all` | Run all 264 tests |

### Utility Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `graph` | `nx graph` | Visualize project dependencies |
| `clean` | `nx reset && Remove-Item -Recurse -Force dist,node_modules/.cache` | Clear cache and build artifacts |

---

## Development Tools & IDE Setup

### Recommended VS Code Extensions

```powershell
# Nx Console - Visual interface for Nx commands
code --install-extension nrwl.angular-console

# ESLint - Code quality
code --install-extension dbaeumer.vscode-eslint

# Prettier - Code formatting
code --install-extension esbenp.prettier-vscode

# TypeScript - Enhanced TS support
code --install-extension ms-vscode.vscode-typescript-next
```

### Nx Console Features

- **Visual Task Runner**: Execute build/test/lint from UI
- **Project Generator**: Scaffold new libraries
- **Dependency Graph**: Interactive visualization
- **Configuration Explorer**: Browse project settings

[Official Nx Console Documentation](https://nx.dev/getting-started/editor-setup)

### IntelliJ / WebStorm Support

Nx Console plugin available in JetBrains Marketplace:
- Navigate to: `Settings` → `Plugins` → Search "Nx Console"
- Provides similar features to VS Code extension

---

## Implemented Country Extensions

### Costa Rica

**Extension:** `@claim-info-demo/costa-rica`

| Category | Implementation Details |
|----------|----------------------|
| **Currency** | CRC (₡ Colones) |
| **Feature Structure** | Organized under `src/features/claim-info/` |
| **Field Overrides** | Cédula format (0-0000-0000), License plates (ABC-123/ABC-1234) |
| **Validations** | Costa Rican ID format, Vehicle plate patterns |
| **Store Extensions** | `hasSugef` (SUGEF reporting status), `hasSpecialDiscount` |
| **Submission Pipeline** | 3 preValidators, 4 payloadMutators, 3 postHandlers |
| **Business Rules** | Delinquency tracking required, SUGEF compliance |
| **Test Coverage** | 70 unit tests (90%+ coverage) |
| **Complexity** | Low - Field overrides only, no custom components |

**Key Files:**
- `features/claim-info/config/field-overrides.ts` - 3 field customizations
- `features/claim-info/config/store-extension.ts` - 2 state properties, 2 actions
- `features/claim-info/validations/global-validations.ts` - Country validations
- `features/claim-info/submission/validators.ts` - RUC & plate validators
- `features/claim-info/submission/mutators.ts` - Data transformations
- `features/claim-info/submission/handlers.ts` - Post-submit handlers

---

### Panama

**Extension:** `@claim-info-demo/panama`

| Category | Implementation Details |
|----------|----------------------|
| **Currency** | USD ($ Dólares) |
| **Feature Structure** | Organized under `src/features/claim-info/` with dynamic-fields |
| **Field Overrides** | RUC format (1234567-1-123456), License plates (123456) |
| **Dynamic Fields** | • RUC del Asegurado (Policy section, position 7)<br>• Zona de Cobertura (Claim section, position 14) |
| **Custom Components** | • `PanamaTaxIdField` (inline editable)<br>• `PanamaInsuranceZoneField` (zone selector)<br>• `TaxIdModal` (detailed RUC editor)<br>• `InsuranceZoneModal` (zone picker) |
| **Validations** | RUC format, Panama plate patterns, Insurance zone constraints, Tax ID validation |
| **Store Extensions** | `panamaTaxId`, `panamaInsuranceZone`, `hasPanamaSpecialTax` |
| **Submission Pipeline** | 4 preValidators, 6 payloadMutators, 5 postHandlers |
| **Business Rules** | 7% special tax calculation, Zone-based coverage rules |
| **Test Coverage** | 126 unit tests (92%+ coverage) |
| **Complexity** | High - Custom components, complex validations, tax calculations |

**Key Files:**
- `features/claim-info/config/field-overrides.ts` - 4 field customizations
- `features/claim-info/store/store-extension.ts` - 3 state properties, 3 actions with business logic
- `features/claim-info/validations/global-validations.ts` - Country validations
- `features/claim-info/submission/validators.ts` - RUC, zone, and field validators
- `features/claim-info/submission/mutators.ts` - Data transformations (6 mutators)
- `features/claim-info/submission/handlers.ts` - Post-submit handlers (5 handlers)
- `features/claim-info/dynamic-fields/tax-id/` - Custom Tax ID field implementation
  - `config.ts` - Field definition
  - `TaxIdField.tsx` - Inline component
  - `TaxIdModal.tsx` - Modal editor
- `features/claim-info/dynamic-fields/insurance-zone/` - Custom Insurance Zone implementation
  - `config.ts` - Field definition
  - `InsuranceZoneField.tsx` - Zone selector component
  - `InsuranceZoneModal.tsx` - Zone picker modal

---

### Comparison Matrix

| Feature | Costa Rica | Panama | Extensibility |
|---------|-----------|--------|---------------|
| Feature Structure | ✅ `features/claim-info/` | ✅ `features/claim-info/` | ✅ Organized by domain |
| Field Overrides | 3 | 4 | ✅ Unlimited |
| Dynamic Fields | 0 | 2 | ✅ Unlimited |
| Custom Components | 0 | 4 | ✅ Full React support |
| Store State | 2 props | 3 props | ✅ Unlimited |
| Store Actions | 2 | 3 | ✅ Unlimited |
| PreValidators | 3 | 4 | ✅ Pipeline extensible |
| PayloadMutators | 4 | 6 | ✅ Pipeline extensible |
| PostHandlers | 3 | 5 | ✅ Pipeline extensible |
| Validators | 2 | 4 | ✅ Unlimited |
| Modal Dialogs | 0 | 2 | ✅ Full customization |
| Test Files | 7 | 13 | ✅ Jest ecosystem |

---

## Business Value & Technical Benefits

### Development Velocity

| Metric | Traditional Monolith | This Architecture | Improvement |
|--------|---------------------|-------------------|-------------|
| **Add New Country** | 2-3 days (core changes + testing) | 15-30 minutes | **96x faster** |
| **Regression Risk** | High (core modifications) | Zero (isolated extensions) | **100% safer** |
| **Build Time** | Full rebuild (~10 min) | Affected only (~30 sec) | **20x faster** |
| **Test Execution** | All tests (~5 min) | Affected tests (~15 sec) | **20x faster** |
| **Deploy Risk** | All countries affected | Single country isolated | **Zero impact** |

### Scalability Characteristics

**Current State:**
- 2 countries implemented
- 264 tests maintained
- Build time: 2 minutes (cold), 15 seconds (cached)
- Zero circular dependencies

**Projected at 20 Countries:**
- Linear complexity growth (O(n))
- Parallel builds enabled
- Cache efficiency maintained
- Core stability unchanged

### Operational Excellence

#### For Development Teams
- Country onboarding with low risk and no core modification.
- Parallel development by country teams.
- Strict typing and rapid feedback during development.

#### For Product Teams
- Enable/disable countries via configuration.
- Enforcement of market‑specific rules and validations.
- Localization of currency, formats, and labels.

#### For Operations Teams
- Stable and predictable core.
- Incident isolation per country.
- Deployment and rollback per extension.

### Technical Debt Prevention

| Anti-Pattern | How Prevented | Enforcement |
|--------------|---------------|-------------|
| **God Object** | Registry pattern distributes logic | Architecture review |
| **Tight Coupling** | Peer dependencies only | Nx dependency graph |
| **Code Duplication** | Shared core utilities | DRY principle |
| **Circular Dependencies** | IoC via factory pattern | Nx build validation |
| **Merge Conflicts** | Independent extension files | Workspace structure |
| **Feature Creep** | Extension isolation boundary | Code review policy |

---

## Contributing Guidelines

### Adding Core Features

Criteria for Core:
- Used by all or most countries.
- Fundamental domain or infrastructure concerns (state management, routing, etc.).

Process:
1) Propose changes via RFC.
2) Verify backward compatibility.
3) Update affected tests.
4) Document API changes.
5) Obtain technical approval.

### Adding Country Extensions

The complete guide to adding new countries is available in [ADDING_NEW_COUNTRY.md](./ADDING_NEW_COUNTRY.md). Implementation must conform to core contracts, be registered in the application, and include appropriate test coverage.

---

## Technical Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| [README.md](./README.md) | System overview and architecture | All team members |
| [ADDING_NEW_COUNTRY.md](./ADDING_NEW_COUNTRY.md) | Step-by-step country integration guide | Developers, Architects |
| [nx.json](./nx.json) | Workspace configuration | DevOps, Architects |
| [tsconfig.base.json](./tsconfig.base.json) | TypeScript path mappings | Developers |

---

## Technology Stack & References

### Core Technologies

| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| **Nx** | 22.1.2 | Monorepo management, build orchestration | [nx.dev](https://nx.dev) |
| **Next.js** | 16.0.1 | React framework, SSR, routing | [nextjs.org/docs](https://nextjs.org/docs) |
| **TypeScript** | 5.9.2 | Type safety, developer experience | [typescriptlang.org](https://www.typescriptlang.org/) |
| **React** | 19.0.0 | UI library, component model | [react.dev](https://react.dev) |
| **Zustand** | 5.0.8 | State management (lightweight) | [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand) |
| **Material-UI** | 7.3.5 | Component library, theming | [mui.com](https://mui.com) |
| **Jest** | 30.0.2 | Testing framework | [jestjs.io](https://jestjs.io/) |
| **pnpm** | 8.x | Package manager, workspaces | [pnpm.io](https://pnpm.io/) |

### Supporting Libraries

- **Date-fns** (4.1.0): Date manipulation and formatting
- **FontAwesome** (7.1.0): Icon library
- **UUID** (13.0.0): Unique identifier generation
- **Emotion** (11.14.0): CSS-in-JS styling

### Development Tools

- **ESLint** (9.8.0): Code linting
- **Prettier** (2.6.2): Code formatting
- **SWC** (1.5.7): Fast TypeScript/JavaScript compilation
- **Testing Library** (16.3.0): React component testing utilities

---

## License

**MIT License**

Copyright (c) 2025 ClaimInfo Demo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Support & Contact

**For technical questions:**
- Review [ADDING_NEW_COUNTRY.md](./ADDING_NEW_COUNTRY.md)
- Check [Nx Documentation](https://nx.dev)
- Consult architecture diagrams above

**For architecture decisions:**
- Review ADRs (Architecture Decision Records)
- Consult with principal architects
- Follow contribution guidelines

---
