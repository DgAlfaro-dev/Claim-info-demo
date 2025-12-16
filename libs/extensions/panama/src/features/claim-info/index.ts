/**
 * Panama Country Configuration
 * Toda la configuración específica de Panamá consolidada
 */

// Config
export { panamaFieldOverrides } from './config/field-overrides';
export { panamaStoreExtension } from './store/store-extension';

// Validations
export { panamaValidations } from './validations/global-validations';

// Submission
export {
  validatePanamaTaxId,
  validateInsuranceZone,
  validatePanamaRequiredFields,
  validatePanamaAmounts,
} from './submission/validators';

export {
  addPanamaMetadata,
  normalizePanamaTaxId,
  addInsuranceZoneInformation,
  normalizePanamaAmounts,
  enrichPanamaVehicleInformation,
  addRegulatoryInformation,
} from './submission/mutators';

export {
  logPanamaSubmit,
  notifySuperintendencia,
  generatePanamaCertificate,
  sendSmsConfirmation,
  updateZoneStatistics,
} from './submission/handlers';

// Dynamic Fields
export { panamaTaxIdField } from './dynamic-fields/tax-id';
export { panamaInsuranceZoneField } from './dynamic-fields/insurance-zone';
