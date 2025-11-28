# Arquitectura Extensible por País - ClaimInfo

## 📋 Tabla de Contenido

1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Conceptos Clave](#conceptos-clave)
5. [Cómo Funciona](#cómo-funciona)
6. [Agregar un Nuevo País](#agregar-un-nuevo-país)
7. [Ejemplos](#ejemplos)

---

## 🎯 Visión General

Este sistema convierte el feature `claimInfo` en un **módulo central extensible por país**. La arquitectura separa claramente:

- **Core**: Lógica, componentes y flujo base estable que NO cambia cuando se agregan países
- **Extensions**: Comportamientos específicos por país (overrides, campos dinámicos, store extensions)

### Principios de Diseño

✅ **El core permanece inmutable** - No se modifica al agregar nuevos países  
✅ **País como plugin** - Cada país es una extensión independiente  
✅ **Campos fijos performantes** - Se mantienen en código, no son dinámicos  
✅ **Extensibilidad flexible** - Campos dinámicos, overrides y store extensions  
✅ **Lazy loading** - Configuraciones de país se cargan bajo demanda  

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   Application                        │
│              (page.tsx + Provider)                   │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│            CountryConfigFactory                      │
│         (Lazy loading de configs)                    │
└─────────────────────┬───────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
┌────────────────┐         ┌──────────────────┐
│  Core System   │         │   Extensions     │
│                │         │   (por país)     │
│ • Defaults     │         │                  │
│ • Components   │         │ • Overrides      │
│ • Store Base   │         │ • Dynamic Fields │
│ • Registries   │         │ • Store Ext      │
│ • Utils        │         │ • Validations    │
└────────────────┘         └──────────────────┘
         │                         │
         └────────────┬────────────┘
                      ▼
         ┌────────────────────────┐
         │   Resolved Config      │
         │ (defaults + overrides) │
         └────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │     UI Rendering       │
         │ • Fixed Fields         │
         │ • Dynamic Fields       │
         └────────────────────────┘
```

---

## 📁 Estructura de Carpetas

```
src/
├── core/
│   └── claimInfo/
│       ├── types/                         # Tipos base del sistema
│       │   ├── fieldConfig.ts            # FieldConfig, FieldOverrides, etc.
│       │   ├── countryConfig.ts          # CountryConfig, CountryInitializer
│       │   ├── storeExtension.ts         # StoreExtension, StoreSlice
│       │   └── index.ts
│       ├── config/
│       │   └── defaultFieldConfigs.ts    # Defaults de campos fijos
│       ├── registry/
│       │   ├── dynamicFieldsRegistry.ts  # Registro de campos dinámicos
│       │   └── storeExtensionRegistry.ts # Registro de extensiones de store
│       ├── factory/
│       │   └── CountryConfigFactory.ts   # Lazy loading de países
│       ├── context/
│       │   └── CountryConfigContext.tsx  # React Context del país activo
│       ├── utils/
│       │   └── configUtils.ts            # Merge de configs
│       ├── components/                   # Componentes del core
│       │   ├── shared/                   # Componentes reutilizables
│       │   │   ├── StyledComponents.tsx # Componentes estilizados
│       │   │   └── UIComponents.tsx     # ValueText, EditableFieldRow
│       │   ├── GeneralClaimInformation.tsx
│       │   ├── DynamicFieldsRenderer.tsx
│       │   ├── WaiveDeductibleModal.tsx
│       │   ├── DriverGenderModal.tsx
│       │   └── DriverBirthdayModal.tsx
│       ├── hooks/
│       │   └── useGeneralClaimInformation.ts
│       ├── store/
│       │   ├── claimInfoStore.ts         # Store base con extensibilidad
│       │   ├── mockData.ts               # Datos mock para demo
│       │   └── storeActions.ts           # Acciones del store
│       ├── model/                        # Tipos de datos
│       │   ├── types/
│       │   └── constants/
│       ├── lib/
│       │   └── utils.ts
│       └── index.ts                      # Exportaciones del core
│
└── extensions/
    ├── costaRica/
    │   ├── index.ts                      # Config principal
    │   ├── config/
    │   │   └── fieldOverrides.ts        # Overrides de campos
    │   ├── store/
    │   │   └── storeExtension.ts        # Extensión del store
    │   └── validations/
    │       ├── validators.ts            # Funciones de validación
    │       └── globalValidations.ts     # Validaciones globales
    └── panama/
        ├── index.ts                      # Config principal
        ├── config/
        │   ├── fieldOverrides.ts        # Overrides de campos
        │   └── dynamicFields.ts         # Definición de campos dinámicos
        ├── components/
        │   ├── PanamaTaxIdField.tsx     # Campo RUC (inline edit)
        │   ├── PanamaInsuranceZoneField.tsx # Campo zona (modal)
        │   ├── TaxIdModal.tsx           # Modal para RUC
        │   └── InsuranceZoneModal.tsx   # Modal para zona
        ├── store/
        │   └── storeExtension.ts        # Extensión del store
        └── validations/
            ├── validators.ts            # Funciones de validación
            └── globalValidations.ts     # Validaciones globales
```

---

## 💡 Conceptos Clave

### 1. Campos Fijos (Fixed Fields)

Campos que existen en el core y están hardcoded en componentes.

```typescript
enum FixedFieldId {
  POLICY_OWNER_NAME = 'policyOwnerName',
  POLICY_OWNER_RUC = 'policyOwnerRuc',
  VEHICLE_MODEL = 'vehicleModel',
  // ...
}
```

**Cada campo fijo tiene defaults:**
```typescript
[FixedFieldId.POLICY_OWNER_RUC]: {
  label: 'Cédula',
  required: true,
  visible: true,
  order: 2,
}
```

### 2. Overrides de País

Un país puede sobrescribir **solo lo que necesita cambiar**:

```typescript
const panamaFieldOverrides = {
  [FixedFieldId.POLICY_OWNER_RUC]: {
    label: 'RUC',  // Solo cambia el label
    helperText: 'Registro Único de Contribuyente',
  },
  [FixedFieldId.BROKER]: {
    visible: false,  // Oculta este campo
  },
};
```

### 3. Campos Dinámicos

Campos nuevos que un país agrega:

```typescript
const panamaDynamicFields: DynamicFieldDefinition[] = [
  {
    id: 'panamaTaxId',
    section: 'policy',  // 'policy' o 'claim'
    position: 7,
    config: {
      label: 'RUC del Asegurado',
      required: true,
      visible: true,
    },
    component: PanamaTaxIdField,  // Componente React
  },
];
```

### 4. Extensión de Store

Cada país puede agregar state y acciones:

```typescript
const panamaStoreExtension = {
  initialState: {
    panamaTaxId: '',
    panamaInsuranceZone: '',
  },
  actions: {
    updatePanamaTaxId: (set, get, taxId: string) => {
      set({ panamaTaxId: taxId });
    },
  },
};
```

### 5. Validaciones Personalizadas

```typescript
const panamaValidations = {
  validateBeforeSubmit: (data: any) => {
    const errors: Record<string, string> = {};
    
    if (data?.panamaTaxId && !isValidPanamaRuc(data.panamaTaxId)) {
      errors.panamaTaxId = 'Formato de RUC inválido';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
```

---

## ⚙️ Cómo Funciona

### Flujo de Carga

1. **Usuario selecciona país** en el selector
2. **CountryConfigFactory** carga dinámicamente el módulo del país
3. Los **campos dinámicos** se registran en `dynamicFieldsRegistry`
4. Las **extensiones de store** se registran en `storeExtensionRegistry`
5. Los **overrides** se combinan con los **defaults** usando `mergeAllFieldConfigs()`
6. El **resultado resuelto** se pone disponible vía `CountryConfigContext`
7. Los **componentes** renderizan usando las configs resueltas

### Renderizado

**Campos Fijos:**
```tsx
{getFieldConfig(FixedFieldId.POLICY_OWNER_RUC).visible && (
  <CardItem>
    <LabelText>
      {getFieldConfig(FixedFieldId.POLICY_OWNER_RUC).label}
    </LabelText>
    <ValueText>{claimInfoData?.policy?.Owner?.ruc}</ValueText>
  </CardItem>
)}
```

**Campos Dinámicos:**
```tsx
<DynamicFieldsRenderer section="policy" isLoading={isLoading} />
```

---

## 🚀 Agregar un Nuevo País

### Paso 1: Crear carpeta del país

```bash
mkdir src/extensions/miPais
```

### Paso 2: Crear index.ts con la configuración

```typescript
// src/extensions/miPais/index.ts

import { CountryConfig, SupportedCountry, FixedFieldId } from '@/core/claimInfo';

// Overrides (opcional)
const miPaisFieldOverrides = {
  [FixedFieldId.POLICY_OWNER_RUC]: {
    label: 'Identificación Nacional',
  },
};

// Campos dinámicos (opcional)
const miPaisDynamicFields = [
  // Agregar campos si es necesario
];

// Extensión de store (opcional)
const miPaisStoreExtension = {
  initialState: {
    miPaisField: '',
  },
  actions: {
    updateMiPaisField: (set: any, get: any, value: string) => {
      set({ miPaisField: value });
    },
  },
};

// Validaciones (opcional)
const miPaisValidations = {
  validateBeforeSubmit: (data: any) => {
    const errors: Record<string, string> = {};
    // Agregar validaciones
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

export const miPaisConfig: CountryConfig = {
  countryCode: SupportedCountry.MI_PAIS,
  countryName: 'Mi País',
  fieldOverrides: miPaisFieldOverrides,
  dynamicFields: miPaisDynamicFields,
  storeExtension: miPaisStoreExtension,
  globalValidations: miPaisValidations,
};
```

### Paso 3: Agregar a SupportedCountry

```typescript
// src/core/claimInfo/types/countryConfig.ts

export enum SupportedCountry {
  COSTA_RICA = 'CR',
  PANAMA = 'PA',
  MI_PAIS = 'MP',  // ← Agregar aquí
}
```

### Paso 4: Agregar al Factory

```typescript
// src/core/claimInfo/factory/CountryConfigFactory.ts

private static async importCountryModule(countryCode: SupportedCountry) {
  switch (countryCode) {
    case SupportedCountry.COSTA_RICA:
      const crModule = await import('@/extensions/costaRica');
      return crModule.costaRicaConfig;
    
    case SupportedCountry.PANAMA:
      const paModule = await import('@/extensions/panama');
      return paModule.panamaConfig;
    
    case SupportedCountry.MI_PAIS:  // ← Agregar aquí
      const mpModule = await import('@/extensions/miPais');
      return mpModule.miPaisConfig;
    
    default:
      throw new Error(`Unsupported country code: ${countryCode}`);
  }
}
```

### Paso 5: Agregar al selector en page.tsx

```tsx
<MenuItem value={SupportedCountry.MI_PAIS}>
  🏴 Mi País
</MenuItem>
```

**¡Listo!** El nuevo país está integrado sin tocar el core.

---

## 📚 Ejemplos

### Ejemplo 1: Cambiar solo un label

```typescript
// extensions/ejemplo1/index.ts
const ejemplo1Overrides = {
  [FixedFieldId.VEHICLE_PLATE]: {
    label: 'Matrícula del vehículo',  // En lugar de "Nro. de placa"
  },
};

export const ejemplo1Config: CountryConfig = {
  countryCode: SupportedCountry.EJEMPLO1,
  countryName: 'Ejemplo 1',
  fieldOverrides: ejemplo1Overrides,
};
```

### Ejemplo 2: Ocultar campos

```typescript
const ejemplo2Overrides = {
  [FixedFieldId.BROKER]: {
    visible: false,  // No mostrar corredor
  },
  [FixedFieldId.CREDITOR]: {
    visible: false,  // No mostrar acreedor
  },
};
```

### Ejemplo 3: Agregar campo dinámico simple

```typescript
// components/CustomField.tsx
export const CustomField: FC<DynamicFieldComponentProps> = ({
  fieldId,
  config,
  value,
  onChange,
}) => {
  return (
    <TextField
      label={config.label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      required={config.required}
    />
  );
};

// index.ts
const dynamicFields = [
  {
    id: 'customField',
    section: 'claim',
    position: 10,
    config: {
      label: 'Campo Personalizado',
      required: true,
      visible: true,
    },
    component: CustomField,
  },
];
```

### Ejemplo 4: Validación personalizada

```typescript
const customValidations = {
  validateBeforeSubmit: (data: any) => {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    // Validar formato de placa
    const plate = data?.vehicleInformation?.plate;
    if (plate && !/^[A-Z]{2}-\d{4}$/.test(plate)) {
      errors.vehiclePlate = 'La placa debe tener formato XX-1234';
    }

    // Warning sobre depreciación
    const depreciation = data?.vehicleInformation?.depreciation;
    if (depreciation > 50) {
      warnings.depreciation = 'Depreciación muy alta';
    }

    return { isValid: Object.keys(errors).length === 0, errors, warnings };
  },
};
```

---

## 🔧 Utilidades Disponibles

### mergeAllFieldConfigs()

Combina defaults con overrides:

```typescript
import { mergeAllFieldConfigs } from '@/core/claimInfo';

const resolved = mergeAllFieldConfigs(countryOverrides);
```

### getResolvedFieldConfig()

Obtiene config de un campo específico:

```typescript
import { getResolvedFieldConfig, FixedFieldId } from '@/core/claimInfo';

const config = getResolvedFieldConfig(
  FixedFieldId.POLICY_OWNER_RUC,
  countryOverrides
);
```

### useCountryConfigContext()

Hook para acceder a la config del país:

```typescript
const {
  countryConfig,
  currentCountry,
  resolvedFieldConfigs,
  loadCountry,
} = useCountryConfigContext();
```

---

## 🎨 Buenas Prácticas

1. **No modificar el core** - Todo comportamiento específico va en extensions
2. **Overrides mínimos** - Solo sobrescribe lo necesario
3. **Nombres descriptivos** - `panamaTaxId` mejor que `field1`
4. **Validaciones robustas** - Siempre validar formatos específicos del país
5. **Componentes reutilizables** - Los campos dinámicos pueden compartirse entre países
6. **Documentar diferencias** - Explica por qué un país tiene overrides específicos

---

## 📊 Comparación: Antes vs Después

### Antes (Feature monolítico)
- ❌ Cambios por país modificaban el core
- ❌ Difícil mantener múltiples países
- ❌ Lógica mezclada con condicionales
- ❌ Testing complejo

### Después (Core + Extensions)
- ✅ Core estable e inmutable
- ✅ Países aislados e independientes
- ✅ Lazy loading de configuraciones
- ✅ Fácil agregar nuevos países
- ✅ Testing por país separado

---

## 🤝 Contribuir

Para agregar funcionalidad al **core**:
1. Asegúrate que sea común a **todos** los países
2. Mantén compatibilidad hacia atrás
3. Documenta en este README

Para agregar un **nuevo país**:
1. Sigue la guía "Agregar un Nuevo País"
2. Crea tests para validaciones específicas
3. Documenta particularidades del país

---

## 📝 Notas Técnicas

- **Lazy Loading**: Los módulos de país se cargan solo cuando se seleccionan
- **Performance**: Campos fijos permanecen en JSX, no son dinámicos
- **Type Safety**: Todo el sistema está completamente tipado con TypeScript
- **Extensibilidad**: Sin límite en campos dinámicos o extensiones de store
- **Zustand**: El store base se extiende sin re-crear toda la configuración

---

**¿Preguntas?** Consulta el código en `src/core/claimInfo` o revisa los ejemplos en `src/extensions/`.
