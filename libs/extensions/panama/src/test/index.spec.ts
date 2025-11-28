import { panamaConfig } from '../index';

describe('Panama Config', () => {
  // Constant to avoid importing from core (which has React dependencies)
  const SupportedCountry = {
    PANAMA: 'PA',
  };

  it('should have complete configuration', () => {
    expect(panamaConfig).toBeDefined();
  });

  describe('country metadata', () => {
    it('should have correct country code', () => {
      expect(panamaConfig.countryCode).toBe(SupportedCountry.PANAMA);
      expect(panamaConfig.countryCode).toBe('PA');
    });

    it('should have correct country name', () => {
      expect(panamaConfig.countryName).toBe('Panamá');
    });
  });

  describe('field overrides', () => {
    it('should have field overrides defined', () => {
      expect(panamaConfig.fieldOverrides).toBeDefined();
      expect(typeof panamaConfig.fieldOverrides).toBe('object');
    });

    it('should have multiple field overrides', () => {
      expect(panamaConfig.fieldOverrides).toBeDefined();
      if (panamaConfig.fieldOverrides) {
        const overrideKeys = Object.keys(panamaConfig.fieldOverrides);
        expect(overrideKeys.length).toBeGreaterThan(0);
        expect(overrideKeys.length).toBe(5);
      }
    });
  });

  describe('dynamic fields', () => {
    it('should have dynamic fields array', () => {
      expect(panamaConfig.dynamicFields).toBeDefined();
      expect(Array.isArray(panamaConfig.dynamicFields)).toBe(true);
    });

    it('should have 2 dynamic fields (taxId and insuranceZone)', () => {
      expect(panamaConfig.dynamicFields).toHaveLength(2);
    });

    it('should have panamaTaxId field', () => {
      expect(panamaConfig.dynamicFields).toBeDefined();
      if (panamaConfig.dynamicFields) {
        const taxIdField = panamaConfig.dynamicFields.find((f) => f.id === 'panamaTaxId');
        expect(taxIdField).toBeDefined();
        expect(taxIdField?.section).toBe('policy');
      }
    });

    it('should have panamaInsuranceZone field', () => {
      expect(panamaConfig.dynamicFields).toBeDefined();
      if (panamaConfig.dynamicFields) {
        const zoneField = panamaConfig.dynamicFields.find((f) => f.id === 'panamaInsuranceZone');
        expect(zoneField).toBeDefined();
        expect(zoneField?.section).toBe('claim');
      }
    });
  });

  describe('store extension', () => {
    it('should have store extension defined', () => {
      expect(panamaConfig.storeExtension).toBeDefined();
    });

    it('should have initialState in store extension', () => {
      expect(panamaConfig.storeExtension?.initialState).toBeDefined();
    });

    it('should have actions in store extension', () => {
      expect(panamaConfig.storeExtension?.actions).toBeDefined();
    });

    it('should have panamaTaxId, panamaInsuranceZone, and hasPanamaSpecialTax state', () => {
      expect(panamaConfig.storeExtension?.initialState).toHaveProperty('panamaTaxId');
      expect(panamaConfig.storeExtension?.initialState).toHaveProperty('panamaInsuranceZone');
      expect(panamaConfig.storeExtension?.initialState).toHaveProperty('hasPanamaSpecialTax');
    });

    it('should have 3 actions', () => {
      const actionKeys = Object.keys(panamaConfig.storeExtension?.actions || {});
      expect(actionKeys).toHaveLength(3);
      expect(actionKeys).toContain('updatePanamaTaxId');
      expect(actionKeys).toContain('updatePanamaInsuranceZone');
      expect(actionKeys).toContain('setPanamaSpecialTax');
    });
  });

  describe('global validations', () => {
    it('should have global validations defined', () => {
      expect(panamaConfig.globalValidations).toBeDefined();
    });

    it('should have validateBeforeSubmit function', () => {
      expect(panamaConfig.globalValidations?.validateBeforeSubmit).toBeDefined();
      expect(typeof panamaConfig.globalValidations?.validateBeforeSubmit).toBe('function');
    });

    it('validateBeforeSubmit should return validation result structure', () => {
      expect(panamaConfig.globalValidations?.validateBeforeSubmit).toBeDefined();
      if (panamaConfig.globalValidations && panamaConfig.globalValidations.validateBeforeSubmit) {
        const result = panamaConfig.globalValidations.validateBeforeSubmit({});

        expect(result).toHaveProperty('isValid');
        expect(result).toHaveProperty('errors');
        expect(result).toHaveProperty('warnings');
        expect(typeof result.isValid).toBe('boolean');
        expect(typeof result.errors).toBe('object');
        expect(typeof result.warnings).toBe('object');
      }
    });

    it('should require Panama-specific fields', () => {
      expect(panamaConfig.globalValidations?.validateBeforeSubmit).toBeDefined();
      if (panamaConfig.globalValidations && panamaConfig.globalValidations.validateBeforeSubmit) {
        const result = panamaConfig.globalValidations.validateBeforeSubmit({});

        expect(result.isValid).toBe(false);
        if (result.errors) {
          expect(result.errors['panamaTaxId']).toBeDefined();
          expect(result.errors['panamaInsuranceZone']).toBeDefined();
        }
      }
    });
  });

  describe('config structure', () => {
    it('should have all required properties', () => {
      expect(panamaConfig).toHaveProperty('countryCode');
      expect(panamaConfig).toHaveProperty('countryName');
      expect(panamaConfig).toHaveProperty('fieldOverrides');
      expect(panamaConfig).toHaveProperty('dynamicFields');
      expect(panamaConfig).toHaveProperty('storeExtension');
      expect(panamaConfig).toHaveProperty('globalValidations');
    });

    it('should not have unexpected properties', () => {
      const expectedKeys = [
        'countryCode',
        'countryName',
        'fieldOverrides',
        'dynamicFields',
        'storeExtension',
        'globalValidations',
      ];
      const actualKeys = Object.keys(panamaConfig);

      expect(actualKeys).toEqual(expectedKeys);
    });
  });

  describe('comparison with Costa Rica', () => {
    it('should have more dynamic fields than Costa Rica', () => {
      // Panama has 2 dynamic fields (taxId, insuranceZone)
      // Costa Rica has 0 dynamic fields
      expect(panamaConfig.dynamicFields).toBeDefined();
      if (panamaConfig.dynamicFields) {
        expect(panamaConfig.dynamicFields.length).toBe(2);
      }
    });

    it('should have more field overrides than Costa Rica', () => {
      // Panama has 5 overrides
      // Costa Rica has 3 overrides
      expect(panamaConfig.fieldOverrides).toBeDefined();
      if (panamaConfig.fieldOverrides) {
        expect(Object.keys(panamaConfig.fieldOverrides).length).toBe(5);
      }
    });

    it('should have custom components for dynamic fields', () => {
      expect(panamaConfig.dynamicFields).toBeDefined();
      if (panamaConfig.dynamicFields) {
        panamaConfig.dynamicFields.forEach((field) => {
          expect(field.component).toBeDefined();
          expect(typeof field.component).toBe('function');
        });
      }
    });
  });
});
