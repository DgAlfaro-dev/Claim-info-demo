/**
 * Panama Field Overrides
 * Configuración de overrides para campos fijos
 */

import { FixedFieldId, FieldOverridesMap } from '@/core/claimInfo';

/**
 * Overrides de campos fijos para Panamá
 */
export const panamaFieldOverrides: FieldOverridesMap = {
  // En Panamá, el campo RUC tiene formato diferente
  [FixedFieldId.POLICY_OWNER_RUC]: {
    label: 'RUC',
    helperText: 'Registro Único de Contribuyente',
  },
  // Las placas en Panamá tienen formato diferente
  [FixedFieldId.VEHICLE_PLATE]: {
    label: 'Placa del vehículo',
    helperText: 'Formato: 123456',
  },
  // En Panamá el deducible se calcula diferente
  [FixedFieldId.DEDUCTIBLE]: {
    label: 'Deducible (Base / Aplicado)',
    helperText: 'Incluye impuestos locales',
  },
  // El broker no siempre es visible en Panamá
  [FixedFieldId.BROKER]: {
    visible: false,
  },
  // Campo de depreciación más importante en PA
  [FixedFieldId.DEPRECIATION_PERCENTAGE]: {
    required: true,
    label: 'Depreciación anual (%)',
    order: 5, // Mover más arriba
  },
};
