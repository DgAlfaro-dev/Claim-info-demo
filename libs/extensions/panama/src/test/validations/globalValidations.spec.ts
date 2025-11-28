import { panamaValidations } from '../../validations/globalValidations';

describe('Panama Global Validations', () => {
  describe('validateBeforeSubmit', () => {
    it('should be defined', () => {
      expect(panamaValidations.validateBeforeSubmit).toBeDefined();
      expect(typeof panamaValidations.validateBeforeSubmit).toBe('function');
    });

    describe('valid data', () => {
      it('should pass validation with all valid data', () => {
        const validData = {
          policy: {
            Owner: {
              ruc: '1234567-1-123456',
            },
          },
          vehicleInformation: {
            plate: '123456',
            depreciation: 20,
          },
          panamaTaxId: '1234567-1-123456',
          panamaInsuranceZone: 'PANAMA_CITY',
        };

        const result = panamaValidations.validateBeforeSubmit(validData);

        expect(result.isValid).toBe(true);
        expect(Object.keys(result.errors)).toHaveLength(0);
      });

      it('should pass validation with minimal valid data', () => {
        const validData = {
          panamaTaxId: '9999999-9-999999',
          panamaInsuranceZone: 'COLON',
        };

        const result = panamaValidations.validateBeforeSubmit(validData);

        expect(result.isValid).toBe(true);
        expect(Object.keys(result.errors)).toHaveLength(0);
      });
    });

    describe('RUC validation', () => {
      it('should fail with invalid RUC format', () => {
        const invalidData = {
          policy: {
            Owner: {
              ruc: '123456',
            },
          },
          panamaTaxId: '1234567-1-123456',
          panamaInsuranceZone: 'PANAMA_CITY',
        };

        const result = panamaValidations.validateBeforeSubmit(invalidData);

        expect(result.isValid).toBe(false);
        expect(result.errors['policyOwnerRuc']).toBeDefined();
        expect(result.errors['policyOwnerRuc']).toContain('Formato de RUC inválido');
      });

      it('should pass with empty RUC (not required)', () => {
        const data = {
          policy: {
            Owner: {},
          },
          panamaTaxId: '1234567-1-123456',
          panamaInsuranceZone: 'PANAMA_CITY',
        };

        const result = panamaValidations.validateBeforeSubmit(data);

        expect(result.isValid).toBe(true);
      });
    });

    describe('plate validation', () => {
      it('should fail with invalid plate format', () => {
        const invalidData = {
          vehicleInformation: {
            plate: 'ABC123',
          },
          panamaTaxId: '1234567-1-123456',
          panamaInsuranceZone: 'PANAMA_CITY',
        };

        const result = panamaValidations.validateBeforeSubmit(invalidData);

        expect(result.isValid).toBe(false);
        expect(result.errors['vehiclePlate']).toBeDefined();
        expect(result.errors['vehiclePlate']).toContain('Formato de placa inválido');
      });

      it('should pass with empty plate (not required)', () => {
        const data = {
          vehicleInformation: {},
          panamaTaxId: '1234567-1-123456',
          panamaInsuranceZone: 'PANAMA_CITY',
        };

        const result = panamaValidations.validateBeforeSubmit(data);

        expect(result.isValid).toBe(true);
      });
    });

    describe('Panama-specific fields', () => {
      it('should fail when panamaTaxId is missing', () => {
        const invalidData = {
          panamaInsuranceZone: 'PANAMA_CITY',
        };

        const result = panamaValidations.validateBeforeSubmit(invalidData);

        expect(result.isValid).toBe(false);
        expect(result.errors['panamaTaxId']).toBeDefined();
        expect(result.errors['panamaTaxId']).toContain('RUC del asegurado es requerido');
      });

      it('should fail when panamaInsuranceZone is missing', () => {
        const invalidData = {
          panamaTaxId: '1234567-1-123456',
        };

        const result = panamaValidations.validateBeforeSubmit(invalidData);

        expect(result.isValid).toBe(false);
        expect(result.errors['panamaInsuranceZone']).toBeDefined();
        expect(result.errors['panamaInsuranceZone']).toContain('Zona de cobertura es requerida');
      });

      it('should fail when both Panama-specific fields are missing', () => {
        const invalidData = {};

        const result = panamaValidations.validateBeforeSubmit(invalidData);

        expect(result.isValid).toBe(false);
        expect(result.errors['panamaTaxId']).toBeDefined();
        expect(result.errors['panamaInsuranceZone']).toBeDefined();
      });
    });

    describe('depreciation warnings', () => {
      it('should add warning for high depreciation', () => {
        const data = {
          vehicleInformation: {
            depreciation: 35,
          },
          panamaTaxId: '1234567-1-123456',
          panamaInsuranceZone: 'PANAMA_CITY',
        };

        const result = panamaValidations.validateBeforeSubmit(data);

        expect(result.isValid).toBe(true);
        expect(result.warnings['depreciation']).toBeDefined();
        expect(result.warnings['depreciation']).toContain('30%');
      });

      it('should not add warning for acceptable depreciation', () => {
        const data = {
          vehicleInformation: {
            depreciation: 25,
          },
          panamaTaxId: '1234567-1-123456',
          panamaInsuranceZone: 'PANAMA_CITY',
        };

        const result = panamaValidations.validateBeforeSubmit(data);

        expect(result.isValid).toBe(true);
        expect(result.warnings['depreciation']).toBeUndefined();
      });

      it('should not add warning for exactly 30% depreciation', () => {
        const data = {
          vehicleInformation: {
            depreciation: 30,
          },
          panamaTaxId: '1234567-1-123456',
          panamaInsuranceZone: 'PANAMA_CITY',
        };

        const result = panamaValidations.validateBeforeSubmit(data);

        expect(result.isValid).toBe(true);
        expect(result.warnings['depreciation']).toBeUndefined();
      });
    });

    describe('response structure', () => {
      it('should always return isValid boolean', () => {
        const result = panamaValidations.validateBeforeSubmit({});

        expect(result).toHaveProperty('isValid');
        expect(typeof result.isValid).toBe('boolean');
      });

      it('should always return errors object', () => {
        const result = panamaValidations.validateBeforeSubmit({});

        expect(result).toHaveProperty('errors');
        expect(typeof result.errors).toBe('object');
      });

      it('should always return warnings object', () => {
        const result = panamaValidations.validateBeforeSubmit({});

        expect(result).toHaveProperty('warnings');
        expect(typeof result.warnings).toBe('object');
      });
    });

    describe('multiple errors', () => {
      it('should collect all errors', () => {
        const invalidData = {
          policy: {
            Owner: {
              ruc: 'invalid',
            },
          },
          vehicleInformation: {
            plate: 'ABC123',
          },
        };

        const result = panamaValidations.validateBeforeSubmit(invalidData);

        expect(result.isValid).toBe(false);
        expect(Object.keys(result.errors).length).toBeGreaterThan(1);
        expect(result.errors['policyOwnerRuc']).toBeDefined();
        expect(result.errors['vehiclePlate']).toBeDefined();
        expect(result.errors['panamaTaxId']).toBeDefined();
        expect(result.errors['panamaInsuranceZone']).toBeDefined();
      });
    });
  });
});
