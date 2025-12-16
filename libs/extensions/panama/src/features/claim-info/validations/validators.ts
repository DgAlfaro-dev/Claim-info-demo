/**
 * Panama Validators
 * Funciones de validación específicas para Panamá
 */

/**
 * Valida formato de RUC panameño
 * Formato válido: XXXXXXX-X-XXXXXX (7 dígitos, dash, 1 dígito, dash, 6 dígitos)
 */
export function isValidPanamaRuc(ruc: string): boolean {
  if (!ruc || typeof ruc !== 'string') return false;
  
  const trimmedRuc = ruc.trim();
  
  // Regex para validar formato de RUC panameño
  // Formato: 7 dígitos - 1 dígito - 6 dígitos
  const rucRegex = /^\d{7}-\d{1}-\d{6}$/;
  
  return rucRegex.test(trimmedRuc);
}

/**
 * Valida formato de Tax ID panameño (Cédula)
 * Formatos válidos:
 * - Natural: 8-123-456 (tipo-provincia-consecutivo)
 * - Jurídica: PE-12-3456 o E-8-12345
 */
export function isValidPanamaTaxId(taxId: string): boolean {
  if (!taxId || typeof taxId !== 'string') return false;
  
  const trimmedTaxId = taxId.trim();
  
  // Natural: 8-123-456 (1 dígito o N - 1-3 dígitos - 1-6 dígitos)
  const naturalRegex = /^[1-9N]-\d{1,3}-\d{1,6}$/;
  // Jurídica: PE-12-3456 o E-8-12345 (prefijo - dígitos - dígitos)
  const juridicaRegex = /^(PE|E|N|PI|NT|AV)-\d{1,4}-\d{1,6}$/;
  
  return naturalRegex.test(trimmedTaxId) || juridicaRegex.test(trimmedTaxId);
}

/**
 * Valida formato de placa de Panamá
 * Formato válido: 6 dígitos consecutivos sin guiones
 */
export function isValidPanamaPlate(plate: string): boolean {
  if (!plate || typeof plate !== 'string') return false;
  
  const trimmedPlate = plate.trim();
  
  // Regex para validar formato de placa panameña
  // Formato: exactamente 6 dígitos
  const plateRegex = /^\d{6}$/;
  
  return plateRegex.test(trimmedPlate);
}
