/**
 * Mock Claim Data
 * Datos dummy/mock para el demo
 */

import { ClaimInfoData } from '../model/types/claimInfo';

/**
 * Datos mock para Costa Rica (Moneda: Colones - CRC)
 */
export const mockClaimDataCostaRica: ClaimInfoData = {
  policy: {
    policyNumber: 'POL-CR-2024-001234',
    Owner: {
      name: 'Juan Carlos',
      lastName: 'Rodríguez Pérez',
      ruc: '1-1234-5678', // Formato Costa Rica
    },
    Broker: {
      FullName: 'Seguros del Pacífico S.A.',
    },
    coverages: [
      {
        coverageCode: '001',
        description: 'Cobertura Amplia',
        insuredAmount: '15000000', // ₡15,000,000 Colones
      },
      {
        coverageCode: '002',
        description: 'Cobertura Básica',
        insuredAmount: '8000000', // ₡8,000,000 Colones
      },
    ],
    payOverdueDays: 0,
  },
  vehicleInformation: {
    model: 'Toyota Corolla',
    plate: 'ABC-1234', // Formato Costa Rica
    serialChassis: 'JT2BG22K0X0123456',
    year: 2022,
    depreciation: 15,
  },
  claim: {
    claimNumber: 'CLM-CR-2024-567890',
    fud: 'APPLY',
    driver: {
      name: 'María',
      lastName: 'González',
      gender: 'F',
      birthday: '1990-05-15',
    },
  },
  deductible: {
    Base: 150000, // ₡150,000 Colones
    Calculated: 135000, // ₡135,000 Colones
    exoneratedByAnalyst: false,
  },
  coverageCode: '001',
  endorsement: 'Plan Premium',
  totalLossPercentage: '10.6',
  creditor: 'Banco Nacional de Costa Rica',
  deductiblePayment: 'En taller',
  totalClaimCost: 2450000, // ₡2,450,000 Colones
  currency: 'CRC', // Colones costarricenses
};

/**
 * Datos mock para Panama (Moneda: Dólares - USD/PAB)
 */
export const mockClaimDataPanama: ClaimInfoData = {
  policy: {
    policyNumber: 'POL-PA-2024-789456',
    Owner: {
      name: 'Roberto',
      lastName: 'Martínez López',
      ruc: '1234567-1-123456', // Formato Panama
    },
    Broker: {
      FullName: 'Aseguradora Mundial de Panamá S.A.',
    },
    coverages: [
      {
        coverageCode: '001',
        description: 'Cobertura Amplia',
        insuredAmount: '25000', // $25,000 USD
      },
      {
        coverageCode: '002',
        description: 'Cobertura Básica',
        insuredAmount: '15000', // $15,000 USD
      },
    ],
    payOverdueDays: 5,
  },
  vehicleInformation: {
    model: 'Honda Civic',
    plate: '123456', // Formato Panama (solo números)
    serialChassis: '2HGFC2F59MH123456',
    year: 2023,
    depreciation: 12,
  },
  claim: {
    claimNumber: 'CLM-PA-2024-123987',
    fud: 'NONE',
    driver: {
      name: 'Ana',
      lastName: 'Fernández',
      gender: 'F',
      birthday: '1988-08-20',
    },
  },
  deductible: {
    Base: 500, // $500 USD
    Calculated: 450, // $450 USD
    exoneratedByAnalyst: false,
  },
  coverageCode: '001',
  endorsement: 'Plan Ejecutivo',
  totalLossPercentage: '8.5',
  creditor: 'Banco General de Panamá',
  deductiblePayment: 'En aseguradora',
  totalClaimCost: 4500, // $4,500 USD
  currency: 'USD', // Dólares (USD - Panama usa dólares estadounidenses)
};

/**
 * Datos mock por defecto (Costa Rica)
 * Se mantiene para compatibilidad
 */
export const mockClaimData: ClaimInfoData = mockClaimDataCostaRica;
