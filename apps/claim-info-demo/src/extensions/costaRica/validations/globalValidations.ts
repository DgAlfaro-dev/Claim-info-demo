/**
 * Costa Rica Global Validations
 * Validaciones globales para Costa Rica
 */

import { isValidCostaRicaCedula, isValidCostaRicaPlate } from './validators';

/**
 * Validaciones específicas de Costa Rica
 */
export const costaRicaValidations = {
  validateBeforeSubmit: (data: any) => {
    const errors: Record<string, string> = {};
    
    // Validar formato de cédula costarricense
    const ruc = data?.policy?.Owner?.ruc;
    if (ruc && !isValidCostaRicaCedula(ruc)) {
      errors.policyOwnerRuc = 'Formato de cédula inválido para Costa Rica';
    }

    // Validar placa costarricense
    const plate = data?.vehicleInformation?.plate;
    if (plate && !isValidCostaRicaPlate(plate)) {
      errors.vehiclePlate = 'Formato de placa inválido para Costa Rica';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
