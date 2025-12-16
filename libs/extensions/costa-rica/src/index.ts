/**
 * Costa Rica Configuration
 * Configuración específica para Costa Rica
 */

import { CountryConfig, SupportedCountry } from '@claim-info-demo/core';
import {
  costaRicaFieldOverrides,
  costaRicaStoreExtension,
  costaRicaValidations,
  validateCostaRicanRuc,
  validateRequiredFields,
  validateAmounts,
  addCostaRicaMetadata,
  normalizeCostaRicanRuc,
  normalizeCostaRicanAmounts,
  enrichVehicleInformation,
  logSubmitToLocalStorage,
  sendConfirmationNotification,
  generateClaimDocument,
} from './features/claim-info';

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
  submitExtensions: {
    preValidators: [
      validateCostaRicanRuc,
      validateRequiredFields,
      validateAmounts,
    ],
    payloadMutators: [
      addCostaRicaMetadata,
      normalizeCostaRicanRuc,
      normalizeCostaRicanAmounts,
      enrichVehicleInformation,
    ],
    postHandlers: [
      logSubmitToLocalStorage,
      sendConfirmationNotification,
      generateClaimDocument,
    ],
  },
};

// Re-exportar todas las features consolidadas
export * from './features/claim-info';
export * from './features/claim-info';
