/**
 * Default Field Configurations
 * Define los valores por defecto de todos los campos fijos del sistema
 * Estos valores son estables y no deben cambiar cuando se agregan países
 */

import { FieldConfig, FieldConfigMap, FixedFieldId } from '../types';

/**
 * Configuración por defecto de todos los campos fijos
 * Un país puede hacer override de cualquiera de estas propiedades
 */
export const DEFAULT_FIELD_CONFIGS: FieldConfigMap = {
  // ========== Datos de la Póliza ==========
  [FixedFieldId.POLICY_OWNER_NAME]: {
    label: 'Nombre',
    required: true,
    visible: true,
    order: 1,
  },
  [FixedFieldId.POLICY_OWNER_RUC]: {
    label: 'Cédula',
    required: true,
    visible: true,
    order: 2,
  },
  [FixedFieldId.VEHICLE_MODEL]: {
    label: 'Modelo del auto',
    required: true,
    visible: true,
    order: 3,
  },
  [FixedFieldId.VEHICLE_PLATE]: {
    label: 'Nro. de placa',
    required: true,
    visible: true,
    order: 4,
  },
  [FixedFieldId.VEHICLE_CHASSIS]: {
    label: 'Nro. de chasis',
    required: true,
    visible: true,
    order: 5,
  },
  [FixedFieldId.VEHICLE_YEAR]: {
    label: 'Año del auto',
    required: true,
    visible: true,
    order: 6,
  },

  // ========== Datos del Reclamo ==========
  [FixedFieldId.DRIVER_GENDER]: {
    label: 'Género de conductor',
    required: true,
    visible: true,
    order: 1,
  },
  [FixedFieldId.DRIVER_BIRTHDAY]: {
    label: 'Fecha de nacimiento de conductor',
    required: true,
    visible: true,
    order: 2,
  },
  [FixedFieldId.DEDUCTIBLE]: {
    label: 'Deducible / Deducible calculado',
    required: true,
    visible: true,
    order: 3,
  },
  [FixedFieldId.INSURED_AMOUNT]: {
    label: 'Suma asegurada',
    required: true,
    visible: true,
    order: 4,
  },
  [FixedFieldId.TOTAL_LOSS_PERCENTAGE]: {
    label: 'Porcentaje de pérdida total',
    required: false,
    visible: true,
    order: 5,
  },
  [FixedFieldId.POLICY_DELINQUENCY]: {
    label: 'Morosidad de la póliza',
    required: false,
    visible: true,
    order: 6,
  },
  [FixedFieldId.FRIENDLY_PACT]: {
    label: 'Pacto amistoso',
    required: false,
    visible: true,
    order: 7,
  },
  [FixedFieldId.DEPRECIATION_PERCENTAGE]: {
    label: 'Porcentaje de depreciación',
    required: false,
    visible: true,
    order: 8,
  },
  [FixedFieldId.PLAN_TYPE]: {
    label: 'Tipo de plan',
    required: true,
    visible: true,
    order: 9,
  },
  [FixedFieldId.COVERAGE]: {
    label: 'Cobertura',
    required: true,
    visible: true,
    order: 10,
  },
  [FixedFieldId.BROKER]: {
    label: 'Corredor de seguro',
    required: false,
    visible: true,
    order: 11,
  },
  [FixedFieldId.CREDITOR]: {
    label: 'Acreedor',
    required: false,
    visible: true,
    order: 12,
  },
  [FixedFieldId.DEDUCTIBLE_PAYMENT]: {
    label: 'Pago de deducible',
    required: false,
    visible: true,
    order: 13,
  },
};

/**
 * Obtiene la configuración por defecto de un campo
 */
export const getDefaultFieldConfig = (fieldId: FixedFieldId): FieldConfig => {
  const config = DEFAULT_FIELD_CONFIGS[fieldId];
  if (!config) {
    throw new Error(`No default configuration found for field: ${fieldId}`);
  }
  return config;
};

/**
 * Obtiene todas las configuraciones por defecto
 */
export const getAllDefaultFieldConfigs = (): FieldConfigMap => {
  return { ...DEFAULT_FIELD_CONFIGS };
};
