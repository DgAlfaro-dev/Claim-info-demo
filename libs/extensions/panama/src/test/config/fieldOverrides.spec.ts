import { panamaFieldOverrides } from '../../config/fieldOverrides';

describe('Panama Field Overrides', () => {
  // Constants to avoid importing from core (which has React dependencies)
  const FixedFieldId = {
    POLICY_OWNER_RUC: 'policyOwnerRuc',
    VEHICLE_PLATE: 'vehiclePlate',
    DEDUCTIBLE: 'deductible',
    BROKER: 'broker',
    DEPRECIATION_PERCENTAGE: 'depreciationPercentage',
  };

  it('should have overrides defined', () => {
    expect(panamaFieldOverrides).toBeDefined();
    expect(typeof panamaFieldOverrides).toBe('object');
  });

  describe('POLICY_OWNER_RUC override', () => {
    it('should override label for RUC', () => {
      const override = panamaFieldOverrides[FixedFieldId.POLICY_OWNER_RUC];

      expect(override).toBeDefined();
      expect(override.label).toBe('RUC');
    });

    it('should have helper text', () => {
      const override = panamaFieldOverrides[FixedFieldId.POLICY_OWNER_RUC];

      expect(override.helperText).toBe('Registro Único de Contribuyente');
    });
  });

  describe('VEHICLE_PLATE override', () => {
    it('should override label for plate', () => {
      const override = panamaFieldOverrides[FixedFieldId.VEHICLE_PLATE];

      expect(override).toBeDefined();
      expect(override.label).toBe('Placa del vehículo');
    });

    it('should have helper text with format', () => {
      const override = panamaFieldOverrides[FixedFieldId.VEHICLE_PLATE];

      expect(override.helperText).toBe('Formato: 123456');
    });
  });

  describe('DEDUCTIBLE override', () => {
    it('should override label for deductible', () => {
      const override = panamaFieldOverrides[FixedFieldId.DEDUCTIBLE];

      expect(override).toBeDefined();
      expect(override.label).toBe('Deducible (Base / Aplicado)');
    });

    it('should have helper text about taxes', () => {
      const override = panamaFieldOverrides[FixedFieldId.DEDUCTIBLE];

      expect(override.helperText).toContain('impuestos locales');
    });
  });

  describe('BROKER override', () => {
    it('should hide broker field', () => {
      const override = panamaFieldOverrides[FixedFieldId.BROKER];

      expect(override).toBeDefined();
      expect(override.visible).toBe(false);
    });

    it('should only set visibility', () => {
      const override = panamaFieldOverrides[FixedFieldId.BROKER];

      const keys = Object.keys(override);
      expect(keys).toEqual(['visible']);
    });
  });

  describe('DEPRECIATION_PERCENTAGE override', () => {
    it('should make depreciation required', () => {
      const override = panamaFieldOverrides[FixedFieldId.DEPRECIATION_PERCENTAGE];

      expect(override).toBeDefined();
      expect(override.required).toBe(true);
    });

    it('should have custom label', () => {
      const override = panamaFieldOverrides[FixedFieldId.DEPRECIATION_PERCENTAGE];

      expect(override.label).toBe('Depreciación anual (%)');
    });

    it('should reorder field', () => {
      const override = panamaFieldOverrides[FixedFieldId.DEPRECIATION_PERCENTAGE];

      expect(override.order).toBe(5);
    });
  });

  it('should only override 5 specific fields', () => {
    const overrideKeys = Object.keys(panamaFieldOverrides);

    expect(overrideKeys).toHaveLength(5);
    expect(overrideKeys).toContain(FixedFieldId.POLICY_OWNER_RUC);
    expect(overrideKeys).toContain(FixedFieldId.VEHICLE_PLATE);
    expect(overrideKeys).toContain(FixedFieldId.DEDUCTIBLE);
    expect(overrideKeys).toContain(FixedFieldId.BROKER);
    expect(overrideKeys).toContain(FixedFieldId.DEPRECIATION_PERCENTAGE);
  });

  it('should have correct types for all overrides', () => {
    Object.entries(panamaFieldOverrides).forEach(([key, value]) => {
      expect(typeof value).toBe('object');

      if (value.label !== undefined) {
        expect(typeof value.label).toBe('string');
      }

      if (value.required !== undefined) {
        expect(typeof value.required).toBe('boolean');
      }

      if (value.visible !== undefined) {
        expect(typeof value.visible).toBe('boolean');
      }

      if (value.helperText !== undefined) {
        expect(typeof value.helperText).toBe('string');
      }

      if (value.order !== undefined) {
        expect(typeof value.order).toBe('number');
      }
    });
  });

  describe('override combinations', () => {
    it('should have label and helperText for most fields', () => {
      const fieldsWithBoth = Object.entries(panamaFieldOverrides).filter(
        ([key, value]) => value.label && value.helperText
      );

      expect(fieldsWithBoth.length).toBeGreaterThanOrEqual(3);
    });

    it('should only have one hidden field', () => {
      const hiddenFields = Object.entries(panamaFieldOverrides).filter(
        ([key, value]) => value.visible === false
      );

      expect(hiddenFields).toHaveLength(1);
      expect(hiddenFields[0][0]).toBe(FixedFieldId.BROKER);
    });

    it('should only have one required field', () => {
      const requiredFields = Object.entries(panamaFieldOverrides).filter(
        ([key, value]) => value.required === true
      );

      expect(requiredFields).toHaveLength(1);
      expect(requiredFields[0][0]).toBe(FixedFieldId.DEPRECIATION_PERCENTAGE);
    });

    it('should only have one field with order', () => {
      const orderedFields = Object.entries(panamaFieldOverrides).filter(
        ([key, value]) => value.order !== undefined
      );

      expect(orderedFields).toHaveLength(1);
      expect(orderedFields[0][0]).toBe(FixedFieldId.DEPRECIATION_PERCENTAGE);
    });
  });
});
