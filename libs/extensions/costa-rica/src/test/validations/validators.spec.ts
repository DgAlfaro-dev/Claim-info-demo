import { isValidCostaRicaCedula, isValidCostaRicaPlate } from '../../validations/validators';

describe('Costa Rica Validators', () => {
  describe('isValidCostaRicaCedula', () => {
    it('should accept valid cedula format with 1 digit prefix', () => {
      expect(isValidCostaRicaCedula('1-2345-6789')).toBe(true);
      expect(isValidCostaRicaCedula('2-3456-7890')).toBe(true);
      expect(isValidCostaRicaCedula('9-0000-0000')).toBe(true);
    });

    it('should accept valid cedula format with 2 digit prefix', () => {
      expect(isValidCostaRicaCedula('10-2345-6789')).toBe(true);
      expect(isValidCostaRicaCedula('12-3456-7890')).toBe(true);
      expect(isValidCostaRicaCedula('99-9999-9999')).toBe(true);
    });

    it('should reject cedula without dashes', () => {
      expect(isValidCostaRicaCedula('123456789')).toBe(false);
      expect(isValidCostaRicaCedula('1023456789')).toBe(false);
    });

    it('should reject cedula with wrong format', () => {
      expect(isValidCostaRicaCedula('123-4567-890')).toBe(false);
      expect(isValidCostaRicaCedula('1-234-56789')).toBe(false);
      expect(isValidCostaRicaCedula('1-23456-789')).toBe(false);
    });

    it('should reject cedula with letters', () => {
      expect(isValidCostaRicaCedula('A-2345-6789')).toBe(false);
      expect(isValidCostaRicaCedula('1-ABCD-6789')).toBe(false);
      expect(isValidCostaRicaCedula('1-2345-EFGH')).toBe(false);
    });

    it('should reject cedula with 3 digit prefix', () => {
      expect(isValidCostaRicaCedula('100-2345-6789')).toBe(false);
      expect(isValidCostaRicaCedula('999-9999-9999')).toBe(false);
    });

    it('should reject empty or invalid strings', () => {
      expect(isValidCostaRicaCedula('')).toBe(false);
      expect(isValidCostaRicaCedula('   ')).toBe(false);
      expect(isValidCostaRicaCedula('invalid')).toBe(false);
    });

    it('should reject cedula with extra characters', () => {
      expect(isValidCostaRicaCedula('1-2345-6789-')).toBe(false);
      expect(isValidCostaRicaCedula('-1-2345-6789')).toBe(false);
      expect(isValidCostaRicaCedula('1-2345-6789 ')).toBe(false);
    });
  });

  describe('isValidCostaRicaPlate', () => {
    it('should accept valid 3-digit plate format', () => {
      expect(isValidCostaRicaPlate('ABC-123')).toBe(true);
      expect(isValidCostaRicaPlate('XYZ-999')).toBe(true);
      expect(isValidCostaRicaPlate('AAA-000')).toBe(true);
    });

    it('should accept valid 4-digit plate format', () => {
      expect(isValidCostaRicaPlate('ABC-1234')).toBe(true);
      expect(isValidCostaRicaPlate('XYZ-9999')).toBe(true);
      expect(isValidCostaRicaPlate('AAA-0000')).toBe(true);
    });

    it('should reject plates without dashes', () => {
      expect(isValidCostaRicaPlate('ABC123')).toBe(false);
      expect(isValidCostaRicaPlate('XYZ1234')).toBe(false);
    });

    it('should reject plates with wrong number of letters', () => {
      expect(isValidCostaRicaPlate('AB-123')).toBe(false);
      expect(isValidCostaRicaPlate('ABCD-123')).toBe(false);
      expect(isValidCostaRicaPlate('A-123')).toBe(false);
    });

    it('should reject plates with wrong number of digits', () => {
      expect(isValidCostaRicaPlate('ABC-12')).toBe(false);
      expect(isValidCostaRicaPlate('ABC-12345')).toBe(false);
      expect(isValidCostaRicaPlate('ABC-1')).toBe(false);
    });

    it('should reject plates with lowercase letters', () => {
      expect(isValidCostaRicaPlate('abc-123')).toBe(false);
      expect(isValidCostaRicaPlate('Abc-123')).toBe(false);
      expect(isValidCostaRicaPlate('ABC-abc')).toBe(false);
    });

    it('should reject plates with letters in number section', () => {
      expect(isValidCostaRicaPlate('ABC-12A')).toBe(false);
      expect(isValidCostaRicaPlate('ABC-A23')).toBe(false);
    });

    it('should reject plates with numbers in letter section', () => {
      expect(isValidCostaRicaPlate('A1C-123')).toBe(false);
      expect(isValidCostaRicaPlate('12C-123')).toBe(false);
      expect(isValidCostaRicaPlate('ABC1-123')).toBe(false);
    });

    it('should reject empty or invalid strings', () => {
      expect(isValidCostaRicaPlate('')).toBe(false);
      expect(isValidCostaRicaPlate('   ')).toBe(false);
      expect(isValidCostaRicaPlate('invalid')).toBe(false);
    });

    it('should reject plates with extra characters', () => {
      expect(isValidCostaRicaPlate('ABC-123-')).toBe(false);
      expect(isValidCostaRicaPlate('-ABC-123')).toBe(false);
      expect(isValidCostaRicaPlate('ABC-123 ')).toBe(false);
    });
  });
});
