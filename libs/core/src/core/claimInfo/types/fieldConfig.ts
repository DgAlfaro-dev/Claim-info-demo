/**
 * Core Field Configuration Types
 * Estos tipos definen la estructura de configuración de campos fijos y dinámicos
 */

import { ReactNode } from 'react';

/**
 * Configuración base de un campo
 */
export interface FieldConfig {
  /** Etiqueta visible del campo */
  label: string;
  /** Indica si el campo es requerido */
  required: boolean;
  /** Indica si el campo es visible */
  visible: boolean;
  /** Orden de renderizado (opcional) */
  order?: number;
  /** Validación personalizada (opcional) */
  validation?: (value: any) => boolean | string;
  /** Texto de ayuda o placeholder */
  helperText?: string;
}

/**
 * Overrides que puede aplicar un país sobre un campo fijo
 * Un país solo declara lo que quiere cambiar
 */
export type FieldOverrides = Partial<FieldConfig>;

/**
 * Mapa de configuraciones de campos fijos por ID de campo
 */
export type FieldConfigMap = Record<string, FieldConfig>;

/**
 * Mapa de overrides por país para campos fijos
 */
export type FieldOverridesMap = Record<string, FieldOverrides>;

/**
 * IDs de campos fijos del formulario
 * Esto garantiza type-safety al referenciar campos
 */
export enum FixedFieldId {
  // Datos de la póliza
  POLICY_OWNER_NAME = 'policyOwnerName',
  POLICY_OWNER_RUC = 'policyOwnerRuc',
  VEHICLE_MODEL = 'vehicleModel',
  VEHICLE_PLATE = 'vehiclePlate',
  VEHICLE_CHASSIS = 'vehicleChassis',
  VEHICLE_YEAR = 'vehicleYear',
  
  // Datos del reclamo
  DRIVER_GENDER = 'driverGender',
  DRIVER_BIRTHDAY = 'driverBirthday',
  DEDUCTIBLE = 'deductible',
  INSURED_AMOUNT = 'insuredAmount',
  TOTAL_LOSS_PERCENTAGE = 'totalLossPercentage',
  POLICY_DELINQUENCY = 'policyDelinquency',
  FRIENDLY_PACT = 'friendlyPact',
  DEPRECIATION_PERCENTAGE = 'depreciationPercentage',
  PLAN_TYPE = 'planType',
  COVERAGE = 'coverage',
  BROKER = 'broker',
  CREDITOR = 'creditor',
  DEDUCTIBLE_PAYMENT = 'deductiblePayment',
}

/**
 * Definición de un campo dinámico que un país puede agregar
 */
export interface DynamicFieldDefinition {
  /** ID único del campo dinámico */
  id: string;
  /** Configuración del campo */
  config: FieldConfig;
  /** Componente React para renderizar el campo */
  component: React.ComponentType<DynamicFieldComponentProps>;
  /** Sección donde se debe renderizar ('policy' o 'claim') */
  section: 'policy' | 'claim';
  /** Posición relativa dentro de la sección */
  position?: 'top' | 'bottom' | number;
}

/**
 * Props que recibe cada componente de campo dinámico
 */
export interface DynamicFieldComponentProps {
  /** ID del campo */
  fieldId: string;
  /** Configuración del campo */
  config: FieldConfig;
  /** Valor actual del campo */
  value: any;
  /** Callback para actualizar el valor */
  onChange: (value: any) => void;
  /** Indica si está en modo loading */
  isLoading?: boolean;
  /** Indica si el campo está deshabilitado */
  disabled?: boolean;
}

/**
 * Configuración resuelta de un campo (defaults + overrides)
 */
export interface ResolvedFieldConfig extends FieldConfig {
  /** ID del campo */
  fieldId: string;
}
