/**
 * Costa Rica Validators
 * Funciones de validación para formatos específicos de Costa Rica
 */

/**
 * Valida formato de cédula costarricense
 * Formato: 0-0000-0000 o 00-0000-0000
 */
export const isValidCostaRicaCedula = (cedula: string): boolean => {
  const cedulaRegex = /^\d{1,2}-\d{4}-\d{4}$/;
  return cedulaRegex.test(cedula);
};

/**
 * Valida formato de RUC costarricense
 * Acepta: cédula (1-1234-5678) o RUC sin formato (9-10 dígitos)
 */
export const isValidCostaRicanRuc = (ruc: string): boolean => {
  // Formato cédula: 1-1234-5678 o 01-1234-5678
  const cedulaRegex = /^\d{1,2}-\d{4}-\d{4}$/;
  
  // Remover guiones y espacios para validar solo dígitos
  const cleanRuc = ruc.replace(/[\s-]/g, '');
  // Debe tener 9 o 10 dígitos
  const digitsOnlyRegex = /^\d{9,10}$/;
  
  return cedulaRegex.test(ruc) || digitsOnlyRegex.test(cleanRuc);
};

/**
 * Valida formato de placa costarricense
 * Formato: ABC-123 o ABC-1234
 */
export const isValidCostaRicaPlate = (plate: string): boolean => {
  const plateRegex = /^[A-Z]{3}-\d{3,4}$/;
  return plateRegex.test(plate);
};
