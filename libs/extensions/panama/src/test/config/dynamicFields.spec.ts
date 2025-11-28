import { panamaDynamicFields } from '../../config/dynamicFields';

describe('Panama Dynamic Fields', () => {
  it('should have dynamic fields array defined', () => {
    expect(panamaDynamicFields).toBeDefined();
    expect(Array.isArray(panamaDynamicFields)).toBe(true);
  });

  it('should have exactly 2 dynamic fields', () => {
    expect(panamaDynamicFields).toHaveLength(2);
  });

  describe('field structure', () => {
    it('should have required properties for all fields', () => {
      panamaDynamicFields.forEach((field) => {
        expect(field).toHaveProperty('id');
        expect(field).toHaveProperty('section');
        expect(field).toHaveProperty('position');
        expect(field).toHaveProperty('config');
        expect(field).toHaveProperty('component');
      });
    });

    it('should have valid config objects', () => {
      panamaDynamicFields.forEach((field) => {
        expect(field.config).toHaveProperty('label');
        expect(field.config).toHaveProperty('required');
        expect(field.config).toHaveProperty('visible');
        expect(field.config).toHaveProperty('helperText');
      });
    });

    it('should have correct types', () => {
      panamaDynamicFields.forEach((field) => {
        expect(typeof field.id).toBe('string');
        expect(typeof field.section).toBe('string');
        expect(typeof field.position).toBe('number');
        expect(typeof field.config.label).toBe('string');
        expect(typeof field.config.required).toBe('boolean');
        expect(typeof field.config.visible).toBe('boolean');
        expect(typeof field.config.helperText).toBe('string');
        expect(typeof field.component).toBe('function');
      });
    });
  });

  describe('panamaTaxId field', () => {
    let taxIdField: any;

    beforeAll(() => {
      taxIdField = panamaDynamicFields.find((f) => f.id === 'panamaTaxId');
    });

    it('should exist', () => {
      expect(taxIdField).toBeDefined();
    });

    it('should be in policy section', () => {
      expect(taxIdField.section).toBe('policy');
    });

    it('should be at position 7', () => {
      expect(taxIdField.position).toBe(7);
    });

    it('should be required', () => {
      expect(taxIdField.config.required).toBe(true);
    });

    it('should be visible', () => {
      expect(taxIdField.config.visible).toBe(true);
    });

    it('should have correct label', () => {
      expect(taxIdField.config.label).toBe('RUC del Asegurado');
    });

    it('should have helper text with format', () => {
      expect(taxIdField.config.helperText).toContain('1234567-1-123456');
    });

    it('should have component defined', () => {
      expect(taxIdField.component).toBeDefined();
      expect(typeof taxIdField.component).toBe('function');
    });
  });

  describe('panamaInsuranceZone field', () => {
    let zoneField: any;

    beforeAll(() => {
      zoneField = panamaDynamicFields.find((f) => f.id === 'panamaInsuranceZone');
    });

    it('should exist', () => {
      expect(zoneField).toBeDefined();
    });

    it('should be in claim section', () => {
      expect(zoneField.section).toBe('claim');
    });

    it('should be at position 14', () => {
      expect(zoneField.position).toBe(14);
    });

    it('should be required', () => {
      expect(zoneField.config.required).toBe(true);
    });

    it('should be visible', () => {
      expect(zoneField.config.visible).toBe(true);
    });

    it('should have correct label', () => {
      expect(zoneField.config.label).toBe('Zona de cobertura');
    });

    it('should have helper text about zone', () => {
      expect(zoneField.config.helperText).toContain('Zona geográfica');
    });

    it('should have component defined', () => {
      expect(zoneField.component).toBeDefined();
      expect(typeof zoneField.component).toBe('function');
    });
  });

  describe('field ordering', () => {
    it('should have unique positions', () => {
      const positions = panamaDynamicFields.map((f) => f.position);
      const uniquePositions = new Set(positions);
      expect(uniquePositions.size).toBe(positions.length);
    });

    it('should be ordered by position', () => {
      const positions = panamaDynamicFields.map((f) => f.position);
      const sortedPositions = [...positions].sort((a, b) => a - b);
      expect(positions).toEqual(sortedPositions);
    });
  });

  describe('field IDs', () => {
    it('should have unique IDs', () => {
      const ids = panamaDynamicFields.map((f) => f.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have descriptive IDs', () => {
      panamaDynamicFields.forEach((field) => {
        expect(field.id.length).toBeGreaterThan(3);
        expect(field.id).toMatch(/^panama/);
      });
    });
  });

  describe('sections', () => {
    it('should only use valid sections', () => {
      const validSections = ['policy', 'claim', 'vehicle'];
      panamaDynamicFields.forEach((field) => {
        expect(validSections).toContain(field.section);
      });
    });

    it('should have fields in both policy and claim sections', () => {
      const sections = panamaDynamicFields.map((f) => f.section);
      expect(sections).toContain('policy');
      expect(sections).toContain('claim');
    });
  });
});
