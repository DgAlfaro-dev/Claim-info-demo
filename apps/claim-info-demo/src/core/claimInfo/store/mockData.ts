/**
 * Mock Claim Data
 * Datos dummy/mock para el demo
 */

import { ClaimInfoData } from '../model/types/claimInfo';

export const mockClaimData: ClaimInfoData = {
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
