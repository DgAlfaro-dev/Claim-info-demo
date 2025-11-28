/**
 * Panama Validators
 * Funciones de validación para formatos específicos de Panamá
 */

/**
 * Valida formato de RUC panameño
 * Formato: 1234567-1-123456 (número-dígito-número)
 */
export const isValidPanamaRuc = (ruc: string): boolean => {
  const rucRegex = /^\d{7}-\d{1}-\d{6}$/;
  return rucRegex.test(ruc);
};

/**
 * Valida formato de placa panameña
 * En Panamá las placas son solo números: 123456
 */
export const isValidPanamaPlate = (plate: string): boolean => {
  const plateRegex = /^\d{6}$/;
  return plateRegex.test(plate);
};
