/**
 * Panama - Payload Mutators
 * Funciones que modifican el payload antes de enviarlo al backend
 */

import { PayloadMutator, SubmitContext } from '@claim-info-demo/core';

/**
 * Agrega metadatos específicos de Panamá al payload
 */
export const addPanamaMetadata: PayloadMutator = async (
  context: SubmitContext
): Promise<void> => {
  context.payload.countryMetadata = {
    country: 'Panama',
    countryCode: 'PA',
    currency: 'PAB',
    currencyAlternative: 'USD', // Panamá usa USD también
    timezone: 'America/Panama',
    locale: 'es-PA',
  };

  context.payload.submittedAt = new Date().toISOString();
};

/**
 * Normaliza el formato del Tax ID de Panamá
 */
export const normalizePanamaTaxId: PayloadMutator = async (
  context: SubmitContext
): Promise<void> => {
  const taxId = context.formData?.dynamicFields?.panamaTaxId;

  if (taxId) {
    // Normalizar formato (remover espacios extra)
    const normalizedTaxId = taxId.trim().toUpperCase();

    // Agregar al payload en una sección específica de Panamá
    if (!context.payload.panamaSpecific) {
      context.payload.panamaSpecific = {};
    }

    context.payload.panamaSpecific.taxId = normalizedTaxId;
    context.metadata.taxIdNormalized = true;
    context.metadata.originalTaxId = taxId;
  }
};

/**
 * Agrega información de la zona de seguro al payload
 */
export const addInsuranceZoneInformation: PayloadMutator = async (
  context: SubmitContext
): Promise<void> => {
  const insuranceZone = context.formData?.dynamicFields?.panamaInsuranceZone;

  if (insuranceZone) {
    if (!context.payload.panamaSpecific) {
      context.payload.panamaSpecific = {};
    }

    context.payload.panamaSpecific.insuranceZone = insuranceZone;

    // Agregar metadata sobre tarifas según la zona
    const zoneTariffs = {
      URBAN: { factor: 1.0, description: 'Zona urbana - tarifa estándar' },
      RURAL: { factor: 1.2, description: 'Zona rural - tarifa incrementada 20%' },
      INTERIOR: { factor: 1.15, description: 'Interior - tarifa incrementada 15%' },
    };

    context.payload.panamaSpecific.zoneTariff = 
      zoneTariffs[insuranceZone as keyof typeof zoneTariffs] || zoneTariffs.URBAN;
  }
};

/**
 * Convierte montos de balboas a formato estandarizado
 */
export const normalizePanamaAmounts: PayloadMutator = async (
  context: SubmitContext
): Promise<void> => {
  // Verificar que exista la estructura de claimInfo
  if (!context.payload?.claimInfo) {
    return;
  }

  // Asegurar que los montos estén en formato numérico (si existen)
  if (context.payload.claimInfo.deductible?.amount) {
    const amount = context.payload.claimInfo.deductible.amount;
    context.payload.claimInfo.deductible.amount = 
      typeof amount === 'string' ? parseFloat(amount) : amount;
  }

  // Agregar información de moneda
  context.payload.claimInfo.currencySymbol = 'B/.';
  context.payload.claimInfo.currencyCode = 'PAB';
  context.payload.claimInfo.currencyAlternative = 'USD'; // Panamá usa USD también
};

/**
 * Enriquece la información del vehículo con datos específicos de Panamá
 */
export const enrichPanamaVehicleInformation: PayloadMutator = async (
  context: SubmitContext
): Promise<void> => {
  // Verificar que exista la estructura completa
  if (!context.payload?.claimInfo?.vehicleInformation) {
    return;
  }

  const vehicleInfo = context.payload.claimInfo.vehicleInformation;

  // Agregar metadata del país
  vehicleInfo.country = 'PA';
  
  // Determinar tipo de vehículo basado en la placa
  const plate = vehicleInfo.plate || '';
  const isNumericPlate = /^\d{6}$/.test(plate); // Formato 123456
  const isAlphaNumericPlate = /^[A-Z]{3}-\d{4}$/.test(plate); // Formato ABC-1234

  let vehicleType = 'unknown';
  if (isNumericPlate) {
    vehicleType = 'private';
  } else if (isAlphaNumericPlate) {
    vehicleType = 'commercial';
  }

  vehicleInfo.vehicleType = vehicleType;
  vehicleInfo.plateFormat = 
    isNumericPlate ? 'numeric' : isAlphaNumericPlate ? 'alphanumeric' : 'unknown';
};

/**
 * Agrega información regulatoria de Panamá
 */
export const addRegulatoryInformation: PayloadMutator = async (
  context: SubmitContext
): Promise<void> => {
  if (!context.payload.panamaSpecific) {
    context.payload.panamaSpecific = {};
  }

  // Agregar información sobre regulaciones aplicables
  context.payload.panamaSpecific.regulatory = {
    superintendenciaCode: 'SSRP', // Superintendencia de Seguros y Reaseguros de Panamá
    complianceVersion: '2024.1',
    dataProtectionLaw: 'Ley 81 de 2019', // Ley de Protección de Datos Personales
    submissionType: 'electronic',
  };
};
