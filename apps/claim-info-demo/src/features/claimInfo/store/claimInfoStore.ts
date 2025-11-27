'use client';

import { create } from 'zustand';
import { ClaimInfoData } from '../model/types/claimInfo';

interface ClaimInfoStoreData {
  data: ClaimInfoData | undefined;
  isLoading: boolean;
}

interface ClaimInfoStoreProps {
  claimInfo: ClaimInfoStoreData | undefined;
  setClaimInfo: (claimInfo: ClaimInfoData | undefined, isLoading: boolean) => void;
  loadMockData: () => void;
  updateDriverGender: (gender: string) => void;
  updateDriverBirthday: (birthday: string) => void;
  updateDeductibleExoneration: (exonerated: boolean) => void;
}

// Datos dummy/mock para el demo
const mockClaimData: ClaimInfoData = {
  policy: {
    policyNumber: 'POL-2024-001234',
    Owner: {
      name: 'Juan Carlos',
      lastName: 'Rodríguez Pérez',
      ruc: '1-1234-5678',
    },
    Broker: {
      FullName: 'Seguros del Pacífico S.A.',
    },
    coverages: [
      {
        coverageCode: '001',
        description: 'Cobertura Amplia',
        insuredAmount: '15000000',
      },
      {
        coverageCode: '002',
        description: 'Cobertura Básica',
        insuredAmount: '8000000',
      },
    ],
    payOverdueDays: 0,
  },
  vehicleInformation: {
    model: 'Toyota Corolla',
    plate: 'ABC-1234',
    serialChassis: 'JT2BG22K0X0123456',
    year: 2022,
    depreciation: 15,
  },
  claim: {
    claimNumber: 'CLM-2024-567890',
    fud: 'APPLY',
    driver: {
      name: 'María',
      lastName: 'González',
      gender: 'F',
      birthday: '1990-05-15',
    },
  },
  deductible: {
    Base: 150000,
    Calculated: 135000,
    exoneratedByAnalyst: false,
  },
  coverageCode: '001',
  endorsement: 'Plan Premium',
  totalLossPercentage: '10.6',
  creditor: 'Banco Nacional',
  deductiblePayment: 'En taller',
  totalClaimCost: 2450000,
};

export const useClaimInfoStore = create<ClaimInfoStoreProps>((set, get) => ({
  claimInfo: undefined,

  // Establecer información del reclamo
  setClaimInfo: (claimInfo, isLoading) =>
    set({ claimInfo: { data: claimInfo, isLoading: isLoading } }),

  // Cargar datos mock para el demo
  loadMockData: () => {
    // Simular estado de carga
    set({ claimInfo: { data: undefined, isLoading: true } });

    // Simular delay de API
    setTimeout(() => {
      set({ claimInfo: { data: mockClaimData, isLoading: false } });
    }, 1500);
  },

  // Actualizar género del conductor
  updateDriverGender: (gender: string) => {
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
  },

  // Actualizar fecha de nacimiento del conductor
  updateDriverBirthday: (birthday: string) => {
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
  },

  // Actualizar exoneración de deducible
  updateDeductibleExoneration: (exonerated: boolean) => {
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
  },
}));