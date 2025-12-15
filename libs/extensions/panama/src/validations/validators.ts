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
 * Valida formato de Tax ID panameño
 * Formatos válidos:
 * - Natural: 8-123-456 (tipo-provincia-consecutivo)
 * - Jurídica: PE-12-3456 o E-8-12345
 */
export const isValidPanamaTaxId = (taxId: string): boolean => {
  // Natural: 8-123-456
  const naturalRegex = /^[1-9N]-\d{1,3}-\d{1,6}$/;
  // Jurídica: PE-12-3456 o E-8-12345
  const juridicaRegex = /^(PE|E|N|PI|NT|AV)-\d{1,4}-\d{1,6}$/;
  
  return naturalRegex.test(taxId) || juridicaRegex.test(taxId);
};

/**
 * Valida formato de placa panameña
 * En Panamá las placas son solo números: 123456
 */
export const isValidPanamaPlate = (plate: string): boolean => {
  const plateRegex = /^\d{6}$/;
  return plateRegex.test(plate);
};
