import { storeExtensionRegistry, createStoreSlice } from '../../core/claimInfo/registry/storeExtensionRegistry';
import { StoreSlice } from '../../core/claimInfo/types';

describe('StoreExtensionRegistry', () => {
  beforeEach(() => {
    storeExtensionRegistry.clear();
  });

  afterEach(() => {
    storeExtensionRegistry.clear();
  });

  const mockSet = jest.fn();
  const mockGet = jest.fn();

  const mockSlice1: StoreSlice = (set, get) => ({
    field1: 'value1',
    updateField1: (newValue: string) => set({ field1: newValue }),
  });

  const mockSlice2: StoreSlice = (set, get) => ({
    field2: 'value2',
    updateField2: (newValue: string) => set({ field2: newValue }),
  });

  describe('register', () => {
    it('should register a new slice', () => {
      storeExtensionRegistry.register('CR', mockSlice1);

      expect(storeExtensionRegistry.has('CR')).toBe(true);
      expect(storeExtensionRegistry.get('CR')).toBe(mockSlice1);
    });

    it('should overwrite existing slice with warning', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      storeExtensionRegistry.register('CR', mockSlice1);
      storeExtensionRegistry.register('CR', mockSlice2);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('already registered')
      );
      expect(storeExtensionRegistry.get('CR')).toBe(mockSlice2);

      consoleSpy.mockRestore();
    });
  });

  describe('get', () => {
    it('should return slice for registered country', () => {
      storeExtensionRegistry.register('CR', mockSlice1);

      const slice = storeExtensionRegistry.get('CR');

      expect(slice).toBe(mockSlice1);
    });

    it('should return undefined for non-registered country', () => {
      const slice = storeExtensionRegistry.get('XX');

      expect(slice).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return all registered slices', () => {
      storeExtensionRegistry.register('CR', mockSlice1);
      storeExtensionRegistry.register('PA', mockSlice2);

      const slices = storeExtensionRegistry.getAll();

      expect(slices).toHaveLength(2);
      expect(slices).toContain(mockSlice1);
      expect(slices).toContain(mockSlice2);
    });

    it('should return empty array when no slices registered', () => {
      const slices = storeExtensionRegistry.getAll();

      expect(slices).toEqual([]);
    });
  });

  describe('has', () => {
    it('should return true for registered country', () => {
      storeExtensionRegistry.register('CR', mockSlice1);

      expect(storeExtensionRegistry.has('CR')).toBe(true);
    });

    it('should return false for non-registered country', () => {
      expect(storeExtensionRegistry.has('XX')).toBe(false);
    });
  });

  describe('unregister', () => {
    it('should remove a registered slice', () => {
      storeExtensionRegistry.register('CR', mockSlice1);
      expect(storeExtensionRegistry.has('CR')).toBe(true);

      const result = storeExtensionRegistry.unregister('CR');

      expect(result).toBe(true);
      expect(storeExtensionRegistry.has('CR')).toBe(false);
    });

    it('should return false when trying to remove non-existent slice', () => {
      const result = storeExtensionRegistry.unregister('XX');

      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all registered slices', () => {
      storeExtensionRegistry.register('CR', mockSlice1);
      storeExtensionRegistry.register('PA', mockSlice2);

      storeExtensionRegistry.clear();

      expect(storeExtensionRegistry.getAll()).toEqual([]);
    });

    it('should handle clearing empty registry', () => {
      storeExtensionRegistry.clear();

      expect(storeExtensionRegistry.getAll()).toEqual([]);
    });
  });

  describe('combineSlices', () => {
    it('should combine all registered slices into one object', () => {
      storeExtensionRegistry.register('CR', mockSlice1);
      storeExtensionRegistry.register('PA', mockSlice2);

      const combined = storeExtensionRegistry.combineSlices(mockSet, mockGet);

      expect(combined).toHaveProperty('field1', 'value1');
      expect(combined).toHaveProperty('field2', 'value2');
      expect(combined).toHaveProperty('updateField1');
      expect(combined).toHaveProperty('updateField2');
    });

    it('should return empty object when no slices registered', () => {
      const combined = storeExtensionRegistry.combineSlices(mockSet, mockGet);

      expect(combined).toEqual({});
    });

    it('should handle errors in individual slices', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const errorSlice: StoreSlice = () => {
        throw new Error('Test error');
      };

      storeExtensionRegistry.register('CR', mockSlice1);
      storeExtensionRegistry.register('ERROR', errorSlice);

      const combined = storeExtensionRegistry.combineSlices(mockSet, mockGet);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error combining slice'),
        expect.any(Error)
      );
      // Should still have the successful slice
      expect(combined).toHaveProperty('field1', 'value1');

      consoleSpy.mockRestore();
    });

    it('should allow actions from combined slices to be called', () => {
      storeExtensionRegistry.register('CR', mockSlice1);

      const combined = storeExtensionRegistry.combineSlices(mockSet, mockGet);

      expect(typeof combined.updateField1).toBe('function');
      
      // Call the action
      combined.updateField1('newValue');
      
      expect(mockSet).toHaveBeenCalledWith({ field1: 'newValue' });
    });
  });

  describe('createStoreSlice', () => {
    it('should create a typed store slice', () => {
      const slice = createStoreSlice((set, get) => ({
        myField: 'test',
        updateMyField: (value: string) => set({ myField: value }),
      }));

      const result = slice(mockSet, mockGet);

      expect(result).toHaveProperty('myField', 'test');
      expect(result).toHaveProperty('updateMyField');
      expect(typeof result.updateMyField).toBe('function');
    });

    it('should pass set and get to the slice creator', () => {
      const sliceCreator = jest.fn((set, get) => ({
        field: 'value',
      }));

      const slice = createStoreSlice(sliceCreator);
      slice(mockSet, mockGet);

      expect(sliceCreator).toHaveBeenCalledWith(mockSet, mockGet);
    });
  });
});
