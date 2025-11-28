/**
 * Panama Global Validations
 * Validaciones globales para Panamá
 */

import { isValidPanamaRuc, isValidPanamaPlate } from './validators';

/**
 * Validaciones específicas de Panamá
 */
export const panamaValidations = {
  validateBeforeSubmit: (data: any) => {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    // Validar formato de RUC panameño
    const ruc = data?.policy?.Owner?.ruc;
    if (ruc && !isValidPanamaRuc(ruc)) {
      errors.policyOwnerRuc = 'Formato de RUC inválido para Panamá';
    }

    // Validar placa panameña (solo números)
    const plate = data?.vehicleInformation?.plate;
    if (plate && !isValidPanamaPlate(plate)) {
      errors.vehiclePlate = 'Formato de placa inválido para Panamá (solo números)';
    }

    // Verificar campos dinámicos de Panamá
    if (!data?.panamaTaxId) {
      errors.panamaTaxId = 'RUC del asegurado es requerido en Panamá';
    }

    if (!data?.panamaInsuranceZone) {
      errors.panamaInsuranceZone = 'Zona de cobertura es requerida en Panamá';
    }

    // Warning sobre depreciación alta
    const depreciation = data?.vehicleInformation?.depreciation;
    if (depreciation && depreciation > 30) {
      warnings.depreciation = 'Depreciación superior al 30% puede requerir aprobación especial';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings,
    };
  },
};
