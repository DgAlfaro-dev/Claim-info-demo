import { costaRicaValidations } from '../../validations/globalValidations';

describe('Costa Rica Global Validations', () => {
  describe('validateBeforeSubmit', () => {
    it('should return valid when all fields are correct', () => {
      const data = {
        policy: {
          Owner: {
            ruc: '1-2345-6789',
          },
        },
        vehicleInformation: {
          plate: 'ABC-123',
        },
      };

      const result = costaRicaValidations.validateBeforeSubmit(data);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return valid with 4-digit plate', () => {
      const data = {
        policy: {
          Owner: {
            ruc: '10-2345-6789',
          },
        },
        vehicleInformation: {
          plate: 'XYZ-1234',
        },
      };

      const result = costaRicaValidations.validateBeforeSubmit(data);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return error for invalid cedula format', () => {
      const data = {
        policy: {
          Owner: {
            ruc: '123456789', // Sin guiones
          },
        },
        vehicleInformation: {
          plate: 'ABC-123',
        },
      };

      const result = costaRicaValidations.validateBeforeSubmit(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.policyOwnerRuc).toBe('Formato de cédula inválido para Costa Rica');
    });

    it('should return error for invalid plate format', () => {
      const data = {
        policy: {
          Owner: {
            ruc: '1-2345-6789',
          },
        },
        vehicleInformation: {
          plate: 'ABC123', // Sin guión
        },
      };

      const result = costaRicaValidations.validateBeforeSubmit(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.vehiclePlate).toBe('Formato de placa inválido para Costa Rica');
    });

    it('should return multiple errors when both fields are invalid', () => {
      const data = {
        policy: {
          Owner: {
            ruc: 'invalid-cedula',
          },
        },
        vehicleInformation: {
          plate: 'invalid-plate',
        },
      };

      const result = costaRicaValidations.validateBeforeSubmit(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.policyOwnerRuc).toBeDefined();
      expect(result.errors.vehiclePlate).toBeDefined();
      expect(Object.keys(result.errors).length).toBe(2);
    });

    it('should return valid when fields are missing', () => {
      const data = {
        policy: {
          Owner: {},
        },
        vehicleInformation: {},
      };

      const result = costaRicaValidations.validateBeforeSubmit(data);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return valid when data is incomplete', () => {
      const data = {};

      const result = costaRicaValidations.validateBeforeSubmit(data);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should only validate when fields have values', () => {
      const data = {
        policy: {
          Owner: {
            ruc: '',
          },
        },
        vehicleInformation: {
          plate: '',
        },
      };

      const result = costaRicaValidations.validateBeforeSubmit(data);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should validate cedula with 2-digit prefix', () => {
      const data = {
        policy: {
          Owner: {
            ruc: '12-3456-7890',
          },
        },
        vehicleInformation: {
          plate: 'ABC-123',
        },
      };

      const result = costaRicaValidations.validateBeforeSubmit(data);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should reject cedula with letters', () => {
      const data = {
        policy: {
          Owner: {
            ruc: 'A-2345-6789',
          },
        },
      };

      const result = costaRicaValidations.validateBeforeSubmit(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.policyOwnerRuc).toBeDefined();
    });

    it('should reject plate with lowercase letters', () => {
      const data = {
        vehicleInformation: {
          plate: 'abc-123',
        },
      };

      const result = costaRicaValidations.validateBeforeSubmit(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.vehiclePlate).toBeDefined();
    });
  });
});
