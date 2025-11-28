/**
 * Country Configuration Types
 * Define cómo cada país puede extender el sistema
 */

import { DynamicFieldDefinition, FieldOverridesMap } from './fieldConfig';

/**
 * Configuración completa de un país
 */
export interface CountryConfig {
  /** Código ISO del país */
  countryCode: string;
  /** Nombre del país */
  countryName: string;
  /** Overrides para campos fijos existentes */
  fieldOverrides?: FieldOverridesMap;
  /** Campos dinámicos que agrega este país */
  dynamicFields?: DynamicFieldDefinition[];
  /** Extensión del store Zustand (opcional) */
  storeExtension?: StoreExtension;
  /** Validaciones globales específicas del país */
  globalValidations?: CountryValidations;
}

/**
 * Extensión del store Zustand
 * Permite agregar state y acciones específicas del país
 */
export interface StoreExtension {
  /** Estado inicial adicional */
  initialState?: Record<string, any>;
  /** Acciones adicionales */
  actions?: Record<string, (...args: any[]) => any>;
}

/**
 * Validaciones globales del país
 */
export interface CountryValidations {
  /** Valida antes de enviar el formulario */
  validateBeforeSubmit?: (data: any) => ValidationResult;
  /** Valida al cargar datos */
  validateOnLoad?: (data: any) => ValidationResult;
}

/**
 * Resultado de una validación
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: Record<string, string>;
  warnings?: Record<string, string>;
}

/**
 * Función de inicialización que cada país debe exportar
 */
export type CountryInitializer = () => CountryConfig | Promise<CountryConfig>;

/**
 * Países soportados
 */
export enum SupportedCountry {
  COSTA_RICA = 'CR',
  PANAMA = 'PA',
  // Agregar más países según se implementen
}
