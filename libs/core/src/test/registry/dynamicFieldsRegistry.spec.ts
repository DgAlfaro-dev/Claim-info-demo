import { dynamicFieldsRegistry } from '../../core/claimInfo/registry/dynamicFieldsRegistry';
import { DynamicFieldDefinition } from '../../core/claimInfo/types';

describe('DynamicFieldsRegistry', () => {
  const mockComponent = () => null;

  const mockField1: DynamicFieldDefinition = {
    id: 'testField1',
    section: 'policy',
    position: 1,
    config: {
      label: 'Test Field 1',
      required: true,
      visible: true,
    },
    component: mockComponent,
  };

  const mockField2: DynamicFieldDefinition = {
    id: 'testField2',
    section: 'claim',
    position: 2,
    config: {
      label: 'Test Field 2',
      required: false,
      visible: true,
    },
    component: mockComponent,
  };

  beforeEach(() => {
    dynamicFieldsRegistry.clear();
  });

  afterEach(() => {
    dynamicFieldsRegistry.clear();
  });

  describe('register', () => {
    it('should register a new dynamic field', () => {
      dynamicFieldsRegistry.register(mockField1);

      expect(dynamicFieldsRegistry.has('testField1')).toBe(true);
      expect(dynamicFieldsRegistry.get('testField1')).toEqual(mockField1);
    });

    it('should overwrite existing field with warning', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      dynamicFieldsRegistry.register(mockField1);
      dynamicFieldsRegistry.register({ ...mockField1, position: 5 });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('already registered')
      );
      expect(dynamicFieldsRegistry.get('testField1')?.position).toBe(5);

      consoleSpy.mockRestore();
    });
  });

  describe('registerMany', () => {
    it('should register multiple fields at once', () => {
      dynamicFieldsRegistry.registerMany([mockField1, mockField2]);

      expect(dynamicFieldsRegistry.has('testField1')).toBe(true);
      expect(dynamicFieldsRegistry.has('testField2')).toBe(true);
      expect(dynamicFieldsRegistry.size).toBe(2);
    });

    it('should handle empty array', () => {
      dynamicFieldsRegistry.registerMany([]);

      expect(dynamicFieldsRegistry.size).toBe(0);
    });
  });

  describe('get', () => {
    it('should return field by id', () => {
      dynamicFieldsRegistry.register(mockField1);

      const field = dynamicFieldsRegistry.get('testField1');

      expect(field).toEqual(mockField1);
    });

    it('should return undefined for non-existent field', () => {
      const field = dynamicFieldsRegistry.get('nonExistent');

      expect(field).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return all registered fields', () => {
      dynamicFieldsRegistry.registerMany([mockField1, mockField2]);

      const fields = dynamicFieldsRegistry.getAll();

      expect(fields).toHaveLength(2);
      expect(fields).toContainEqual(mockField1);
      expect(fields).toContainEqual(mockField2);
    });

    it('should return empty array when no fields registered', () => {
      const fields = dynamicFieldsRegistry.getAll();

      expect(fields).toEqual([]);
    });
  });

  describe('getBySection', () => {
    beforeEach(() => {
      dynamicFieldsRegistry.registerMany([mockField1, mockField2]);
    });

    it('should return only fields from policy section', () => {
      const policyFields = dynamicFieldsRegistry.getBySection('policy');

      expect(policyFields).toHaveLength(1);
      expect(policyFields[0].id).toBe('testField1');
    });

    it('should return only fields from claim section', () => {
      const claimFields = dynamicFieldsRegistry.getBySection('claim');

      expect(claimFields).toHaveLength(1);
      expect(claimFields[0].id).toBe('testField2');
    });

    it('should return empty array for section with no fields', () => {
      dynamicFieldsRegistry.clear();
      dynamicFieldsRegistry.register(mockField1);

      const claimFields = dynamicFieldsRegistry.getBySection('claim');

      expect(claimFields).toEqual([]);
    });
  });

  describe('has', () => {
    it('should return true for registered field', () => {
      dynamicFieldsRegistry.register(mockField1);

      expect(dynamicFieldsRegistry.has('testField1')).toBe(true);
    });

    it('should return false for non-registered field', () => {
      expect(dynamicFieldsRegistry.has('nonExistent')).toBe(false);
    });
  });

  describe('unregister', () => {
    it('should remove a registered field', () => {
      dynamicFieldsRegistry.register(mockField1);
      expect(dynamicFieldsRegistry.has('testField1')).toBe(true);

      const result = dynamicFieldsRegistry.unregister('testField1');

      expect(result).toBe(true);
      expect(dynamicFieldsRegistry.has('testField1')).toBe(false);
    });

    it('should return false when trying to remove non-existent field', () => {
      const result = dynamicFieldsRegistry.unregister('nonExistent');

      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all registered fields', () => {
      dynamicFieldsRegistry.registerMany([mockField1, mockField2]);
      expect(dynamicFieldsRegistry.size).toBe(2);

      dynamicFieldsRegistry.clear();

      expect(dynamicFieldsRegistry.size).toBe(0);
      expect(dynamicFieldsRegistry.getAll()).toEqual([]);
    });

    it('should handle clearing empty registry', () => {
      dynamicFieldsRegistry.clear();

      expect(dynamicFieldsRegistry.size).toBe(0);
    });
  });

  describe('size', () => {
    it('should return correct number of registered fields', () => {
      expect(dynamicFieldsRegistry.size).toBe(0);

      dynamicFieldsRegistry.register(mockField1);
      expect(dynamicFieldsRegistry.size).toBe(1);

      dynamicFieldsRegistry.register(mockField2);
      expect(dynamicFieldsRegistry.size).toBe(2);

      dynamicFieldsRegistry.unregister('testField1');
      expect(dynamicFieldsRegistry.size).toBe(1);
    });
  });
});
