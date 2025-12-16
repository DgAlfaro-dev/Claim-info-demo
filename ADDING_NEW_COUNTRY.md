## Procedure to add a new country

This document describes the formal process to add a new country to the system. The goal is to extend capabilities without modifying the core, preserving the plugin architecture, package isolation, and functional stability of existing countries.

Each country is implemented as an independent library under `libs/extensions/<country>/` that exports a `CountryConfig`. The application registers this configuration at runtime using `CountryConfigFactory`.

### 1. Architecture overview

The project follows a **Feature-Sliced Design** (FSD) architecture with three main library types:

#### 1.1 Package structure

```
libs/
  ├── core/                          (@claim-info-demo/core)
  │   └── src/
  │       └── shared/                 Shared infrastructure only
  │           ├── components/         (BaseModal, AlertBanner)
  │           └── constants/          (PROJECT_NAME)
  │
  ├── core/                          (@claim-info-demo/core) - Includes country-config and claim-info features
  │   └── src/                        ClaimInfo business logic
  │       ├── components/             (GeneralClaimInformation, etc.)
  │       ├── context/                (CountryConfigContext)
  │       ├── extensionPoints/        (Pipeline architecture)
  │       ├── factory/                (CountryConfigFactory)
  │       ├── hooks/                  (useSubmitClaim, etc.)
  │       ├── registry/               (Extension registries)
  │       ├── store/                  (Zustand store)
  │       ├── types/                  (All type definitions)
  │       └── utils/                  (Helper functions)
  │
  └── extensions/
      ├── costa-rica/                (@claim-info-demo/costa-rica)
      │   └── src/features/           Feature-based organization
      │       ├── country-config/
      │       └── claim-submission/
      │
      └── panama/                    (@claim-info-demo/panama)
          └── src/features/
              ├── country-config/
              ├── claim-submission/
              ├── tax-id/             Custom feature
              └── insurance-zone/     Custom feature
```

#### 1.2 Scope and premises

1) **`@claim-info-demo/core`** provides only shared infrastructure components (modals, banners, constants) used across all features.

2) **`@claim-info-demo/core`** contains all ClaimInfo business logic organized in features: 
   - **country-config**: types (`CountryConfig`, `FieldOverridesMap`, `SupportedCountry`), extension registries, factory, and context
   - **claim-info**: domain types (`ClaimInfoData`), constants, configurations, and store

3) **Extensions** (`@claim-info-demo/<country>`) implement country-specific configurations without modifying core or claim-info code. Integration occurs at the application layer via explicit registration.

4) Country configurations are lazily loaded and cached until explicitly cleared.

### 2. Declare the country in claim-info library

Add the country code to `libs/claim-info/src/types/countryConfig.ts` within the `SupportedCountry` enum. Use ISO‑3166 alpha‑2 codes (uppercase):

```ts
export enum SupportedCountry {
  COSTA_RICA = 'CR',
  PANAMA = 'PA',
  EL_SALVADOR = 'SV' // example
}
```

No additional changes to the claim-info library are required.

### 3. Create the extension library

Generate a new library under `libs/extensions/` using the Nx generator. The following command scaffolds the extension project:

```powershell
pnpm nx g @nx/js:lib el-salvador --directory=extensions --bundler=tsc --unitTestRunner=jest
```

Update the extension `package.json` with the recommended package name and `peerDependencies` relationships:

```json
{
  "name": "@claim-info-demo/el-salvador",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.js",
  "types": "./src/index.d.ts",
  "dependencies": { "tslib": "^2.3.0" },
  "peerDependencies": {
    "@claim-info-demo/core": "workspace:*",
    "@claim-info-demo/core": "workspace:*"
  }
}
```

> **Note:** Extensions depend on both `claim-info` (for ClaimInfo types and utilities) and `core` (for shared infrastructure components).

### 4. Configure TypeScript path alias

Declare the import alias for the new extension in `tsconfig.base.json` to avoid deep relative paths:

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@claim-info-demo/core": ["libs/core/src/index.ts"],
      "@claim-info-demo/core": ["libs/core/src/index.ts"],
      "@claim-info-demo/el-salvador": [
        "libs/extensions/el-salvador/src/index.ts"
      ]
    }
  }
}
```

The workspace already tracks `libs/extensions/*` in `pnpm-workspace.yaml`.

### 5. Implement the country extension

Place source code under `libs/extensions/<country>/src/` with the following **Feature-Sliced Design** structure:

```
src/
  index.ts                                    (exports CountryConfig)
  features/
    country-config/                           (country metadata & overrides)
      index.ts
      config/
        fieldOverrides.ts                     (fixed field overrides)
      store/
        storeExtension.ts                     (optional: Zustand slice)
    claim-submission/                         (submit pipeline extensions)
      index.ts
      submitExtensions/
        preValidators.ts                      (pre-submit validation)
        payloadMutators.ts                    (transform payload)
        postHandlers.ts                       (post-submit actions)
      validations/
        validators.ts                         (validation utilities)
        globalValidations.ts                  (global validations)
    <custom-feature>/                         (e.g., tax-id, insurance-zone)
      index.ts
      components/                             (React components)
        <FeatureComponent>.tsx
        <FeatureModal>.tsx
      config/
        dynamicField.ts                       (dynamic field definition)
      validations/
        validators.ts                         (feature validators)
```

> **Note:** Each feature folder (`country-config/`, `claim-submission/`, custom features) contains its own `index.ts` that re-exports all public APIs from that feature.

5.1. `index.ts`. Export a complete `CountryConfig` object by importing from features. Example:

```ts
import { CountryConfig, SupportedCountry } from '@claim-info-demo/core';
import { 
  elSalvadorFieldOverrides, 
  elSalvadorStoreExtension 
} from './features/country-config';
import { elSalvadorValidations } from './features/claim-submission/validations/globalValidations';
import {
  validateElSalvadorDui,
  validateElSalvadorNit,
} from './features/claim-submission/submitExtensions/preValidators';
import {
  addElSalvadorMetadata,
  normalizeElSalvadorIds,
} from './features/claim-submission/submitExtensions/payloadMutators';
import {
  logElSalvadorSubmit,
  sendToRegulator,
} from './features/claim-submission/submitExtensions/postHandlers';

export const elSalvadorConfig: CountryConfig = {
  countryCode: SupportedCountry.EL_SALVADOR,
  countryName: 'El Salvador',
  fieldOverrides: elSalvadorFieldOverrides,
  dynamicFields: [
    // Add dynamic fields here if needed
  ],
  storeExtension: elSalvadorStoreExtension,
  globalValidations: elSalvadorValidations,
  submitExtensions: {
    preValidators: [validateElSalvadorDui, validateElSalvadorNit],
    payloadMutators: [addElSalvadorMetadata, normalizeElSalvadorIds],
    postHandlers: [logElSalvadorSubmit, sendToRegulator],
  },
};

// Re-export features
export * from './features/country-config';
export * from './features/claim-submission';
```

> **Important:** All country configuration types and extensibility features are exported from `@claim-info-demo/core`, which contains both the country-config and claim-info features organized using Feature Sliced Design.

5.2. Fixed field overrides (`features/country-config/config/fieldOverrides.ts`). Declare only the properties that differ from core defaults. Example:

```ts
import { FixedFieldId, FieldOverridesMap } from '@claim-info-demo/core';

export const elSalvadorFieldOverrides: FieldOverridesMap = {
  [FixedFieldId.POLICY_OWNER_RUC]: {
    label: 'DUI / NIT',
    helperText: 'e.g., 01234567-8 / 0614-250786-102-3',
  },
  [FixedFieldId.VEHICLE_PLATE]: {
    label: 'Plate',
    helperText: 'e.g., P123-456',
  },
};
```

5.3. Dynamic fields (`config/dynamicFields.ts`, optional). When additional fields are needed beyond core, define `DynamicFieldDefinition` and specify section and position:

```ts
import { DynamicFieldDefinition } from '@claim-info-demo/core';

export const elSalvadorDynamicFields: DynamicFieldDefinition[] = [];
```

If specific components are required, place them under `components/` and reference them in the field definition.

5.4. Store extension (`store/storeExtension.ts`, optional). For country‑specific state and actions, declare `initialState` and `actions`. Functions receive `(set, get, ...args)` and are composed automatically into the main store without changing the core:

```ts
export const elSalvadorStoreExtension = {
  initialState: { svHasSpecialTax: false },
  actions: {
    setSvSpecialTax: (set: any, get: any, has: boolean) => {
      set({ svHasSpecialTax: has });
    },
  },
};
```

5.5. Validations (`validations/*`). Centralize global rules in `globalValidations.ts` and utilities in `validators.ts`. Minimal example:

```ts
// validators.ts
export const isValidSvDui = (value: string): boolean => /\d{8}-\d{1}/.test(value);

// globalValidations.ts
import { isValidSvDui } from './validators';

export const elSalvadorValidations = {
  validateBeforeSubmit: (data: any) => {
    const errors: Record<string, string> = {};
    const dui = data?.policy?.Owner?.ruc;
    if (dui && !isValidSvDui(dui)) {
      errors['policyOwnerRuc'] = 'Invalid DUI for El Salvador';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  },
};
```

At load time, the core merges overrides with defaults and registers both dynamic fields and the store extension into their registries.

### 6. Build

Build the core first, then the extension, to ensure extension tests can resolve the compiled core where needed:

```powershell
pnpm nx build core
pnpm nx build el-salvador
```

### 7. Register the extension in the application

The application must register the extension before use. Register it, for example, in `apps/claim-info-demo/src/app/page.tsx` or the application bootstrap:

```ts
import { CountryConfigFactory, SupportedCountry } from '@claim-info-demo/core';
import { elSalvadorConfig } from '@claim-info-demo/extension-el-salvador';

CountryConfigFactory.registerCountryExtension(
  SupportedCountry.EL_SALVADOR,
  async () => elSalvadorConfig
);
```

If the UI allows country selection, add the new `SupportedCountry` option accordingly.

### 8. Run and verify

Once registered, selecting the country triggers lazy configuration loading, dynamic field registration in `dynamicFieldsRegistry`, store slice composition via `storeExtensionRegistry`, and resolved field configuration for rendering (defaults + overrides).

To verify behavior at runtime:

```powershell
pnpm nx dev claim-info-demo
```

### 9. Testing

Extensions use Jest for testing. To resolve `@claim-info-demo/core` to compiled artifacts, use a `jest.config.cts` equivalent to other extensions, including a `moduleNameMapper` pointing to `dist/libs/core/src/index.js`. Ensure the core is built before running extension tests.

Recommended execution:

```powershell
pnpm nx test core
pnpm nx test el-salvador
```

### 10. Design considerations and good practices

– Keep the core immutable; country‑specific variations belong in the extension.

– Use consistent ISO codes in `SupportedCountry` and throughout registration and selection.

– Prefer overrides over duplicating configurations. Overrides are merged property‑by‑property with core defaults.

– Limit store action complexity to country‑specific logic; avoid non‑deterministic side effects.

– Encapsulate UI components for dynamic fields under `components/` and reference them from `dynamicFields.ts` as needed.

– Centralize validations under `validations/` and add unit tests with each new rule.

### 11. Common issues and resolution

If you see “No extension registered for country: XX”, confirm the country is declared in `SupportedCountry` and that the application invoked `CountryConfigFactory.registerCountryExtension` with the correct code.

If overrides are not reflected in the UI, ensure `fieldOverrides` is defined in `CountryConfig` and that `CountryConfigProvider` has loaded the country.

If store actions are not available at runtime, verify the extension exports `storeExtension` with the expected shape (`initialState` and `actions`) and that country loading completed successfully.

If tests do not resolve `@claim-info-demo/core`, build the core first and check the extension Jest `moduleNameMapper` configuration.

### 12. Completion criteria

The work is complete when the country is declared in `SupportedCountry`; the extension library builds without warnings; `index.ts` exports a coherent `CountryConfig`; overrides, dynamic fields, and store extensions (if any) apply at runtime; the application registers the extension and allows selecting the country; and relevant tests run successfully.

