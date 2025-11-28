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
  loadMockData: () => void;
  updateDriverGender: (gender: string) => void;
  updateDriverBirthday: (birthday: string) => void;
  updateDeductibleExoneration: (exonerated: boolean) => void;
  // Campos dinámicos
  dynamicFieldsData: Record<string, any>;
  setDynamicFieldValue: (fieldId: string, value: any) => void;
  getDynamicFieldValue: (fieldId: string) => any;
  initializeDynamicFields: (initialValues: Record<string, any>) => void;
}

export const useClaimInfoStore = create<ClaimInfoStoreProps>((set, get) => {
  // Estado base del core
  const baseState: ClaimInfoStoreProps = {
    claimInfo: undefined,
    dynamicFieldsData: {},

    // Acciones del store
    setClaimInfo: actions.setClaimInfo(set),
    loadMockData: actions.loadMockData(set),
    updateDriverGender: actions.updateDriverGender(get, set),
    updateDriverBirthday: actions.updateDriverBirthday(get, set),
    updateDeductibleExoneration: actions.updateDeductibleExoneration(get, set),
    setDynamicFieldValue: actions.setDynamicFieldValue(set, get),
    getDynamicFieldValue: actions.getDynamicFieldValue(get),
    initializeDynamicFields: actions.initializeDynamicFields(set),
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