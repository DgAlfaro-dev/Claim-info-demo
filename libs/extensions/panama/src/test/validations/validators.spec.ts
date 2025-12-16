import { isValidPanamaRuc, isValidPanamaPlate } from '../../validations/validators';

describe('Panama Validators', () => {
  describe('isValidPanamaRuc', () => {
    describe('valid formats', () => {
      it('should accept valid RUC format', () => {
        expect(isValidPanamaRuc('1234567-1-123456')).toBe(true);
      });

      it('should accept RUC with different numbers', () => {
        expect(isValidPanamaRuc('9876543-2-654321')).toBe(true);
      });

      it('should accept RUC with zeros', () => {
        expect(isValidPanamaRuc('0000000-0-000000')).toBe(true);
      });

      it('should accept RUC with digit 9 in middle', () => {
        expect(isValidPanamaRuc('1111111-9-999999')).toBe(true);
      });
    });

    describe('invalid formats', () => {
      it('should reject RUC without dashes', () => {
        expect(isValidPanamaRuc('12345671123456')).toBe(false);
      });

      it('should reject RUC with wrong segment lengths', () => {
        expect(isValidPanamaRuc('123456-1-123456')).toBe(false);
        expect(isValidPanamaRuc('1234567-12-123456')).toBe(false);
        expect(isValidPanamaRuc('1234567-1-12345')).toBe(false);
      });

      it('should reject RUC with letters', () => {
        expect(isValidPanamaRuc('123456A-1-123456')).toBe(false);
        expect(isValidPanamaRuc('1234567-A-123456')).toBe(false);
        expect(isValidPanamaRuc('1234567-1-12345A')).toBe(false);
      });

      it('should reject empty string', () => {
        expect(isValidPanamaRuc('')).toBe(false);
      });

      it('should reject RUC with spaces', () => {
        expect(isValidPanamaRuc('1234567 1 123456')).toBe(false);
      });

      it('should reject RUC with special characters', () => {
        expect(isValidPanamaRuc('1234567-1-123456!')).toBe(false);
      });
    });
  });

  describe('isValidPanamaPlate', () => {
    describe('valid formats', () => {
      it('should accept valid plate format (6 digits)', () => {
        expect(isValidPanamaPlate('123456')).toBe(true);
      });

      it('should accept plate with all zeros', () => {
        expect(isValidPanamaPlate('000000')).toBe(true);
      });

      it('should accept plate with all nines', () => {
        expect(isValidPanamaPlate('999999')).toBe(true);
      });
    });

    describe('invalid formats', () => {
      it('should reject plate with less than 6 digits', () => {
        expect(isValidPanamaPlate('12345')).toBe(false);
      });

      it('should reject plate with more than 6 digits', () => {
        expect(isValidPanamaPlate('1234567')).toBe(false);
      });

      it('should reject plate with letters', () => {
        expect(isValidPanamaPlate('ABC123')).toBe(false);
        expect(isValidPanamaPlate('12AB34')).toBe(false);
      });

      it('should reject empty string', () => {
        expect(isValidPanamaPlate('')).toBe(false);
      });

      it('should reject plate with dashes', () => {
        expect(isValidPanamaPlate('123-456')).toBe(false);
      });

      it('should reject plate with spaces', () => {
        expect(isValidPanamaPlate('123 456')).toBe(false);
      });

      it('should reject plate with special characters', () => {
        expect(isValidPanamaPlate('123456!')).toBe(false);
      });
    });
  });
});
