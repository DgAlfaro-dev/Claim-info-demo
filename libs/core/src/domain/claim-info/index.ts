/**
 * Claim Info Feature - Domain Layer
 * Tipos de dominio, configuraciones y constantes del core de claim-info
 */

// Types
export * from './model/types/claimInfo';
export * from './model/types/common';
export * from './model/types/waiveDeductibleModal';

// Constants
export * from './model/constants';

// Config
export * from './config/defaultFieldConfigs';

// Store
export * from './store/claimInfoStore';

// Extension Points (lógica de países)
export * from './extensionPoints';

// Registry (lógica de países)
export * from './registry';

// Factory (lógica de países)
export * from './factory/CountryConfigFactory';
