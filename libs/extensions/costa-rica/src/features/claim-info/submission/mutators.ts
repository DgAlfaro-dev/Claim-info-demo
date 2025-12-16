/**
 * Costa Rica - Payload Mutators
 * Funciones que modifican el payload antes de enviarlo al backend
 */

import { PayloadMutator, SubmitContext } from '@claim-info-demo/core';

/**
 * Agrega metadatos específicos de Costa Rica al payload
 */
export const addCostaRicaMetadata: PayloadMutator = async (
  context: SubmitContext
): Promise<void> => {
  // Agregar información del país
  context.payload.countryMetadata = {
    country: 'Costa Rica',
    countryCode: 'CR',
    currency: 'CRC',
    timezone: 'America/Costa_Rica',
    locale: 'es-CR',
  };

  // Agregar timestamp local
  context.payload.submittedAt = new Date().toISOString();
};

/**
 * Normaliza el formato del RUC para Costa Rica
 */
export const normalizeCostaRicanRuc: PayloadMutator = async (
  context: SubmitContext
): Promise<void> => {
  // Verificar que existan todas las estructuras necesarias
  if (!context.payload?.claimInfo?.policy?.Owner) {
    return; // No hay Owner, salir sin hacer nada
  }

  const ruc = context.payload.claimInfo.policy.Owner.ruc;

  if (ruc && typeof ruc === 'string') {
    // Remover espacios y guiones
    const normalizedRuc = ruc.replace(/[\s-]/g, '');

    // Actualizar en el payload
    context.payload.claimInfo.policy.Owner.ruc = normalizedRuc;

    // Agregar metadata sobre la normalización
    context.metadata.rucNormalized = true;
    context.metadata.originalRuc = ruc;
  }
};

/**
 * Convierte montos de colones a formato estandarizado
 */
export const normalizeCostaRicanAmounts: PayloadMutator = async (
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

  // Agregar símbolo de moneda al payload
  context.payload.claimInfo.currencySymbol = '₡';
  context.payload.claimInfo.currencyCode = 'CRC';
};

/**
 * Agrega información adicional del vehículo para Costa Rica
 */
export const enrichVehicleInformation: PayloadMutator = async (
  context: SubmitContext
): Promise<void> => {
  // Verificar que exista la estructura completa
  if (!context.payload?.claimInfo?.vehicleInformation) {
    return;
  }

  const vehicleInfo = context.payload.claimInfo.vehicleInformation;

  // Agregar metadata del vehículo
  vehicleInfo.country = 'CR';
  
  // Determinar si es vehículo particular o comercial basado en la placa
  const plate = vehicleInfo.plate || '';
  const isCommercial = /^[A-Z]{3}\d{3}/.test(plate); // Formato ABC123
  const isPrivate = /^\d{6}/.test(plate); // Formato 123456

  vehicleInfo.vehicleType = 
    isCommercial ? 'commercial' : isPrivate ? 'private' : 'unknown';
};
