/**
 * Panama Configuration
 * Configuración específica para Panamá con campos dinámicos
 */

import { CountryConfig, SupportedCountry } from '@claim-info-demo/core';
import {
  panamaFieldOverrides,
  panamaStoreExtension,
  panamaValidations,
  validatePanamaTaxId,
  validateInsuranceZone,
  validatePanamaRequiredFields,
  validatePanamaAmounts,
  addPanamaMetadata,
  normalizePanamaTaxId,
  addInsuranceZoneInformation,
  normalizePanamaAmounts,
  enrichPanamaVehicleInformation,
  addRegulatoryInformation,
  logPanamaSubmit,
  notifySuperintendencia,
  generatePanamaCertificate,
  sendSmsConfirmation,
  updateZoneStatistics,
  panamaTaxIdField,
  panamaInsuranceZoneField,
} from './features/claim-info';

/**
 * Configuración completa de Panamá
 */
export const panamaConfig: CountryConfig = {
  countryCode: SupportedCountry.PANAMA,
  countryName: 'Panamá',
  fieldOverrides: panamaFieldOverrides,
  dynamicFields: [panamaTaxIdField, panamaInsuranceZoneField],
  storeExtension: panamaStoreExtension,
  globalValidations: panamaValidations,
  submitExtensions: {
    preValidators: [
      validatePanamaTaxId,
      validateInsuranceZone,
      validatePanamaRequiredFields,
      validatePanamaAmounts,
    ],
    payloadMutators: [
      addPanamaMetadata,
      normalizePanamaTaxId,
      addInsuranceZoneInformation,
      normalizePanamaAmounts,
      enrichPanamaVehicleInformation,
      addRegulatoryInformation,
    ],
    postHandlers: [
      logPanamaSubmit,
      notifySuperintendencia,
      generatePanamaCertificate,
      sendSmsConfirmation,
      updateZoneStatistics,
    ],
  },
};

// Re-exportar todas las features consolidadas
export * from './features/claim-info';
