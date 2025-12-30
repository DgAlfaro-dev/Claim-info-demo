## Procedure to add a new country

This document describes the formal process to add a new country to the system. The goal is to extend capabilities without modifying the core, preserving the plugin architecture, package isolation, and functional stability of existing countries.

Each country is implemented as an independent library under `libs/extensions/<country>/` that exports a `CountryConfig`. The application registers this configuration at runtime using `CountryConfigFactory`. The project follows **Feature Sliced Design** principles with clear separation between domain logic, infrastructure, and country-specific implementations.

### 1. Architecture overview

The project follows a **Feature-Sliced Design** (FSD) architecture with three main layers:

#### 1.1 Package structure

```
libs/
  ├── core/                          (@claim-info-demo/core)
  │   └── src/
  │       ├── domain/                 Domain Layer
  │       │   └── claim-info/         ClaimInfo business logic
  │       │       ├── config/         Default field configurations
  │       │       ├── extensionPoints/ Pipeline architecture (preValidators, mutators, handlers)
  │       │       ├── factory/        CountryConfigFactory (IoC container)
  │       │       ├── model/          Domain types & constants
  │       │       ├── registry/       Extension registries (fields, store)
  │       │       └── store/          Zustand state management
  │       │
  │       ├── infrastructure/         Infrastructure Layer
  │       │   └── country-config/     Country configuration management
  │       │       ├── context/        CountryConfigContext provider
  │       │       ├── types/          CountryConfig, FieldOverridesMap, etc.
  │       │       └── utils/          Configuration merging utilities
  │       │
  │       └── shared/                 Shared Resources
  │           ├── components/         BaseModal, AlertBanner
  │           ├── model/constants/    Global constants
  │           └── interfaces/         Shared interfaces
  │
  └── extensions/
      ├── costa-rica/                (@claim-info-demo/costa-rica)
      │   └── src/
      │       ├── index.ts            Exports costaRicaConfig
      │       └── features/           Feature-based organization
      │           └── claim-info/     ClaimInfo feature for Costa Rica
      │               ├── config/
      │               │   ├── field-overrides.ts
      │               │   └── store-extension.ts
      │               ├── validations/
      │               │   └── global-validations.ts
      │               └── submission/  Submit pipeline extensions
      │                   ├── validators.ts
      │                   ├── mutators.ts
      │                   └── handlers.ts
      │
      └── panama/                    (@claim-info-demo/panama)
          └── src/
              ├── index.ts            Exports panamaConfig
              └── features/           Feature-based organization
                  └── claim-info/     ClaimInfo feature for Panama
                      ├── config/
                      │   └── field-overrides.ts
                      ├── store/
                      │   └── store-extension.ts
                      ├── validations/
                      │   └── global-validations.ts
                      ├── submission/  Submit pipeline extensions
                      │   ├── validators.ts
                      │   ├── mutators.ts
                      │   └── handlers.ts
                      └── dynamic-fields/  Custom field implementations
                          ├── tax-id/
                          │   ├── config.ts
                          │   ├── TaxIdField.tsx
                          │   └── TaxIdModal.tsx
                          └── insurance-zone/
                              ├── config.ts
                              ├── InsuranceZoneField.tsx
                              └── InsuranceZoneModal.tsx
```

#### 1.2 Scope and premises

1) **`@claim-info-demo/core`** provides:
   - **Domain layer**: ClaimInfo business logic, types, configurations, extension points, registries, factory, and store
   - **Infrastructure layer**: Country configuration management (types, context, utilities)
   - **Shared layer**: Reusable components, constants, and interfaces used across features

2) **Extensions** (`@claim-info-demo/<country>`) implement country-specific configurations organized by **features**:
   - Each extension has a `features/claim-info/` folder containing all ClaimInfo-related customizations
   - Within each feature: `config/`, `validations/`, `submission/`, and optionally `dynamic-fields/` or `store/`
   - Integration occurs at the application layer via explicit registration using `CountryConfigFactory`

3) **Feature Sliced Design principles**:
   - Features are organized by domain (claim-info) rather than by technical layer
   - Each feature contains all its related code: config, validations, submission logic, components
   - Clear boundaries between core domain logic and country-specific implementations
   - No circular dependencies between packages

4) Country configurations are lazily loaded and cached until explicitly cleared.

### 2. Declare the country in core domain

Add the country code to the `SupportedCountry` enum in the core domain layer. Use ISO‑3166 alpha‑2 codes (uppercase):

**File:** `libs/core/src/infrastructure/country-config/types/countryConfig.ts`

```ts
export enum SupportedCountry {
  COSTA_RICA = 'CR',
  PANAMA = 'PA',
  EL_SALVADOR = 'SV' // example
}
```

No additional changes to the core library are required.

### 3. Create the extension library

Generate a new library under `libs/extensions/` using the Nx generator. The following command scaffolds the extension project:

```powershell
pnpm nx g @nx/js:lib el-salvador --directory=extensions --bundler=tsc --unitTestRunner=jest
```

Update the extension `package.json` with the recommended package name and `peerDependencies`:

```json
{
  "name": "@claim-info-demo/el-salvador",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.js",
  "types": "./src/index.d.ts",
  "dependencies": { "tslib": "^2.3.0" },
  "peerDependencies": {
    "@claim-info-demo/core": "workspace:*"
  }
}
```

> **Note:** Extensions depend only on `@claim-info-demo/core`, which contains all domain logic (claim-info), infrastructure (country-config), and shared resources.

### 4. Configure TypeScript path alias

Declare the import alias for the new extension in `tsconfig.base.json` to avoid deep relative paths:

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@claim-info-demo/core": ["libs/core/src/index.ts"],
      "@claim-info-demo/costa-rica": ["libs/extensions/costa-rica/src/index.ts"],
      "@claim-info-demo/panama": ["libs/extensions/panama/src/index.ts"],
      "@claim-info-demo/el-salvador": ["libs/extensions/el-salvador/src/index.ts"]
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
    claim-info/                               (ClaimInfo feature for the country)
      index.ts                                (re-exports all public APIs)
      config/
        field-overrides.ts                    (fixed field overrides)
        store-extension.ts                    (optional: Zustand state slice)
      validations/
        global-validations.ts                 (country-level validation rules)
      submission/                             (submit pipeline extensions)
        validators.ts                         (preValidators - validate before submit)
        mutators.ts                           (payloadMutators - transform payload)
        handlers.ts                           (postHandlers - post-submit actions)
      dynamic-fields/                         (optional: custom field implementations)
        <field-name>/
          config.ts                           (DynamicFieldDefinition)
          <FieldName>Field.tsx                (inline field component)
          <FieldName>Modal.tsx                (optional: modal editor)
      store/                                  (alternative location for store extension)
        store-extension.ts
  test/                                       (unit tests)
```

> **Important:** All features are organized under `features/claim-info/` to maintain consistency with Feature Sliced Design principles. Each feature contains all its related code: configuration, validations, submission logic, and custom components.

#### 5.1. Main entry point (`index.ts`)

Export a complete `CountryConfig` object by importing from the claim-info feature:

```ts
import { CountryConfig, SupportedCountry } from '@claim-info-demo/core';
import {
  elSalvadorFieldOverrides,
  elSalvadorStoreExtension,
  elSalvadorValidations,
  validateElSalvadorDui,
  validateElSalvadorNit,
  validateRequiredFields,
  validateAmounts,
  addElSalvadorMetadata,
  normalizeElSalvadorIds,
  enrichVehicleInformation,
  logElSalvadorSubmit,
  sendToRegulator,
  generateDocument,
} from './features/claim-info';

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
    preValidators: [
      validateElSalvadorDui,
      validateElSalvadorNit,
      validateRequiredFields,
      validateAmounts,
    ],
    payloadMutators: [
      addElSalvadorMetadata,
      normalizeElSalvadorIds,
      enrichVehicleInformation,
    ],
    postHandlers: [
      logElSalvadorSubmit,
      sendToRegulator,
      generateDocument,
    ],
  },
};

// Re-export features
export * from './features/claim-info';
```

> **Note:** All types (`CountryConfig`, `SupportedCountry`, `FieldOverridesMap`, `DynamicFieldDefinition`, etc.) are exported from `@claim-info-demo/core`.

#### 5.2. Feature entry point (`features/claim-info/index.ts`)

Re-export all public APIs from the feature:

```ts
// Config
export { elSalvadorFieldOverrides } from './config/field-overrides';
export { elSalvadorStoreExtension } from './config/store-extension';

// Validations
export { elSalvadorValidations } from './validations/global-validations';

// Submission
export {
  validateElSalvadorDui,
  validateElSalvadorNit,
  validateRequiredFields,
  validateAmounts,
} from './submission/validators';

export {
  addElSalvadorMetadata,
  normalizeElSalvadorIds,
  enrichVehicleInformation,
} from './submission/mutators';

export {
  logElSalvadorSubmit,
  sendToRegulator,
  generateDocument,
} from './submission/handlers';

// Dynamic fields (if any)
// export { elSalvadorCustomField } from './dynamic-fields/custom-field/config';
```

#### 5.3. Fixed field overrides (`features/claim-info/config/field-overrides.ts`)

Declare only the properties that differ from core defaults:

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

The core merges these overrides with default configurations at load time using the configuration utilities in `libs/core/src/infrastructure/country-config/utils/configUtils.ts`.

#### 5.4. Store extension (`features/claim-info/config/store-extension.ts` or `features/claim-info/store/store-extension.ts`)

For country‑specific state and actions, declare `initialState` and `actions`. Functions receive `(set, get, ...args)` and are composed automatically into the main store:

```ts
export const elSalvadorStoreExtension = {
  initialState: {
    svHasSpecialTax: false,
    svDelinquencyStatus: 'current',
  },
  actions: {
    setSvSpecialTax: (set: any, get: any, has: boolean) => {
      set({ svHasSpecialTax: has });
    },
    updateSvDelinquencyStatus: (set: any, get: any, status: string) => {
      set({ svDelinquencyStatus: status });
    },
  },
};
```

The store extension is automatically registered via `storeExtensionRegistry` in the core when the country configuration is loaded.

#### 5.5. Global validations (`features/claim-info/validations/global-validations.ts`)

Centralize country-level validation rules:

```ts
import { isValidSvDui, isValidSvNit } from './validators';

export const elSalvadorValidations = {
  validateBeforeSubmit: (data: any) => {
    const errors: Record<string, string> = {};
    
    const dui = data?.policy?.Owner?.ruc;
    if (dui && !isValidSvDui(dui)) {
      errors['policyOwnerRuc'] = 'Invalid DUI format for El Salvador';
    }
    
    const nit = data?.svNit;
    if (nit && !isValidSvNit(nit)) {
      errors['svNit'] = 'Invalid NIT format for El Salvador';
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
  },
};
```

#### 5.6. Submission pipeline extensions (`features/claim-info/submission/`)

The submission pipeline consists of three extension points:

**validators.ts** - PreValidators (validate before submission):
```ts
import { ValidationResult } from '@claim-info-demo/core';

export const validateElSalvadorDui = (data: any): ValidationResult => {
  const dui = data?.policy?.Owner?.ruc;
  
  if (!dui || dui.trim() === '') {
    return {
      isValid: false,
      errors: { policyOwnerRuc: 'DUI is required' },
    };
  }
  
  const duiRegex = /^\d{8}-\d{1}$/;
  if (!duiRegex.test(dui)) {
    return {
      isValid: false,
      errors: { policyOwnerRuc: 'Invalid DUI format. Use: 01234567-8' },
    };
  }
  
  return { isValid: true, errors: {} };
};

export const validateElSalvadorNit = (data: any): ValidationResult => {
  // Similar validation logic
};

export const validateRequiredFields = (data: any): ValidationResult => {
  // Validate all required fields
};

export const validateAmounts = (data: any): ValidationResult => {
  // Validate monetary amounts
};
```

**mutators.ts** - PayloadMutators (transform payload):
```ts
export const addElSalvadorMetadata = (data: any): any => {
  return {
    ...data,
    metadata: {
      ...data.metadata,
      country: 'SV',
      timestamp: new Date().toISOString(),
      regulatoryBody: 'SSF', // Superintendencia del Sistema Financiero
    },
  };
};

export const normalizeElSalvadorIds = (data: any): any => {
  return {
    ...data,
    policy: {
      ...data.policy,
      Owner: {
        ...data.policy?.Owner,
        ruc: data.policy?.Owner?.ruc?.trim().toUpperCase(),
      },
    },
  };
};

export const enrichVehicleInformation = (data: any): any => {
  // Add additional vehicle information
};
```

**handlers.ts** - PostHandlers (post-submission actions):
```ts
export const logElSalvadorSubmit = async (data: any, response: any): Promise<void> => {
  console.log('[El Salvador] Claim submitted:', {
    claimNumber: data.claimNumber,
    timestamp: new Date().toISOString(),
    status: response.status,
  });
};

export const sendToRegulator = async (data: any, response: any): Promise<void> => {
  // Send notification to regulatory body (SSF)
  console.log('[El Salvador] Sending regulatory notification...');
};

export const generateDocument = async (data: any, response: any): Promise<void> => {
  // Generate claim document
  console.log('[El Salvador] Generating claim document...');
};
```

#### 5.7. Dynamic fields (`features/claim-info/dynamic-fields/`, optional)

When additional fields are needed beyond core fixed fields, create a dynamic field implementation:

**Structure:**
```
dynamic-fields/
  <field-name>/
    config.ts                    (DynamicFieldDefinition)
    <FieldName>Field.tsx         (inline field component)
    <FieldName>Modal.tsx         (optional: modal editor)
```

**Example - config.ts:**
```ts
import { DynamicFieldDefinition } from '@claim-info-demo/core';
import { ElSalvadorNitField } from './ElSalvadorNitField';

export const elSalvadorNitField: DynamicFieldDefinition = {
  id: 'elSalvadorNit',
  section: 'policy',
  position: 8,
  config: {
    label: 'NIT (Tax ID)',
    required: true,
    visible: true,
    helperText: 'e.g., 0614-250786-102-3',
  },
  component: ElSalvadorNitField,
};
```

**Example - ElSalvadorNitField.tsx:**
```tsx
import React from 'react';
import { TextField } from '@mui/material';
import { DynamicFieldComponentProps } from '@claim-info-demo/core';

export const ElSalvadorNitField: React.FC<DynamicFieldComponentProps> = ({
  value,
  onChange,
  error,
  helperText,
  config,
}) => {
  return (
    <TextField
      fullWidth
      label={config.label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error || helperText}
      required={config.required}
      placeholder="0614-250786-102-3"
    />
  );
};
```

Then, in your main `index.ts`, add the dynamic field to the configuration:

```ts
import { elSalvadorNitField } from './features/claim-info/dynamic-fields/nit/config';

export const elSalvadorConfig: CountryConfig = {
  // ... other config
  dynamicFields: [elSalvadorNitField],
  // ...
};
```

### 6. Build

Build the core first, then the extension, to ensure extension tests can resolve the compiled core where needed:

```powershell
pnpm nx build core
pnpm nx build el-salvador
```

### 7. Register the extension in the application

The application must register the extension before use. This is done in the application layer:

**File:** `apps/claim-info-demo/src/app/config/country-extensions.ts`

```ts
import { CountryConfigFactory, SupportedCountry } from '@claim-info-demo/core';
import { costaRicaConfig } from '@claim-info-demo/costa-rica';
import { panamaConfig } from '@claim-info-demo/panama';
import { elSalvadorConfig } from '@claim-info-demo/el-salvador';

/**
 * Register all country extensions
 * Called once at application startup
 */
export function registerCountryExtensions() {
  CountryConfigFactory.registerCountryExtension(
    SupportedCountry.COSTA_RICA,
    async () => costaRicaConfig
  );
  
  CountryConfigFactory.registerCountryExtension(
    SupportedCountry.PANAMA,
    async () => panamaConfig
  );
  
  CountryConfigFactory.registerCountryExtension(
    SupportedCountry.EL_SALVADOR,
    async () => elSalvadorConfig
  );
}
```

This function is called during application bootstrap (typically in the root layout or page component).

If the UI allows country selection, add the new `SupportedCountry` option to the country selector component.

### 8. Run and verify

Once registered, selecting the country triggers:
1. Lazy configuration loading via `CountryConfigFactory`
2. Dynamic field registration in `dynamicFieldsRegistry`
3. Store slice composition via `storeExtensionRegistry`
4. Resolved field configuration for rendering (defaults + overrides merged by `configUtils`)
5. Submission pipeline setup (preValidators, payloadMutators, postHandlers)

To verify behavior at runtime:

```powershell
pnpm nx dev claim-info-demo
# Application available at http://localhost:3000
```

Test the following:
- Country selection loads the correct configuration
- Field overrides are applied correctly
- Dynamic fields appear in the correct section and position
- Store actions are available and work as expected
- Validations execute properly
- Submission pipeline runs in the correct order

### 9. Testing

Extensions use Jest for testing. To resolve `@claim-info-demo/core` imports, ensure your `jest.config.cts` includes a `moduleNameMapper` pointing to the compiled core artifacts:

```typescript
// jest.config.cts
export default {
  displayName: 'el-salvador',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': '@swc/jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/extensions/el-salvador',
  moduleNameMapper: {
    '^@claim-info-demo/core$': '<rootDir>/../../dist/libs/core/src/index.js',
  },
};
```

**Important:** Build the core before running extension tests:

```powershell
pnpm nx build core
pnpm nx test el-salvador
```

**Recommended test structure:**
```
test/
  config/
    field-overrides.spec.ts       (test field overrides)
    store-extension.spec.ts       (test store state and actions)
  validations/
    global-validations.spec.ts    (test validation rules)
    validators.spec.ts            (test validation utilities)
  submission/
    validators.spec.ts            (test preValidators)
    mutators.spec.ts              (test payloadMutators)
    handlers.spec.ts              (test postHandlers)
  dynamic-fields/                 (if applicable)
    <field-name>.spec.ts
```

**Example test - field overrides:**
```ts
import { elSalvadorFieldOverrides } from '../features/claim-info/config/field-overrides';
import { FixedFieldId } from '@claim-info-demo/core';

describe('El Salvador Field Overrides', () => {
  it('should override POLICY_OWNER_RUC label', () => {
    const override = elSalvadorFieldOverrides[FixedFieldId.POLICY_OWNER_RUC];
    expect(override.label).toBe('DUI / NIT');
    expect(override.helperText).toContain('01234567-8');
  });
  
  it('should override VEHICLE_PLATE label', () => {
    const override = elSalvadorFieldOverrides[FixedFieldId.VEHICLE_PLATE];
    expect(override.label).toBe('Plate');
    expect(override.helperText).toContain('P123-456');
  });
});
```

**Example test - validators:**
```ts
import { validateElSalvadorDui } from '../features/claim-info/submission/validators';

describe('El Salvador Validators', () => {
  describe('validateElSalvadorDui', () => {
    it('should validate correct DUI format', () => {
      const data = {
        policy: { Owner: { ruc: '01234567-8' } },
      };
      const result = validateElSalvadorDui(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
    
    it('should reject invalid DUI format', () => {
      const data = {
        policy: { Owner: { ruc: 'invalid' } },
      };
      const result = validateElSalvadorDui(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.policyOwnerRuc).toBeDefined();
    });
    
    it('should reject empty DUI', () => {
      const data = {
        policy: { Owner: { ruc: '' } },
      };
      const result = validateElSalvadorDui(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.policyOwnerRuc).toContain('required');
    });
  });
});
```

### 10. Design considerations and good practices

**Feature Organization:**
– Organize all country-specific code under `features/claim-info/` to maintain consistency with Feature Sliced Design
– Each feature contains all related code: config, validations, submission logic, components
– Use the `index.ts` file in each feature folder to re-export public APIs
– Keep dynamic fields in their own subdirectories under `dynamic-fields/`

**Core Immutability:**
– Keep the core immutable; country‑specific variations belong in extensions only
– Never modify core domain logic, infrastructure, or shared components
– All customization happens through the provided extension points

**Country Codes:**
– Use consistent ISO 3166-1 alpha-2 codes (uppercase) in `SupportedCountry` enum
– Maintain consistency throughout registration, selection, and configuration

**Field Overrides:**
– Prefer overrides over duplicating configurations
– Override only the properties that differ from core defaults
– Overrides are merged property‑by‑property with core defaults using `configUtils`

**State Management:**
– Limit store actions to country‑specific logic
– Avoid non‑deterministic side effects in store actions
– Use `get()` to access current state and `set()` to update state
– Store extensions are automatically composed into the main store

**Dynamic Fields:**
– Encapsulate UI components under `dynamic-fields/<field-name>/`
– Each dynamic field should have its own directory with config, component, and optional modal
– Register dynamic fields in the `dynamicFields` array of `CountryConfig`
– Use `DynamicFieldComponentProps` interface for component props

**Validation:**
– Centralize validation rules under `validations/`
– Separate validation utilities (in `validators.ts`) from validation configuration (in `global-validations.ts`)
– Add unit tests for each validation rule
– Use the submission pipeline for pre-submit validations

**Submission Pipeline:**
– Use `preValidators` for validation before submission (should return `ValidationResult`)
– Use `payloadMutators` for transforming the payload (should return modified data)
– Use `postHandlers` for side effects after submission (logging, notifications, etc.)
– Keep each function focused on a single responsibility
– Chain mutators for complex transformations

**Testing:**
– Write comprehensive unit tests for all custom logic
– Test field overrides, store extensions, validations, and submission pipeline separately
– Ensure core is built before running extension tests
– Use descriptive test names and organize tests by feature
– Aim for >90% code coverage

**Documentation:**
– Document complex business rules and validation logic
– Add JSDoc comments to exported functions and types
– Maintain README.md in the extension library explaining country-specific features

### 11. Common issues and resolution

**Issue: "No extension registered for country: XX"**
- **Cause:** Country not declared in `SupportedCountry` enum or not registered in application
- **Solution:** 
  1. Add country code to `libs/core/src/infrastructure/country-config/types/countryConfig.ts`
  2. Register extension in `apps/claim-info-demo/src/app/config/country-extensions.ts`
  3. Call `registerCountryExtensions()` during application startup

**Issue: Field overrides not reflected in UI**
- **Cause:** Overrides not properly exported or country config not loaded
- **Solution:**
  1. Ensure `fieldOverrides` is exported from `features/claim-info/config/field-overrides.ts`
  2. Verify override is included in `CountryConfig` in main `index.ts`
  3. Check that `CountryConfigProvider` has loaded the country configuration
  4. Verify configuration merging in browser DevTools

**Issue: Store actions not available at runtime**
- **Cause:** Store extension not properly structured or not exported
- **Solution:**
  1. Verify `storeExtension` exports both `initialState` and `actions`
  2. Ensure store extension is included in `CountryConfig`
  3. Check that country loading completed successfully (use DevTools)
  4. Verify action names don't conflict with core store actions

**Issue: Dynamic fields not appearing**
- **Cause:** Fields not registered or incorrect section/position
- **Solution:**
  1. Ensure dynamic field is included in `dynamicFields` array in `CountryConfig`
  2. Verify `section` is either 'policy' or 'claim'
  3. Check `position` doesn't conflict with existing fields
  4. Verify component is properly exported and imported

**Issue: Tests fail with "Cannot find module '@claim-info-demo/core'"**
- **Cause:** Core library not built or `moduleNameMapper` misconfigured
- **Solution:**
  1. Build core first: `pnpm nx build core`
  2. Check `jest.config.cts` has correct `moduleNameMapper`
  3. Verify path in mapper points to `dist/libs/core/src/index.js`
  4. Ensure core build artifacts exist in `dist/` directory

**Issue: Submission pipeline not executing**
- **Cause:** Functions not properly exported or incorrect function signature
- **Solution:**
  1. Verify all validators, mutators, and handlers are exported
  2. Check function signatures match expected types:
     - `PreValidator`: `(data: any) => ValidationResult`
     - `PayloadMutator`: `(data: any) => any`
     - `PostHandler`: `(data: any, response: any) => Promise<void>`
  3. Ensure functions are included in `submitExtensions` in `CountryConfig`

**Issue: Validation errors not displayed**
- **Cause:** Error keys don't match field IDs or validation result format incorrect
- **Solution:**
  1. Ensure error keys match field IDs (e.g., 'policyOwnerRuc' for RUC field)
  2. Return validation result in format: `{ isValid: boolean, errors: Record<string, string> }`
  3. Check that `globalValidations.validateBeforeSubmit` is properly implemented

**Issue: TypeScript errors in extension**
- **Cause:** Type imports from core incorrect or outdated
- **Solution:**
  1. Import types from `@claim-info-demo/core` (not from relative paths)
  2. Rebuild core if types have changed
  3. Check `tsconfig.base.json` has correct path mappings
  4. Restart TypeScript server in VS Code

### 12. Completion criteria

The country extension is complete when:

**Core Integration:**
-  Country is declared in `SupportedCountry` enum in `libs/core/src/infrastructure/country-config/types/countryConfig.ts`
-  Extension is registered in `apps/claim-info-demo/src/app/config/country-extensions.ts`
-  Application allows selecting the country in the UI

**Feature Implementation:**
-  Extension library builds without warnings: `pnpm nx build <country>`
-  Feature structure follows pattern: `src/features/claim-info/` with proper subdirectories
-  Main `index.ts` exports a complete `CountryConfig` object
-  Feature `index.ts` re-exports all public APIs

**Configuration:**
-  Field overrides are defined in `config/field-overrides.ts` and apply at runtime
-  Store extension (if any) is defined with `initialState` and `actions`
-  Dynamic fields (if any) are properly configured with component, section, and position

**Validation & Submission:**
-  Global validations are implemented in `validations/global-validations.ts`
-  Submission pipeline extensions are defined (validators, mutators, handlers)
-  All validators return proper `ValidationResult` format
-  All mutators properly transform payload
-  All handlers execute post-submission logic correctly

**Testing:**
-  Unit tests cover all custom logic (field overrides, validators, mutators, handlers)
-  Tests run successfully: `pnpm nx test <country>`
-  Code coverage meets or exceeds 85%
-  All test files follow recommended structure

**Runtime Verification:**
-  Country selection triggers proper configuration loading
-  Field overrides display correctly in UI
-  Dynamic fields appear in correct section and position
-  Store actions are available and functional
-  Validations execute properly before submission
-  Submission pipeline runs in correct order (validators → mutators → submit → handlers)
-  No console errors or warnings

**Documentation:**
-  Extension README.md documents country-specific features
-  Complex business rules are documented with comments
-  Public APIs have JSDoc comments

**Quality Checklist:**
-  No circular dependencies (verify with `nx graph`)
-  TypeScript compiles without errors
-  ESLint passes without errors
-  All imports use TypeScript path aliases (`@claim-info-demo/*`)
-  Code follows Feature Sliced Design principles
-  Extension is isolated and doesn't modify core code

