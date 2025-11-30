## Procedure to add a new country

This document describes the formal process to add a new country to the system. The goal is to extend capabilities without modifying the core, preserving the plugin architecture, package isolation, and functional stability of existing countries.

Each country is implemented as an independent library under `libs/extensions/<country>/` that exports a `CountryConfig`. The application registers this configuration at runtime using `CountryConfigFactory`.

### 1. Scope and premises

1) The core defines contracts: types (`CountryConfig`, `FieldOverridesMap`, `DynamicFieldDefinition`, etc.), the supported countries enum (`SupportedCountry`), and the extension registries (`dynamicFieldsRegistry`, `storeExtensionRegistry`).

2) Each country implements its configuration without introducing dependencies on the application or modifying core code. Integration occurs at the application layer via explicit registration.

3) Country configuration is lazily loaded and cached until explicitly cleared.

### 2. Declare the country in the core

Add the country code to `libs/core/src/core/claimInfo/types/countryConfig.ts` within the `SupportedCountry` enum. Use ISO‑3166 alpha‑2 codes (uppercase):

```ts
export enum SupportedCountry {
  COSTA_RICA = 'CR',
  PANAMA = 'PA',
  EL_SALVADOR = 'SV' // example
}
```

No additional changes to the core are required.

### 3. Create the extension library

Generate a new library under `libs/extensions/` using the Nx generator. The following command scaffolds the extension project:

```powershell
pnpm nx g @nx/js:lib el-salvador --directory=extensions --bundler=tsc --unitTestRunner=jest
```

Update the extension `package.json` with the recommended package name and `peerDependencies` relationship with the core:

```json
{
  "name": "@claim-info-demo/extension-el-salvador",
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

### 4. Configure TypeScript path alias

Declare the import alias for the new extension in `tsconfig.base.json` to avoid deep relative paths:

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@claim-info-demo/extension-el-salvador": [
        "libs/extensions/el-salvador/src/index.ts"
      ]
    }
  }
}
```

The workspace already tracks `libs/extensions/*` in `pnpm-workspace.yaml`.

### 5. Implement the country extension

Place source code under `libs/extensions/<country>/src/` with the following structure:

```
src/
  index.ts                     (exports CountryConfig)
  config/
    fieldOverrides.ts          (fixed field overrides)
    dynamicFields.ts           (optional: dynamic fields)
  store/
    storeExtension.ts          (optional: Zustand slice)
  validations/
    validators.ts              (validation utilities)
    globalValidations.ts       (global validations)
  components/                  (optional: dynamic field components)
```

5.1. `index.ts`. Export a complete `CountryConfig` object. Example:

```ts
import { CountryConfig, SupportedCountry } from '@claim-info-demo/core';
import { elSalvadorFieldOverrides } from './config/fieldOverrides';
import { elSalvadorDynamicFields } from './config/dynamicFields';
import { elSalvadorStoreExtension } from './store/storeExtension';
import { elSalvadorValidations } from './validations/globalValidations';

export const elSalvadorConfig: CountryConfig = {
  countryCode: SupportedCountry.EL_SALVADOR,
  countryName: 'El Salvador',
  fieldOverrides: elSalvadorFieldOverrides,
  dynamicFields: elSalvadorDynamicFields,
  storeExtension: elSalvadorStoreExtension,
  globalValidations: elSalvadorValidations,
};
```

5.2. Fixed field overrides (`config/fieldOverrides.ts`). Declare only the properties that differ from core defaults. Example:

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

