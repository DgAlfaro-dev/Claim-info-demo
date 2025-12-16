export interface ICurrency {
  locale: string;
  code: string;
}

export const Colones = '₡';
export const Dollar = '$';
export const DollarCents = '¢';

export const Currency: Record<string, ICurrency> = {
  [Dollar]: { locale: 'en-US', code: 'USD' },
  [Colones]: { locale: 'es-CR', code: 'CRC' },
};

export const Shadows = ['0px 5px 5px 0px #00000014'];