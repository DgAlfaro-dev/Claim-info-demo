export const CLAIM_INFO_CONSTANTS = {
  MIN_DRIVER_AGE: 18,
  MAX_DRIVER_AGE: 100,
  DEFAULT_DEPRECIATION: 15,
  DEFAULT_TOTAL_LOSS_PERCENTAGE: 10.6,
  FRIENDLY_PACT_VALUES: {
    NONE: 'NONE',
    APPLY: 'APPLY',
  },
  DEDUCTIBLE_PAYMENT_OPTIONS: {
    WORKSHOP: 'En taller',
    INSURANCE: 'En aseguradora',
    CLIENT: 'Cliente',
  },
  GENDER_OPTIONS: {
    M: 'Masculino',
    F: 'Femenino',
    O: 'Otro',
  },
} as const;

export const WAIVE_REASONS = {
  customer_loyalty: 'Fidelización del cliente',
  special_case: 'Caso especial',
  low_damage: 'Daño menor',
  good_history: 'Buen historial del cliente',
  management_decision: 'Decisión gerencial',
} as const;