/**
 * Costa Rica Country Configuration
 * Toda la configuración específica de Costa Rica consolidada
 */

// Config
export { costaRicaFieldOverrides } from './config/field-overrides';
export { costaRicaStoreExtension } from './config/store-extension';

// Validations
export { costaRicaValidations } from './validations/global-validations';

// Submission
export {
  validateCostaRicanRuc,
  validateRequiredFields,
  validateAmounts,
} from './submission/validators';

export {
  addCostaRicaMetadata,
  normalizeCostaRicanRuc,
  normalizeCostaRicanAmounts,
  enrichVehicleInformation,
} from './submission/mutators';

export {
  logSubmitToLocalStorage,
  sendConfirmationNotification,
  generateClaimDocument,
} from './submission/handlers';
