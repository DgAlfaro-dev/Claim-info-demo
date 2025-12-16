/**
 * Costa Rica Validators
 * Funciones de validación específicas para Costa Rica
 */

/**
 * Valida formato de RUC/Cédula costarricense
 * Formato válido: X-XXXX-XXXX o XX-XXXX-XXXX (1 o 2 dígitos, dash, 4 dígitos, dash, 4 dígitos)
 */
export function isValidCostaRicanRuc(ruc: string): boolean {
  if (!ruc || typeof ruc !== 'string') return false;
  
  const trimmedRuc = ruc.trim();
  
  // Regex para validar formato de RUC/Cédula costarricense
  // Formato: 1-2 dígitos - 4 dígitos - 4 dígitos
  const rucRegex = /^\d{1,2}-\d{4}-\d{4}$/;
  
  return rucRegex.test(trimmedRuc);
}

/**
 * Valida formato de Cédula costarricense
 * Alias de isValidCostaRicanRuc para consistencia
 */
export function isValidCostaRicaCedula(cedula: string): boolean {
  return isValidCostaRicanRuc(cedula);
}

/**
 * Valida formato de placa de Costa Rica
 * Formato válido: ABC-123 o ABC-1234 (3 letras, dash, 3 o 4 dígitos)
 */
export function isValidCostaRicaPlate(plate: string): boolean {
  if (!plate || typeof plate !== 'string') return false;
  
  const trimmedPlate = plate.trim();
  
  // Regex para validar formato de placa costarricense
  // Formato: 3 letras mayúsculas - 3 o 4 dígitos
  const plateRegex = /^[A-Z]{3}-\d{3,4}$/;
  
  return plateRegex.test(trimmedPlate);
}
