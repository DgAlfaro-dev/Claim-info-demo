import { costaRicaConfig } from '../index';

describe('Costa Rica Config', () => {
  // Constant to avoid importing from core (which has React dependencies)
  const SupportedCountry = {
    COSTA_RICA: 'CR',
  };
  
  it('should have complete configuration', () => {
    expect(costaRicaConfig).toBeDefined();
  });

  describe('country metadata', () => {
    it('should have correct country code', () => {
      expect(costaRicaConfig.countryCode).toBe(SupportedCountry.COSTA_RICA);
      expect(costaRicaConfig.countryCode).toBe('CR');
    });

    it('should have correct country name', () => {
      expect(costaRicaConfig.countryName).toBe('Costa Rica');
    });
  });

  describe('field overrides', () => {
    it('should have field overrides defined', () => {
      expect(costaRicaConfig.fieldOverrides).toBeDefined();
      expect(typeof costaRicaConfig.fieldOverrides).toBe('object');
    });

    it('should have at least one field override', () => {
      expect(costaRicaConfig.fieldOverrides).toBeDefined();
      if (costaRicaConfig.fieldOverrides) {
        const overrideKeys = Object.keys(costaRicaConfig.fieldOverrides);
        expect(overrideKeys.length).toBeGreaterThan(0);
      }
    });
  });

  describe('dynamic fields', () => {
    it('should have dynamic fields array', () => {
      expect(costaRicaConfig.dynamicFields).toBeDefined();
      expect(Array.isArray(costaRicaConfig.dynamicFields)).toBe(true);
    });

    it('should have empty dynamic fields array (Costa Rica has no additional fields)', () => {
      expect(costaRicaConfig.dynamicFields).toHaveLength(0);
    });
  });

  describe('store extension', () => {
    it('should have store extension defined', () => {
      expect(costaRicaConfig.storeExtension).toBeDefined();
    });

    it('should have initialState in store extension', () => {
      expect(costaRicaConfig.storeExtension?.initialState).toBeDefined();
    });

    it('should have actions in store extension', () => {
      expect(costaRicaConfig.storeExtension?.actions).toBeDefined();
    });

    it('should have hasSugef and hasSpecialDiscount state', () => {
      expect(costaRicaConfig.storeExtension?.initialState).toHaveProperty('hasSugef');
      expect(costaRicaConfig.storeExtension?.initialState).toHaveProperty('hasSpecialDiscount');
    });
  });

  describe('global validations', () => {
    it('should have global validations defined', () => {
      expect(costaRicaConfig.globalValidations).toBeDefined();
    });

    it('should have validateBeforeSubmit function', () => {
      expect(costaRicaConfig.globalValidations?.validateBeforeSubmit).toBeDefined();
      expect(typeof costaRicaConfig.globalValidations?.validateBeforeSubmit).toBe('function');
    });

    it('validateBeforeSubmit should return validation result structure', () => {
      expect(costaRicaConfig.globalValidations?.validateBeforeSubmit).toBeDefined();
      if (costaRicaConfig.globalValidations && costaRicaConfig.globalValidations.validateBeforeSubmit) {
        const result = costaRicaConfig.globalValidations.validateBeforeSubmit({});

        expect(result).toHaveProperty('isValid');
        expect(result).toHaveProperty('errors');
        expect(typeof result.isValid).toBe('boolean');
        expect(typeof result.errors).toBe('object');
      }
    });
  });

  describe('config structure', () => {
    it('should have all required properties', () => {
      expect(costaRicaConfig).toHaveProperty('countryCode');
      expect(costaRicaConfig).toHaveProperty('countryName');
      expect(costaRicaConfig).toHaveProperty('fieldOverrides');
      expect(costaRicaConfig).toHaveProperty('dynamicFields');
      expect(costaRicaConfig).toHaveProperty('storeExtension');
      expect(costaRicaConfig).toHaveProperty('globalValidations');
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
      const actualKeys = Object.keys(costaRicaConfig);

      expect(actualKeys).toEqual(expectedKeys);
    });
  });
});
