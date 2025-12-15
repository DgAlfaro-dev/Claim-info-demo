/**
 * Costa Rica - Pre-Submit Validators
 * Validaciones que se ejecutan antes del submit
 */

import {
  PreSubmitValidator,
  PreValidationResult,
  SubmitContext,
} from '@claim-info-demo/core';
import { isValidCostaRicanRuc } from '../validations/validators';

/**
 * Valida que el RUC de Costa Rica sea válido
 */
export const validateCostaRicanRuc: PreSubmitValidator = async (
  context: SubmitContext
): Promise<PreValidationResult> => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  const ruc = context.formData?.claimInfo?.policy?.Owner?.ruc;

  if (ruc) {
    if (!isValidCostaRicanRuc(ruc)) {
      errors.ruc = 'El RUC de Costa Rica debe tener el formato correcto (9 o 10 dígitos)';
    }
  } else {
    warnings.ruc = 'No se proporcionó RUC del propietario de la póliza';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    warnings: Object.keys(warnings).length > 0 ? warnings : undefined,
    message: Object.keys(errors).length > 0 
      ? 'Errores de validación en Costa Rica' 
      : 'Validación de Costa Rica exitosa',
  };
};

/**
 * Valida que todos los campos requeridos estén presentes
 */
export const validateRequiredFields: PreSubmitValidator = async (
  context: SubmitContext
): Promise<PreValidationResult> => {
  const errors: Record<string, string> = {};
  const claimInfo = context.formData?.claimInfo;

  // Validar campos básicos requeridos
  if (!claimInfo?.policy?.Owner?.name) {
    errors.ownerName = 'El nombre del propietario es requerido';
  }

  if (!claimInfo?.vehicleInformation?.plate) {
    errors.plate = 'La placa del vehículo es requerida';
  }

  if (!claimInfo?.vehicleInformation?.model) {
    errors.model = 'El modelo del vehículo es requerido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    message: Object.keys(errors).length > 0 
      ? 'Faltan campos requeridos' 
      : 'Todos los campos requeridos están presentes',
  };
};

/**
 * Valida montos y valores numéricos
 */
export const validateAmounts: PreSubmitValidator = async (
  context: SubmitContext
): Promise<PreValidationResult> => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};
  const claimInfo = context.formData?.claimInfo;

  // Validar que el monto asegurado sea positivo
  const coverageCode = claimInfo?.coverageCode;
  const coverages = claimInfo?.policy?.coverages || [];
  const currentCoverage = coverages.find((c: any) => c.coverageCode === coverageCode);
  const insuredAmount = Number(currentCoverage?.insuredAmount ?? '0');

  if (insuredAmount <= 0) {
    errors.insuredAmount = 'El monto asegurado debe ser mayor a 0';
  }

  // Validar deducible
  const deductibleAmount = Number(claimInfo?.deductible?.amount ?? '0');
  if (deductibleAmount < 0) {
    errors.deductible = 'El deducible no puede ser negativo';
  }

  // Warning si el deducible es muy alto
  if (deductibleAmount > insuredAmount * 0.2) {
    warnings.deductible = 'El deducible es mayor al 20% del monto asegurado';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    warnings: Object.keys(warnings).length > 0 ? warnings : undefined,
  };
};
