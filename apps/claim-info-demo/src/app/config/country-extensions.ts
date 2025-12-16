import { SupportedCountry, CountryConfigFactory } from '@claim-info-demo/core';
import { costaRicaConfig } from '@claim-info-demo/costa-rica';
import { panamaConfig } from '@claim-info-demo/panama';

/**
 * Registro de extensiones de países
 * Se ejecuta una vez al inicio de la aplicación
 */
export function registerCountryExtensions() {
  CountryConfigFactory.registerCountryExtension(
    SupportedCountry.COSTA_RICA,
    async () => costaRicaConfig
  );
  
  CountryConfigFactory.registerCountryExtension(
    SupportedCountry.PANAMA,
    async () => panamaConfig
  );
}
