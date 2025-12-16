import { panamaStoreExtension } from '../../store/storeExtension';

describe('Panama Store Extension', () => {
  it('should be defined', () => {
    expect(panamaStoreExtension).toBeDefined();
  });

  describe('initial state', () => {
    it('should have initialState defined', () => {
      expect(panamaStoreExtension.initialState).toBeDefined();
      expect(typeof panamaStoreExtension.initialState).toBe('object');
    });

    it('should have panamaTaxId with demo value', () => {
      expect(panamaStoreExtension.initialState).toHaveProperty('panamaTaxId');
      expect(panamaStoreExtension.initialState.panamaTaxId).toBe('1234567-1-123456');
    });

    it('should have panamaInsuranceZone with default value', () => {
      expect(panamaStoreExtension.initialState).toHaveProperty('panamaInsuranceZone');
      expect(panamaStoreExtension.initialState.panamaInsuranceZone).toBe('PANAMA_CITY');
    });

    it('should have hasPanamaSpecialTax set to false', () => {
      expect(panamaStoreExtension.initialState).toHaveProperty('hasPanamaSpecialTax');
      expect(panamaStoreExtension.initialState.hasPanamaSpecialTax).toBe(false);
    });

    it('should only have 3 properties', () => {
      const keys = Object.keys(panamaStoreExtension.initialState);
      expect(keys).toHaveLength(3);
      expect(keys).toContain('panamaTaxId');
      expect(keys).toContain('panamaInsuranceZone');
      expect(keys).toContain('hasPanamaSpecialTax');
    });
  });

  describe('actions', () => {
    it('should have actions defined', () => {
      expect(panamaStoreExtension.actions).toBeDefined();
      expect(typeof panamaStoreExtension.actions).toBe('object');
    });

    describe('updatePanamaTaxId', () => {
      it('should be defined', () => {
        expect(panamaStoreExtension.actions.updatePanamaTaxId).toBeDefined();
        expect(typeof panamaStoreExtension.actions.updatePanamaTaxId).toBe('function');
      });

      it('should update panamaTaxId in state', () => {
        const mockSet = jest.fn();
        const mockGet = jest.fn();
        const newTaxId = '9876543-2-654321';

        panamaStoreExtension.actions.updatePanamaTaxId(mockSet, mockGet, newTaxId);

        expect(mockSet).toHaveBeenCalledWith({ panamaTaxId: newTaxId });
        expect(mockSet).toHaveBeenCalledTimes(1);
      });

      it('should accept empty string', () => {
        const mockSet = jest.fn();
        const mockGet = jest.fn();

        panamaStoreExtension.actions.updatePanamaTaxId(mockSet, mockGet, '');

        expect(mockSet).toHaveBeenCalledWith({ panamaTaxId: '' });
      });
    });

    describe('updatePanamaInsuranceZone', () => {
      it('should be defined', () => {
        expect(panamaStoreExtension.actions.updatePanamaInsuranceZone).toBeDefined();
        expect(typeof panamaStoreExtension.actions.updatePanamaInsuranceZone).toBe('function');
      });

      it('should update panamaInsuranceZone in state', () => {
        const mockSet = jest.fn();
        const mockGet = jest.fn();
        const newZone = 'COLON';

        panamaStoreExtension.actions.updatePanamaInsuranceZone(mockSet, mockGet, newZone);

        expect(mockSet).toHaveBeenCalledWith({ panamaInsuranceZone: newZone });
        expect(mockSet).toHaveBeenCalledTimes(1);
      });

      it('should accept any zone value', () => {
        const mockSet = jest.fn();
        const mockGet = jest.fn();
        const zones = ['PANAMA_CITY', 'CHIRIQUI', 'BOCAS_DEL_TORO', 'OTHER'];

        zones.forEach((zone) => {
          mockSet.mockClear();
          panamaStoreExtension.actions.updatePanamaInsuranceZone(mockSet, mockGet, zone);
          expect(mockSet).toHaveBeenCalledWith({ panamaInsuranceZone: zone });
        });
      });
    });

    describe('setPanamaSpecialTax', () => {
      it('should be defined', () => {
        expect(panamaStoreExtension.actions.setPanamaSpecialTax).toBeDefined();
        expect(typeof panamaStoreExtension.actions.setPanamaSpecialTax).toBe('function');
      });

      it('should update hasPanamaSpecialTax in state', () => {
        const mockSet = jest.fn();
        const mockGet = jest.fn(() => ({
          claimInfo: { data: { deductible: { Calculated: 1000 } } },
        }));

        panamaStoreExtension.actions.setPanamaSpecialTax(mockSet, mockGet, true);

        expect(mockSet).toHaveBeenCalledWith({ hasPanamaSpecialTax: true });
      });

      it('should handle false value', () => {
        const mockSet = jest.fn();
        const mockGet = jest.fn(() => ({}));

        panamaStoreExtension.actions.setPanamaSpecialTax(mockSet, mockGet, false);

        expect(mockSet).toHaveBeenCalledWith({ hasPanamaSpecialTax: false });
        expect(mockSet).toHaveBeenCalledTimes(1);
      });

      it('should call get() when tax is true', () => {
        const mockSet = jest.fn();
        const mockGet = jest.fn(() => ({
          claimInfo: { data: { deductible: { Calculated: 1000 } } },
        }));

        panamaStoreExtension.actions.setPanamaSpecialTax(mockSet, mockGet, true);

        expect(mockGet).toHaveBeenCalled();
      });

      it('should not throw when state has no deductible', () => {
        const mockSet = jest.fn();
        const mockGet = jest.fn(() => ({}));

        expect(() => {
          panamaStoreExtension.actions.setPanamaSpecialTax(mockSet, mockGet, true);
        }).not.toThrow();
      });

      it('should calculate new deductible with 7% tax', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const mockSet = jest.fn();
        const mockGet = jest.fn(() => ({
          claimInfo: { data: { deductible: { Calculated: 1000 } } },
        }));

        panamaStoreExtension.actions.setPanamaSpecialTax(mockSet, mockGet, true);

        expect(consoleSpy).toHaveBeenCalledWith(
          'Aplicando impuesto especial de Panamá:',
          expect.objectContaining({
            original: 1000,
            withTax: 1070,
          })
        );

        consoleSpy.mockRestore();
      });
    });

    it('should have exactly 3 actions', () => {
      const actionKeys = Object.keys(panamaStoreExtension.actions);
      expect(actionKeys).toHaveLength(3);
      expect(actionKeys).toContain('updatePanamaTaxId');
      expect(actionKeys).toContain('updatePanamaInsuranceZone');
      expect(actionKeys).toContain('setPanamaSpecialTax');
    });
  });

  describe('structure', () => {
    it('should only have initialState and actions', () => {
      const keys = Object.keys(panamaStoreExtension);
      expect(keys).toHaveLength(2);
      expect(keys).toContain('initialState');
      expect(keys).toContain('actions');
    });
  });
});
