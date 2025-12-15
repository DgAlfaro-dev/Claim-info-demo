/**
 * Panama - Pre-Submit Validators
 * Validaciones que se ejecutan antes del submit
 */

import {
  PreSubmitValidator,
  PreValidationResult,
  SubmitContext,
} from '@claim-info-demo/core';
import { isValidPanamaTaxId } from '../validations/validators';

/**
 * Valida que el Tax ID de Panamá sea válido
 */
export const validatePanamaTaxId: PreSubmitValidator = async (
  context: SubmitContext
): Promise<PreValidationResult> => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  // Obtener el Tax ID de los campos dinámicos
  const panamaTaxId = context.formData?.dynamicFields?.panamaTaxId;

  console.log('[validatePanamaTaxId] Valor recibido:', panamaTaxId);
  console.log('[validatePanamaTaxId] Todos los campos dinámicos:', context.formData?.dynamicFields);

  if (panamaTaxId) {
    if (!isValidPanamaTaxId(panamaTaxId)) {
      errors.panamaTaxId = 'El Tax ID de Panamá debe tener el formato correcto (ej: 8-123-456 o PE-12-3456)';
    }
  } else {
    warnings.panamaTaxId = 'El Tax ID no está presente en los campos dinámicos';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    warnings: Object.keys(warnings).length > 0 ? warnings : undefined,
    message: Object.keys(errors).length > 0 
      ? 'Errores de validación en Panamá' 
      : 'Validación de Panamá exitosa',
  };
};

/**
 * Valida la zona de seguro de Panamá
 */
export const validateInsuranceZone: PreSubmitValidator = async (
  context: SubmitContext
): Promise<PreValidationResult> => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  const insuranceZone = context.formData?.dynamicFields?.panamaInsuranceZone;

  console.log('[validateInsuranceZone] Valor recibido:', insuranceZone);

  if (!insuranceZone) {
    warnings.panamaInsuranceZone = 'La zona de seguro no está presente en los campos dinámicos';
  } else if (!['URBAN', 'RURAL', 'INTERIOR'].includes(insuranceZone)) {
    errors.panamaInsuranceZone = 'La zona de seguro debe ser URBAN, RURAL o INTERIOR';
  }

  // Warning si es zona rural (puede tener tarifas diferentes)
  if (insuranceZone === 'RURAL') {
    warnings.panamaInsuranceZone = 'Zona rural: verificar tarifas especiales';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    warnings: Object.keys(warnings).length > 0 ? warnings : undefined,
  };
};

/**
 * Valida campos requeridos específicos de Panamá
 */
export const validatePanamaRequiredFields: PreSubmitValidator = async (
  context: SubmitContext
): Promise<PreValidationResult> => {
  const errors: Record<string, string> = {};
  const claimInfo = context.formData?.claimInfo;

  // Validar RUC de Panamá (formato diferente a Costa Rica)
  const ruc = claimInfo?.policy?.Owner?.ruc;
  if (!ruc) {
    errors.ruc = 'El RUC/DV es requerido en Panamá';
  } else if (ruc.length < 3) {
    errors.ruc = 'El RUC/DV debe tener al menos 3 caracteres';
  }

  // Validar placa (Panamá tiene formato específico)
  const plate = claimInfo?.vehicleInformation?.plate;
  if (!plate) {
    errors.plate = 'La placa es requerida';
  } else {
    // Validar formato de placa panameña (ej: 123456 o ABC-1234)
    const isPanamaPlateFormat = /^(\d{6}|[A-Z]{3}-\d{4})$/.test(plate);
    if (!isPanamaPlateFormat) {
      errors.plate = 'Formato de placa inválido para Panamá (ej: 123456 o ABC-1234)';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    message: Object.keys(errors).length > 0 
      ? 'Faltan campos requeridos para Panamá' 
      : 'Todos los campos requeridos de Panamá están presentes',
  };
};

/**
 * Valida montos en balboas (PAB)
 */
export const validatePanamaAmounts: PreSubmitValidator = async (
  context: SubmitContext
): Promise<PreValidationResult> => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};
  const claimInfo = context.formData?.claimInfo;

  const coverageCode = claimInfo?.coverageCode;
  const coverages = claimInfo?.policy?.coverages || [];
  const currentCoverage = coverages.find((c: any) => c.coverageCode === coverageCode);
  const insuredAmount = Number(currentCoverage?.insuredAmount ?? '0');

  if (insuredAmount <= 0) {
    errors.insuredAmount = 'El monto asegurado debe ser mayor a 0';
  }

  // Validar límites específicos de Panamá
  if (insuredAmount > 500000) {
    warnings.insuredAmount = 'Monto asegurado muy alto para Panamá (> B/. 500,000)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    warnings: Object.keys(warnings).length > 0 ? warnings : undefined,
  };
};
