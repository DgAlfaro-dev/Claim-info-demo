/**
 * Panama Tax ID Validators
 */

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
