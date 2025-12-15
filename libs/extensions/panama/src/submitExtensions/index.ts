/**
 * Panama - Submit Extensions Index
 * Exporta todas las extensiones de submit para Panamá
 */

import { SubmitExtensions } from '@claim-info-demo/core';
import {
  validatePanamaTaxId,
  validateInsuranceZone,
  validatePanamaRequiredFields,
  validatePanamaAmounts,
} from './preValidators';
import {
  addPanamaMetadata,
  normalizePanamaTaxId,
  addInsuranceZoneInformation,
  normalizePanamaAmounts,
  enrichPanamaVehicleInformation,
  addRegulatoryInformation,
} from './payloadMutators';
import {
  logPanamaSubmit,
  notifySuperintendencia,
  generatePanamaCertificate,
  sendSmsConfirmation,
  updateZoneStatistics,
} from './postHandlers';

/**
 * Configuración completa de extensiones de submit para Panamá
 */
export const panamaSubmitExtensions: SubmitExtensions = {
  // Validadores pre-submit (se ejecutan en orden)
  preValidators: [
    validatePanamaRequiredFields,
    validatePanamaTaxId,
    validateInsuranceZone,
    validatePanamaAmounts,
  ],

  // Mutadores de payload (se ejecutan en orden)
  payloadMutators: [
    addPanamaMetadata,
    normalizePanamaTaxId,
    addInsuranceZoneInformation,
    normalizePanamaAmounts,
    enrichPanamaVehicleInformation,
    addRegulatoryInformation,
  ],

  // Handlers post-submit (se ejecutan en orden)
  postHandlers: [
    logPanamaSubmit,
    notifySuperintendencia,
    generatePanamaCertificate,
    sendSmsConfirmation,
    updateZoneStatistics,
  ],
};
