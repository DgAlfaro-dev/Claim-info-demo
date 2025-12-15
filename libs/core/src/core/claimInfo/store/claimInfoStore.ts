'use client';

import { create } from 'zustand';
import { ClaimInfoData } from '../model/types/claimInfo';
import { storeExtensionRegistry } from '../registry/storeExtensionRegistry';
import * as actions from './storeActions';

interface ClaimInfoStoreData {
  data: ClaimInfoData | undefined;
  isLoading: boolean;
}

export interface ClaimInfoStoreProps {
  claimInfo: ClaimInfoStoreData | undefined;
  setClaimInfo: (claimInfo: ClaimInfoData | undefined, isLoading: boolean) => void;
  loadMockData: (countryCode?: any) => void;
  updateDriverGender: (gender: string) => void;
  updateDriverBirthday: (birthday: string) => void;
  updateDeductibleExoneration: (exonerated: boolean) => void;
  // Campos dinámicos
  dynamicFieldsData: Record<string, any>;
  setDynamicFieldValue: (fieldId: string, value: any) => void;
  getDynamicFieldValue: (fieldId: string) => any;
  initializeDynamicFields: (initialValues: Record<string, any>) => void;
  // Errores de validación
  validationErrors: Record<string, string>;
  setValidationErrors: (errors: Record<string, string>) => void;
  clearValidationErrors: () => void;
}

export const useClaimInfoStore = create<ClaimInfoStoreProps>((set, get) => {
  // Estado base del core
  const baseState: ClaimInfoStoreProps = {
    claimInfo: undefined,
    dynamicFieldsData: {},
    validationErrors: {},

    // Acciones del store
    setClaimInfo: actions.setClaimInfo(set),
    loadMockData: actions.loadMockData(set, get),
    updateDriverGender: actions.updateDriverGender(get, set),
    updateDriverBirthday: actions.updateDriverBirthday(get, set),
    updateDeductibleExoneration: actions.updateDeductibleExoneration(get, set),
    setDynamicFieldValue: actions.setDynamicFieldValue(set, get),
    getDynamicFieldValue: actions.getDynamicFieldValue(get),
    initializeDynamicFields: actions.initializeDynamicFields(set),
    setValidationErrors: (errors: Record<string, string>) => set({ validationErrors: errors }),
    clearValidationErrors: () => set({ validationErrors: {} }),
  };

  // Combinar con extensiones de países si existen
  const extensions = storeExtensionRegistry.combineSlices(set, get);

  // Inicializar dynamicFieldsData con valores de extensiones
  // (para campos como panamaTaxId, panamaInsuranceZone, etc.)
  const initialDynamicFields: Record<string, any> = {};
  if (extensions) {
    Object.keys(extensions).forEach((key) => {
      // Si la key no es una función y no es claimInfo, es un campo dinámico
      if (typeof extensions[key] !== 'function' && key !== 'claimInfo') {
        initialDynamicFields[key] = extensions[key];
      }
    });
  }

  return {
    ...baseState,
    dynamicFieldsData: initialDynamicFields,
    ...extensions,
  } as ClaimInfoStoreProps;
});