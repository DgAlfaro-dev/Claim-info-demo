/**
 * Configuration Utilities
 * Utilidades para combinar y resolver configuraciones de campos
 */

import {
  FieldConfig,
  FieldConfigMap,
  FieldOverridesMap,
  ResolvedFieldConfig,
  FixedFieldId,
} from '../types';
import { DEFAULT_FIELD_CONFIGS } from '../../../domain/claim-info/config/defaultFieldConfigs';

/**
 * Combina la configuración por defecto con los overrides de un país
 * Solo se sobrescriben las propiedades que el país especifica explícitamente
 */
export const mergeFieldConfig = (
  defaultConfig: FieldConfig,
  overrides?: Partial<FieldConfig>
): FieldConfig => {
  if (!overrides) {
    return { ...defaultConfig };
  }

  return {
    ...defaultConfig,
    ...overrides,
  };
};

/**
 * Combina todas las configuraciones por defecto con los overrides de un país
 */
export const mergeAllFieldConfigs = (
  overrides?: FieldOverridesMap
): FieldConfigMap => {
  const mergedConfigs: FieldConfigMap = {};

  // Empezar con todos los defaults
  Object.keys(DEFAULT_FIELD_CONFIGS).forEach((fieldId) => {
    const defaultConfig = DEFAULT_FIELD_CONFIGS[fieldId];
    const override = overrides?.[fieldId];
    mergedConfigs[fieldId] = mergeFieldConfig(defaultConfig, override);
  });

  return mergedConfigs;
};

/**
 * Obtiene una configuración resuelta para un campo específico
 */
export const getResolvedFieldConfig = (
  fieldId: FixedFieldId,
  overrides?: FieldOverridesMap
): ResolvedFieldConfig => {
  const defaultConfig = DEFAULT_FIELD_CONFIGS[fieldId];
  if (!defaultConfig) {
    throw new Error(`No default configuration found for field: ${fieldId}`);
  }

  const override = overrides?.[fieldId];
  const mergedConfig = mergeFieldConfig(defaultConfig, override);

  return {
    fieldId,
    ...mergedConfig,
  };
};

/**
 * Filtra campos visibles de una configuración
 */
export const getVisibleFields = (
  configs: FieldConfigMap
): FieldConfigMap => {
  const visibleFields: FieldConfigMap = {};

  Object.entries(configs).forEach(([fieldId, config]) => {
    if (config.visible) {
      visibleFields[fieldId] = config;
    }
  });

  return visibleFields;
};

/**
 * Ordena campos por su propiedad 'order'
 */
export const sortFieldsByOrder = (
  configs: FieldConfigMap
): Array<[string, FieldConfig]> => {
  return Object.entries(configs).sort((a, b) => {
    const orderA = a[1].order ?? 999;
    const orderB = b[1].order ?? 999;
    return orderA - orderB;
  });
};

/**
 * Valida si todos los campos requeridos tienen valores
 */
export const validateRequiredFields = (
  configs: FieldConfigMap,
  values: Record<string, any>
): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];

  Object.entries(configs).forEach(([fieldId, config]) => {
    if (config.required && config.visible) {
      const value = values[fieldId];
      if (value === undefined || value === null || value === '') {
        missingFields.push(fieldId);
      }
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};
