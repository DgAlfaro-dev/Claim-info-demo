/**
 * Store Actions
 * Acciones del store de Claim Info
 */

import { ClaimInfoData } from '../model/types/claimInfo';
import { mockClaimData } from './mockData';

/**
 * Acción para establecer información del reclamo
 */
export const setClaimInfo = (set: any) => (
  claimInfo: ClaimInfoData | undefined,
  isLoading: boolean
) => {
  set({ claimInfo: { data: claimInfo, isLoading: isLoading } });
};

/**
 * Acción para cargar datos mock
 */
export const loadMockData = (set: any) => () => {
  // Simular estado de carga
  set({ claimInfo: { data: undefined, isLoading: true } });

  // Simular delay de API
  setTimeout(() => {
    set({ claimInfo: { data: mockClaimData, isLoading: false } });
  }, 1500);
};

/**
 * Acción para actualizar género del conductor
 */
export const updateDriverGender = (get: any, set: any) => (gender: string) => {
  const currentState = get().claimInfo;
  if (currentState?.data) {
    const updatedData: ClaimInfoData = {
      ...currentState.data,
      claim: {
        ...currentState.data.claim,
        driver: {
          ...currentState.data.claim.driver,
          gender,
        },
      },
    };
    set({ claimInfo: { data: updatedData, isLoading: false } });
  }
};

/**
 * Acción para actualizar fecha de nacimiento del conductor
 */
export const updateDriverBirthday = (get: any, set: any) => (birthday: string) => {
  const currentState = get().claimInfo;
  if (currentState?.data) {
    const updatedData: ClaimInfoData = {
      ...currentState.data,
      claim: {
        ...currentState.data.claim,
        driver: {
          ...currentState.data.claim.driver,
          birthday,
        },
      },
    };
    set({ claimInfo: { data: updatedData, isLoading: false } });
  }
};

/**
 * Acción para actualizar exoneración de deducible
 */
export const updateDeductibleExoneration = (get: any, set: any) => (exonerated: boolean) => {
  const currentState = get().claimInfo;
  if (currentState?.data) {
    const updatedData: ClaimInfoData = {
      ...currentState.data,
      deductible: {
        ...currentState.data.deductible,
        exoneratedByAnalyst: exonerated,
      },
    };
    set({ claimInfo: { data: updatedData, isLoading: false } });
  }
};

/**
 * Acción para establecer valor de campo dinámico
 */
export const setDynamicFieldValue = (set: any, get: any) => (
  fieldId: string,
  value: any
) => {
  set((state: any) => ({
    dynamicFieldsData: {
      ...state.dynamicFieldsData,
      [fieldId]: value,
    },
  }));
};

/**
 * Acción para obtener valor de campo dinámico
 */
export const getDynamicFieldValue = (get: any) => (fieldId: string) => {
  const state = get();
  // Primero buscar en dynamicFieldsData
  if (fieldId in state.dynamicFieldsData) {
    return state.dynamicFieldsData[fieldId];
  }
  // Fallback: buscar directamente en el state (para valores de extensiones)
  return (state as any)[fieldId];
};

/**
 * Acción para inicializar campos dinámicos
 */
export const initializeDynamicFields = (set: any) => (
  initialValues: Record<string, any>
) => {
  set((state: any) => ({
    dynamicFieldsData: {
      ...state.dynamicFieldsData,
      ...initialValues,
    },
  }));
};
