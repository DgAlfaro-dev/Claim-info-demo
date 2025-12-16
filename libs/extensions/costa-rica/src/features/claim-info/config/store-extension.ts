/**
 * Costa Rica Store Extension
 * Extensión del store Zustand para Costa Rica
 */

/**
 * Extensión del store para Costa Rica
 * Agrega funcionalidad específica del país
 */
export const costaRicaStoreExtension = {
  initialState: {
    // Estado adicional para Costa Rica
    hasSugef: false, // Reportado a SUGEF
    hasSpecialDiscount: false,
  },
  actions: {
    // Acción para marcar como reportado a SUGEF
    setSugefStatus: (set: any, get: any, status: boolean) => {
      set({ hasSugef: status });
    },
    
    // Acción para aplicar descuento especial
    setSpecialDiscount: (set: any, get: any, hasDiscount: boolean) => {
      set({ hasSpecialDiscount: hasDiscount });
    },
  },
};
