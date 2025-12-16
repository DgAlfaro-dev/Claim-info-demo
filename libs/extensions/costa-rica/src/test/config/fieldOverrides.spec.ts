import { costaRicaFieldOverrides } from '../../config/fieldOverrides';

describe('Costa Rica Field Overrides', () => {
  // Constants to avoid importing from core (which has React dependencies)
  const FixedFieldId = {
    POLICY_OWNER_RUC: 'policyOwnerRuc',
    VEHICLE_PLATE: 'vehiclePlate',
    POLICY_DELINQUENCY: 'policyDelinquency',
  };
  
  it('should have overrides defined', () => {
    expect(costaRicaFieldOverrides).toBeDefined();
    expect(typeof costaRicaFieldOverrides).toBe('object');
  });

  describe('POLICY_OWNER_RUC override', () => {
    it('should override label for cedula', () => {
      const override = costaRicaFieldOverrides[FixedFieldId.POLICY_OWNER_RUC];

      expect(override).toBeDefined();
      expect(override.label).toBe('Cédula de identidad');
    });

    it('should have helper text with format', () => {
      const override = costaRicaFieldOverrides[FixedFieldId.POLICY_OWNER_RUC];

      expect(override.helperText).toBe('Formato: 0-0000-0000');
    });
  });

  describe('VEHICLE_PLATE override', () => {
    it('should override label for plate', () => {
      const override = costaRicaFieldOverrides[FixedFieldId.VEHICLE_PLATE];

      expect(override).toBeDefined();
      expect(override.label).toBe('Número de placa');
    });

    it('should have helper text with format', () => {
      const override = costaRicaFieldOverrides[FixedFieldId.VEHICLE_PLATE];

      expect(override.helperText).toBe('Formato: ABC-123 o ABC-1234');
    });
  });

  describe('POLICY_DELINQUENCY override', () => {
    it('should mark delinquency as required', () => {
      const override = costaRicaFieldOverrides[FixedFieldId.POLICY_DELINQUENCY];

      expect(override).toBeDefined();
      expect(override.required).toBe(true);
    });

    it('should have custom label', () => {
      const override = costaRicaFieldOverrides[FixedFieldId.POLICY_DELINQUENCY];

      expect(override.label).toBe('Días de morosidad');
    });
  });

  it('should only override specific fields', () => {
    const overrideKeys = Object.keys(costaRicaFieldOverrides);

    expect(overrideKeys).toHaveLength(3);
    expect(overrideKeys).toContain(FixedFieldId.POLICY_OWNER_RUC);
    expect(overrideKeys).toContain(FixedFieldId.VEHICLE_PLATE);
    expect(overrideKeys).toContain(FixedFieldId.POLICY_DELINQUENCY);
  });

  it('should have correct types for all overrides', () => {
    Object.entries(costaRicaFieldOverrides).forEach(([key, value]) => {
      expect(typeof value).toBe('object');
      
      if (value.label !== undefined) {
        expect(typeof value.label).toBe('string');
      }
      
      if (value.required !== undefined) {
        expect(typeof value.required).toBe('boolean');
      }
      
      if (value.helperText !== undefined) {
        expect(typeof value.helperText).toBe('string');
      }
    });
  });
});
