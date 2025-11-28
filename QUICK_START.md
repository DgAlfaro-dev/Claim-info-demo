# Guía Rápida: Agregar Nuevo País

## Ejemplo: Agregar Colombia

### 1. Crear archivo de configuración

Crear: `src/extensions/colombia/index.ts`

```typescript
import { CountryConfig, FixedFieldId, SupportedCountry } from '@/core/claimInfo';

// Overrides: Solo cambios necesarios
const colombiaFieldOverrides = {
  [FixedFieldId.POLICY_OWNER_RUC]: {
    label: 'Cédula de Ciudadanía',
    helperText: 'Formato: 1234567890',
  },
  [FixedFieldId.VEHICLE_PLATE]: {
    label: 'Placa',
    helperText: 'Formato: ABC123',
  },
  // Ocultar campos no usados en Colombia
  [FixedFieldId.FRIENDLY_PACT]: {
    visible: false,
  },
};

// Validaciones específicas de Colombia
const colombiaValidations = {
  validateBeforeSubmit: (data: any) => {
    const errors: Record<string, string> = {};
    
    // Validar cédula colombiana (10 dígitos)
    const cedula = data?.policy?.Owner?.ruc;
    if (cedula && !/^\d{10}$/.test(cedula)) {
      errors.policyOwnerRuc = 'La cédula debe tener 10 dígitos';
    }
    
    // Validar placa colombiana (ABC123)
    const plate = data?.vehicleInformation?.plate;
    if (plate && !/^[A-Z]{3}\d{3}$/.test(plate)) {
      errors.vehiclePlate = 'Formato inválido. Use ABC123';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

export const colombiaConfig: CountryConfig = {
  countryCode: SupportedCountry.COLOMBIA,
  countryName: 'Colombia',
  fieldOverrides: colombiaFieldOverrides,
  globalValidations: colombiaValidations,
};
```

### 2. Agregar a tipos

En `src/core/claimInfo/types/countryConfig.ts`:

```typescript
export enum SupportedCountry {
  COSTA_RICA = 'CR',
  PANAMA = 'PA',
  COLOMBIA = 'CO',  // ← Agregar
}
```

### 3. Registrar en Factory

En `src/core/claimInfo/factory/CountryConfigFactory.ts`:

```typescript
private static async importCountryModule(countryCode: SupportedCountry) {
  switch (countryCode) {
    case SupportedCountry.COSTA_RICA:
      const crModule = await import('@/extensions/costaRica');
      return crModule.costaRicaConfig;
    
    case SupportedCountry.PANAMA:
      const paModule = await import('@/extensions/panama');
      return paModule.panamaConfig;
    
    case SupportedCountry.COLOMBIA:  // ← Agregar
      const coModule = await import('@/extensions/colombia');
      return coModule.colombiaConfig;
    
    default:
      throw new Error(`Unsupported country code: ${countryCode}`);
  }
}
```

### 4. Agregar al selector UI

En `src/app/page.tsx`:

```tsx
<Select
  value={selectedCountry}
  onChange={(e) => handleCountryChange(e.target.value as SupportedCountry)}
>
  <MenuItem value={SupportedCountry.COSTA_RICA}>🇨🇷 Costa Rica</MenuItem>
  <MenuItem value={SupportedCountry.PANAMA}>🇵🇦 Panamá</MenuItem>
  <MenuItem value={SupportedCountry.COLOMBIA}>🇨🇴 Colombia</MenuItem>  {/* ← Agregar */}
</Select>
```

## ¡Listo!

Colombia está integrado sin modificar el core. Ahora puedes:

- Cambiar labels de campos
- Ocultar campos no necesarios
- Agregar validaciones específicas
- Agregar campos dinámicos (opcional)
- Extender el store (opcional)

---

## Agregar Campo Dinámico (Opcional)

Si Colombia necesita un campo adicional:

### 1. Crear componente

`src/extensions/colombia/components/ColombiaSOATField.tsx`:

```tsx
import { FC } from 'react';
import { TextField } from '@mui/material';
import { DynamicFieldComponentProps } from '@/core/claimInfo';

export const ColombiaSOATField: FC<DynamicFieldComponentProps> = ({
  value,
  onChange,
  config,
}) => (
  <TextField
    label={config.label}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Ej: 12345678"
    required={config.required}
    fullWidth
  />
);
```

### 2. Agregar a configuración

```typescript
import { ColombiaSOATField } from './components/ColombiaSOATField';

const colombiaDynamicFields = [
  {
    id: 'colombiaSOAT',
    section: 'policy',
    position: 7,
    config: {
      label: 'Número de SOAT',
      required: true,
      visible: true,
    },
    component: ColombiaSOATField,
  },
];

export const colombiaConfig: CountryConfig = {
  countryCode: SupportedCountry.COLOMBIA,
  countryName: 'Colombia',
  fieldOverrides: colombiaFieldOverrides,
  dynamicFields: colombiaDynamicFields,  // ← Agregar
  globalValidations: colombiaValidations,
};
```

**El campo aparecerá automáticamente** en la posición indicada.

---

## Extender Store (Opcional)

Si necesitas state adicional:

```typescript
const colombiaStoreExtension = {
  initialState: {
    colombiaSOAT: '',
    hasColombiaTax: false,
  },
  actions: {
    updateColombiaSOAT: (set: any, get: any, value: string) => {
      set({ colombiaSOAT: value });
    },
    setHasColombiaTax: (set: any, get: any, hasTax: boolean) => {
      set({ hasColombiaTax: hasTax });
    },
  },
};

export const colombiaConfig: CountryConfig = {
  // ... resto de config
  storeExtension: colombiaStoreExtension,  // ← Agregar
};
```

Accede al state desde cualquier componente:

```typescript
const { colombiaSOAT, updateColombiaSOAT } = useClaimInfoStore();
```

---

## Resumen

✅ **Mínimo necesario**: Solo archivo `index.ts` con overrides  
✅ **Campos dinámicos**: Agrega si necesitas campos nuevos  
✅ **Store extension**: Agrega si necesitas state personalizado  
✅ **Sin tocar el core**: Todo aislado en `/extensions/colombia/`  

**Tiempo estimado**: 15-30 minutos por país 🚀
