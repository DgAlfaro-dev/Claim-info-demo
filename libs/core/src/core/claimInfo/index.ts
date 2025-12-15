/**
 * Core ClaimInfo Index
 * Punto de entrada principal del core
 */

// Types
export * from './types';

// Config
export * from './config/defaultFieldConfigs';

// Registry
export * from './registry';

// Extension Points
export * from './extensionPoints';

// Factory
export * from './factory/CountryConfigFactory';

// Utils
export * from './utils/configUtils';

// Context
export * from './context/CountryConfigContext';

// Store (re-export)
export * from './store/claimInfoStore';

// Components (re-export)
export * from './components/GeneralClaimInformation';
export * from './components/WaiveDeductibleModal';
export * from './components/DriverGenderModal';
export * from './components/DriverBirthdayModal';
export * from './components/DynamicFieldsRenderer';
export * from './components/FloatingSubmitButton';
export * from './components/SubmitFeedback';
export * from './components/FieldValidationError';

// Hooks (re-export)
export * from './hooks/useGeneralClaimInformation';
export * from './hooks/useSubmitClaim';

// Model types (re-export)
export * from './model/types/claimInfo';
export * from './model/types/common';
export * from './model/types/waiveDeductibleModal';

// Constants (re-export)
export * from './model/constants';

// Lib utils (re-export)
export * from './lib/utils';
