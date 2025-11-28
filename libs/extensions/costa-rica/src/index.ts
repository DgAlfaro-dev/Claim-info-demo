/**
 * Costa Rica Configuration
 * Configuración específica para Costa Rica
 */

import { CountryConfig, SupportedCountry } from '@claim-info-demo/core';
import { costaRicaFieldOverrides } from './config/fieldOverrides';
import { costaRicaStoreExtension } from './store/storeExtension';
import { costaRicaValidations } from './validations/globalValidations';

/**
 * Configuración completa de Costa Rica
 */
export const costaRicaConfig: CountryConfig = {
  countryCode: SupportedCountry.COSTA_RICA,
  countryName: 'Costa Rica',
  fieldOverrides: costaRicaFieldOverrides,
  dynamicFields: [
    // Costa Rica puede agregar campos dinámicos aquí
    // Por ahora no tiene campos adicionales
  ],
  storeExtension: costaRicaStoreExtension,
  globalValidations: costaRicaValidations,
};
