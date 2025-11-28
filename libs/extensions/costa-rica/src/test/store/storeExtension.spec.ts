import { costaRicaStoreExtension } from '../../store/storeExtension';

describe('Costa Rica Store Extension', () => {
  const mockSet = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    mockSet.mockClear();
    mockGet.mockClear();
  });

  describe('initialState', () => {
    it('should have initial state defined', () => {
      expect(costaRicaStoreExtension.initialState).toBeDefined();
    });

    it('should have hasSugef set to false by default', () => {
      expect(costaRicaStoreExtension.initialState.hasSugef).toBe(false);
    });

    it('should have hasSpecialDiscount set to false by default', () => {
      expect(costaRicaStoreExtension.initialState.hasSpecialDiscount).toBe(false);
    });

    it('should only have expected properties', () => {
      const keys = Object.keys(costaRicaStoreExtension.initialState);
      
      expect(keys).toHaveLength(2);
      expect(keys).toContain('hasSugef');
      expect(keys).toContain('hasSpecialDiscount');
    });
  });

  describe('actions', () => {
    it('should have actions defined', () => {
      expect(costaRicaStoreExtension.actions).toBeDefined();
      expect(typeof costaRicaStoreExtension.actions).toBe('object');
    });

    it('should have setSugefStatus action', () => {
      expect(costaRicaStoreExtension.actions.setSugefStatus).toBeDefined();
      expect(typeof costaRicaStoreExtension.actions.setSugefStatus).toBe('function');
    });

    it('should have setSpecialDiscount action', () => {
      expect(costaRicaStoreExtension.actions.setSpecialDiscount).toBeDefined();
      expect(typeof costaRicaStoreExtension.actions.setSpecialDiscount).toBe('function');
    });

    describe('setSugefStatus', () => {
      it('should call set with hasSugef true', () => {
        costaRicaStoreExtension.actions.setSugefStatus(mockSet, mockGet, true);

        expect(mockSet).toHaveBeenCalledWith({ hasSugef: true });
        expect(mockSet).toHaveBeenCalledTimes(1);
      });

      it('should call set with hasSugef false', () => {
        costaRicaStoreExtension.actions.setSugefStatus(mockSet, mockGet, false);

        expect(mockSet).toHaveBeenCalledWith({ hasSugef: false });
        expect(mockSet).toHaveBeenCalledTimes(1);
      });

      it('should accept set and get parameters', () => {
        costaRicaStoreExtension.actions.setSugefStatus(mockSet, mockGet, true);

        expect(mockSet).toHaveBeenCalled();
        // mockGet might not be called in this action, but should be available
      });
    });

    describe('setSpecialDiscount', () => {
      it('should call set with hasSpecialDiscount true', () => {
        costaRicaStoreExtension.actions.setSpecialDiscount(mockSet, mockGet, true);

        expect(mockSet).toHaveBeenCalledWith({ hasSpecialDiscount: true });
        expect(mockSet).toHaveBeenCalledTimes(1);
      });

      it('should call set with hasSpecialDiscount false', () => {
        costaRicaStoreExtension.actions.setSpecialDiscount(mockSet, mockGet, false);

        expect(mockSet).toHaveBeenCalledWith({ hasSpecialDiscount: false });
        expect(mockSet).toHaveBeenCalledTimes(1);
      });

      it('should accept set and get parameters', () => {
        costaRicaStoreExtension.actions.setSpecialDiscount(mockSet, mockGet, false);

        expect(mockSet).toHaveBeenCalled();
      });
    });

    it('should have exactly 2 actions', () => {
      const actionKeys = Object.keys(costaRicaStoreExtension.actions);
      
      expect(actionKeys).toHaveLength(2);
      expect(actionKeys).toContain('setSugefStatus');
      expect(actionKeys).toContain('setSpecialDiscount');
    });
  });

  describe('store extension structure', () => {
    it('should have both initialState and actions', () => {
      expect(costaRicaStoreExtension).toHaveProperty('initialState');
      expect(costaRicaStoreExtension).toHaveProperty('actions');
    });

    it('should only have initialState and actions properties', () => {
      const keys = Object.keys(costaRicaStoreExtension);
      
      expect(keys).toHaveLength(2);
      expect(keys).toContain('initialState');
      expect(keys).toContain('actions');
    });
  });
});
