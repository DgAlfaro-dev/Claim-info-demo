/**
 * Store Actions
 * Acciones del store de Claim Info
 */

import { ClaimInfoData } from '../model/types/claimInfo';
import { SupportedCountry } from '../../../infrastructure/country-config/types/countryConfig';
import { mockClaimData, mockClaimDataCostaRica, mockClaimDataPanama } from './mockData';

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
 * Obtiene los datos mock según el país
 */
const getMockDataByCountry = (countryCode?: SupportedCountry): ClaimInfoData => {
  switch (countryCode) {
    case SupportedCountry.COSTA_RICA:
      return mockClaimDataCostaRica;
    case SupportedCountry.PANAMA:
      return mockClaimDataPanama;
    default:
      return mockClaimData; // Default: Costa Rica
  }
};

/**
 * Acción para cargar datos mock
 * Carga datos específicos según el país activo
 */
export const loadMockData = (set: any, get?: any) => async (countryCode?: SupportedCountry) => {
  // Simular estado de carga
  set({ claimInfo: { data: undefined, isLoading: true } });

  // Si no se proporciona countryCode, intentar obtenerlo del contexto
  let activeCountry = countryCode;
  if (!activeCountry && get) {
    try {
      // Intentar importar el contexto dinámicamente
      const { useCountryConfigContext } = await import('../../../infrastructure/country-config/context/CountryConfigContext');
      const context = useCountryConfigContext();
      activeCountry = context?.currentCountry ?? undefined;
    } catch (error) {
      console.warn('No se pudo obtener el país activo del contexto:', error);
    }
  }

  // Simular delay de API
  setTimeout(() => {
    const mockDataToLoad = getMockDataByCountry(activeCountry);
    set({ claimInfo: { data: mockDataToLoad, isLoading: false } });
    console.log(`✓ Mock data loaded for country: ${activeCountry || 'default (CR)'}`);
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
 * IMPORTANTE: Reemplaza completamente los campos dinámicos (no hace merge)
 * Esto es crucial para limpiar campos del país anterior al cambiar de país
 */
export const initializeDynamicFields = (set: any) => (
  initialValues: Record<string, any>
) => {
  set((state: any) => ({
    dynamicFieldsData: initialValues, // Reemplaza completamente, no merge
  }));
};
