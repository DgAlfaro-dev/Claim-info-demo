/**
 * Costa Rica - Submit Extensions Index
 * Exporta todas las extensiones de submit para Costa Rica
 */

import { SubmitExtensions } from '@claim-info-demo/core';
import {
  validateCostaRicanRuc,
  validateRequiredFields,
  validateAmounts,
} from './preValidators';
import {
  addCostaRicaMetadata,
  normalizeCostaRicanRuc,
  normalizeCostaRicanAmounts,
  enrichVehicleInformation,
} from './payloadMutators';
import {
  logSubmitToLocalStorage,
  sendConfirmationNotification,
  generateClaimDocument,
} from './postHandlers';

/**
 * Configuración completa de extensiones de submit para Costa Rica
 */
export const costaRicaSubmitExtensions: SubmitExtensions = {
  // Validadores pre-submit (se ejecutan en orden)
  preValidators: [
    validateRequiredFields,
    validateCostaRicanRuc,
    validateAmounts,
  ],

  // Mutadores de payload (se ejecutan en orden)
  payloadMutators: [
    addCostaRicaMetadata,
    normalizeCostaRicanRuc,
    normalizeCostaRicanAmounts,
    enrichVehicleInformation,
  ],

  // Handlers post-submit (se ejecutan en orden)
  postHandlers: [
    logSubmitToLocalStorage,
    sendConfirmationNotification,
    generateClaimDocument,
  ],
};
