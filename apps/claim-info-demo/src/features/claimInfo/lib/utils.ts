import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CLAIM_INFO_CONSTANTS } from '../model/constants';

/**
 * Formatea el género del conductor para mostrar
 */
export const getDriverGender = (gender?: string): string => {
  if (!gender) return 'N/A';
  
  const genderMap: Record<string, string> = CLAIM_INFO_CONSTANTS.GENDER_OPTIONS;
  
  return genderMap[gender] || 'N/A';
};

/**
 * Formatea la fecha de nacimiento del conductor
 */
export const getDriverBirthday = (birthday?: string): string => {
  if (!birthday) return 'N/A';
  
  try {
    const date = new Date(birthday);
    return format(date, 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    console.error('Error al formatear fecha de nacimiento:', error);
    return 'N/A';
  }
};

/**
 * Calcula la edad del conductor basado en su fecha de nacimiento
 */
export const calculateDriverAge = (birthday?: string): number | null => {
  if (!birthday) return null;
  
  try {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Error al calcular edad:', error);
    return null;
  }
};

/**
 * Valida si el conductor es mayor de edad
 */
export const isDriverAdult = (birthday?: string): boolean => {
  const age = calculateDriverAge(birthday);
  return age !== null && age >= CLAIM_INFO_CONSTANTS.MIN_DRIVER_AGE;
};

/**
 * Formatea el número de póliza
 */
export const formatPolicyNumber = (policyNumber?: string): string => {
  if (!policyNumber) return 'N/A';
  return policyNumber;
};

/**
 * Formatea el número de reclamo
 */
export const formatClaimNumber = (claimNumber?: string): string => {
  if (!claimNumber) return 'N/A';
  return claimNumber;
};