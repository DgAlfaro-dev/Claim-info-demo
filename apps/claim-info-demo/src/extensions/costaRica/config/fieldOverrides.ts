/**
 * Costa Rica Field Overrides
 * Configuración de overrides para campos fijos
 */

import { FixedFieldId, FieldOverridesMap } from '@/core/claimInfo';

/**
 * Overrides de campos fijos para Costa Rica
 */
export const costaRicaFieldOverrides: FieldOverridesMap = {
  // En Costa Rica, el campo RUC se llama "Cédula" (ya está por defecto)
  [FixedFieldId.POLICY_OWNER_RUC]: {
    label: 'Cédula de identidad',
    helperText: 'Formato: 0-0000-0000',
  },
  // En Costa Rica, las placas tienen formato específico
  [FixedFieldId.VEHICLE_PLATE]: {
    label: 'Número de placa',
    helperText: 'Formato: ABC-123 o ABC-1234',
  },
  // La morosidad es importante en CR
  [FixedFieldId.POLICY_DELINQUENCY]: {
    required: true,
    label: 'Días de morosidad',
  },
};
