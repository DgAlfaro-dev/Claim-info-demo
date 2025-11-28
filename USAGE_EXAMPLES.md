# Ejemplos de Uso del Sistema

## 1. Usar configuración del país en un componente

```typescript
import { useCountryConfigContext, FixedFieldId } from '@/core/claimInfo';

function MyComponent() {
  const { resolvedFieldConfigs, currentCountry } = useCountryConfigContext();
  
  // Obtener configuración de un campo específico
  const rucConfig = resolvedFieldConfigs?.[FixedFieldId.POLICY_OWNER_RUC];
  
  return (
    <div>
      <h2>País actual: {currentCountry}</h2>
      <p>Label del RUC: {rucConfig?.label}</p>
      <p>Es requerido: {rucConfig?.required ? 'Sí' : 'No'}</p>
    </div>
  );
}
```

## 2. Acceder al store extendido

```typescript
import { useClaimInfoStore } from '@/core/claimInfo';

function PanamaComponent() {
  // Estado del core (siempre disponible)
  const { claimInfo, updateDriverGender } = useClaimInfoStore();
  
  // Estado extendido de Panamá (solo disponible cuando PA está activo)
  const panamaTaxId = useClaimInfoStore(state => state.panamaTaxId);
  const updatePanamaTaxId = useClaimInfoStore(state => state.updatePanamaTaxId);
  
  const handleChange = (value: string) => {
    updatePanamaTaxId?.(value);
  };
  
  return (
    <input
      value={panamaTaxId || ''}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}
```

## 3. Renderizar campos condicionalmente según visibilidad

```typescript
import { useCountryConfigContext, FixedFieldId } from '@/core/claimInfo';

function PolicySection() {
  const { resolvedFieldConfigs } = useCountryConfigContext();
  
  const getConfig = (fieldId: FixedFieldId) => {
    return resolvedFieldConfigs?.[fieldId];
  };
  
  return (
    <div>
      {getConfig(FixedFieldId.POLICY_OWNER_NAME)?.visible && (
        <TextField
          label={getConfig(FixedFieldId.POLICY_OWNER_NAME)?.label}
          required={getConfig(FixedFieldId.POLICY_OWNER_NAME)?.required}
        />
      )}
      
      {getConfig(FixedFieldId.BROKER)?.visible && (
        <TextField
          label={getConfig(FixedFieldId.BROKER)?.label}
        />
      )}
    </div>
  );
}
```

## 4. Crear componente de campo dinámico

```typescript
import { FC } from 'react';
import { DynamicFieldComponentProps } from '@/core/claimInfo';
import { TextField } from '@mui/material';

export const CustomDynamicField: FC<DynamicFieldComponentProps> = ({
  fieldId,
  config,
  value,
  onChange,
  isLoading,
  disabled,
}) => {
  return (
    <TextField
      label={config.label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      required={config.required}
      disabled={disabled || isLoading}
      helperText={config.helperText}
      error={config.validation && !config.validation(value)}
    />
  );
};
```

## 5. Registrar campo dinámico manualmente

```typescript
import { dynamicFieldsRegistry } from '@/core/claimInfo';
import { MyCustomField } from './components/MyCustomField';

// Registrar un campo dinámico
dynamicFieldsRegistry.register({
  id: 'myCustomField',
  section: 'claim',
  position: 10,
  config: {
    label: 'Mi Campo Personalizado',
    required: true,
    visible: true,
    helperText: 'Ingrese un valor',
  },
  component: MyCustomField,
});

// Verificar si está registrado
if (dynamicFieldsRegistry.has('myCustomField')) {
  console.log('Campo registrado correctamente');
}

// Obtener todos los campos de una sección
const claimFields = dynamicFieldsRegistry.getBySection('claim');
console.log('Campos dinámicos en Claim:', claimFields.length);
```

## 6. Extender el store manualmente

```typescript
import { storeExtensionRegistry, createStoreSlice } from '@/core/claimInfo';

// Crear un slice personalizado
const myCountrySlice = createStoreSlice((set, get) => ({
  customField: '',
  customData: null,
  
  updateCustomField: (value: string) => {
    set({ customField: value });
  },
  
  fetchCustomData: async () => {
    const response = await fetch('/api/custom-data');
    const data = await response.json();
    set({ customData: data });
  },
}));

// Registrar el slice
storeExtensionRegistry.register('MY_COUNTRY', myCountrySlice);
```

## 7. Validar datos antes de enviar

```typescript
import { CountryConfig } from '@/core/claimInfo';

const myValidation: CountryConfig['globalValidations'] = {
  validateBeforeSubmit: (data) => {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};
    
    // Validar RUC
    if (!data.policy?.Owner?.ruc) {
      errors.ruc = 'El RUC es requerido';
    } else if (!/^\d{10}$/.test(data.policy.Owner.ruc)) {
      errors.ruc = 'El RUC debe tener 10 dígitos';
    }
    
    // Validar depreciación
    if (data.vehicleInformation?.depreciation > 50) {
      warnings.depreciation = 'Depreciación alta, revisar';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings,
    };
  },
};
```

## 8. Cambiar país programáticamente

```typescript
import { useCountryConfigContext, SupportedCountry } from '@/core/claimInfo';

function CountrySwitch() {
  const { loadCountry, currentCountry, isLoading } = useCountryConfigContext();
  
  const switchToPanama = async () => {
    try {
      await loadCountry(SupportedCountry.PANAMA);
      console.log('País cambiado a Panamá');
    } catch (error) {
      console.error('Error al cambiar país:', error);
    }
  };
  
  return (
    <button onClick={switchToPanama} disabled={isLoading}>
      {isLoading ? 'Cambiando...' : 'Cambiar a Panamá'}
    </button>
  );
}
```

## 9. Usar utilidades de configuración

```typescript
import {
  mergeAllFieldConfigs,
  getResolvedFieldConfig,
  getVisibleFields,
  sortFieldsByOrder,
  validateRequiredFields,
  FixedFieldId,
} from '@/core/claimInfo';

// Combinar configs
const resolved = mergeAllFieldConfigs(myOverrides);

// Obtener config de un campo
const plateConfig = getResolvedFieldConfig(
  FixedFieldId.VEHICLE_PLATE,
  myOverrides
);

// Filtrar solo campos visibles
const visibleFields = getVisibleFields(resolved);

// Ordenar por 'order'
const sortedFields = sortFieldsByOrder(resolved);

// Validar campos requeridos
const validation = validateRequiredFields(resolved, formData);
if (!validation.isValid) {
  console.log('Campos faltantes:', validation.missingFields);
}
```

## 10. Limpiar registros al desmontar

```typescript
import { useEffect } from 'react';
import { CountryConfigFactory } from '@/core/claimInfo';

function App() {
  useEffect(() => {
    return () => {
      // Limpiar cache al desmontar
      CountryConfigFactory.clearCache();
    };
  }, []);
  
  return <div>My App</div>;
}
```

## 11. Obtener lista de países soportados

```typescript
import { CountryConfigFactory, SupportedCountry } from '@/core/claimInfo';

const supportedCountries = CountryConfigFactory.getSupportedCountries();
// ['CR', 'PA']

const isSupported = CountryConfigFactory.isCountrySupported('CR');
// true
```

## 12. Hook personalizado para campo dinámico

```typescript
import { useClaimInfoStore } from '@/core/claimInfo';

function useDynamicField(fieldId: string) {
  const value = useClaimInfoStore(state => state.getDynamicFieldValue(fieldId));
  const setValue = useClaimInfoStore(state => state.setDynamicFieldValue);
  
  const updateValue = (newValue: any) => {
    setValue(fieldId, newValue);
  };
  
  return [value, updateValue] as const;
}

// Uso
function MyComponent() {
  const [taxId, setTaxId] = useDynamicField('panamaTaxId');
  
  return (
    <input
      value={taxId || ''}
      onChange={(e) => setTaxId(e.target.value)}
    />
  );
}
```

---

## Tips de Performance

### 1. Memoizar configuraciones

```typescript
import { useMemo } from 'react';
import { useCountryConfigContext } from '@/core/claimInfo';

function MyComponent() {
  const { resolvedFieldConfigs } = useCountryConfigContext();
  
  const visibleFields = useMemo(() => {
    return Object.entries(resolvedFieldConfigs || {})
      .filter(([_, config]) => config.visible);
  }, [resolvedFieldConfigs]);
  
  return <div>{/* render */}</div>;
}
```

### 2. Usar selectores específicos del store

```typescript
// ❌ Mal - Re-renderiza en cualquier cambio del store
const store = useClaimInfoStore();

// ✅ Bien - Solo re-renderiza si claimInfo cambia
const claimInfo = useClaimInfoStore(state => state.claimInfo);
```

### 3. Lazy load de componentes pesados

```typescript
import { lazy, Suspense } from 'react';

const HeavyDynamicField = lazy(() => import('./HeavyDynamicField'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyDynamicField />
    </Suspense>
  );
}
```

---

## Debugging

### Verificar qué país está activo

```typescript
import { useCountryConfigContext } from '@/core/claimInfo';

function DebugPanel() {
  const { currentCountry, countryConfig, resolvedFieldConfigs } = useCountryConfigContext();
  
  return (
    <div>
      <h3>Debug Info</h3>
      <p>País: {currentCountry}</p>
      <p>Nombre: {countryConfig?.countryName}</p>
      <p>Campos resueltos: {Object.keys(resolvedFieldConfigs || {}).length}</p>
      <pre>{JSON.stringify(countryConfig, null, 2)}</pre>
    </div>
  );
}
```

### Ver campos dinámicos registrados

```typescript
import { dynamicFieldsRegistry } from '@/core/claimInfo';

console.log('Campos dinámicos totales:', dynamicFieldsRegistry.size);
console.log('Campos en Policy:', dynamicFieldsRegistry.getBySection('policy'));
console.log('Campos en Claim:', dynamicFieldsRegistry.getBySection('claim'));
```

### Inspeccionar store extendido

```typescript
import { useClaimInfoStore } from '@/core/claimInfo';

function StoreDebugger() {
  const store = useClaimInfoStore();
  
  console.log('Store completo:', store);
  console.log('Keys del store:', Object.keys(store));
  
  return null;
}
```
