import { Colones, Currency, DollarCents } from './constants/constants';

/**
 * Formatea un valor numérico a formato de moneda
 */
export const moneyFormat = (value = 0, currency = '₡') => {
  return new Intl.NumberFormat(Currency[currency].locale, {
    style: 'currency',
    currency: Currency[currency].code,
    minimumFractionDigits: 2,
  }).format(value);
};

/**
 * Formatea input de moneda mientras el usuario escribe
 */
export const formatCurrencyInput = (value: string, currency = '₡') => {
  const rawValue = value.replace(/\D/g, '');
  const numericValue = parseFloat(rawValue || '0');
  return moneyFormat(numericValue / 100, currency);
};

/**
 * Normaliza un string de moneda eliminando símbolos y formateando decimales
 */
export const normalizeCurrency = (value: string) => {
  const withoutCurrency = value.replace(/[^\d.,]/g, '');
  const hasCommaDecimal =
    withoutCurrency.includes(',') && withoutCurrency.includes('.');
  if (hasCommaDecimal)
    return withoutCurrency.replace(/,/g, '').replace('.', '.');
  if (withoutCurrency.includes(','))
    return withoutCurrency.replace(/\./g, '').replace(',', '.');
  return withoutCurrency.replace(/,/g, '');
};

/**
 * Convierte símbolo de centavos de dólar a colones
 */
export const convertSymbolDollarCentsToColones = (value: string) =>
  value.replace(DollarCents, Colones);