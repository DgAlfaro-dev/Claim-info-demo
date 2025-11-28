/**
 * Panama Configuration
 * Configuración específica para Panamá con campos dinámicos
 */

import { CountryConfig, SupportedCountry } from '@/core/claimInfo';
import { panamaFieldOverrides } from './config/fieldOverrides';
import { panamaDynamicFields } from './config/dynamicFields';
import { panamaStoreExtension } from './store/storeExtension';
import { panamaValidations } from './validations/globalValidations';

/**
 * Configuración completa de Panamá
 */
export const panamaConfig: CountryConfig = {
  countryCode: SupportedCountry.PANAMA,
  countryName: 'Panamá',
  fieldOverrides: panamaFieldOverrides,
  dynamicFields: panamaDynamicFields,
  storeExtension: panamaStoreExtension,
  globalValidations: panamaValidations,
};
