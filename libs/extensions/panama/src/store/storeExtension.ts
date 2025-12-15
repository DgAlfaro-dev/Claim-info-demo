/**
 * Panama Store Extension
 * Extensión del store Zustand para Panamá
 */

/**
 * Extensión del store para Panamá
 */
export const panamaStoreExtension = {
  initialState: {
    // Estado adicional para Panamá con valores por defecto (demo)
    panamaTaxId: '8-123-456',
    panamaInsuranceZone: 'URBAN',
    hasPanamaSpecialTax: false,
  },
  actions: {
    // Actualizar RUC de Panamá
    updatePanamaTaxId: (set: any, get: any, taxId: string) => {
      set({ panamaTaxId: taxId });
    },

    // Actualizar zona de seguro
    updatePanamaInsuranceZone: (set: any, get: any, zone: string) => {
      set({ panamaInsuranceZone: zone });
    },

    // Marcar si tiene impuesto especial
    setPanamaSpecialTax: (set: any, get: any, hasTax: boolean) => {
      set({ hasPanamaSpecialTax: hasTax });
      
      // Si tiene impuesto especial, recalcular deducible
      if (hasTax) {
        const currentState = get();
        const currentDeductible = currentState.claimInfo?.data?.deductible?.Calculated || 0;
        const newDeductible = currentDeductible * 1.07; // 7% impuesto
        
        console.log('Aplicando impuesto especial de Panamá:', {
          original: currentDeductible,
          withTax: newDeductible,
        });
      }
    },
  },
};
