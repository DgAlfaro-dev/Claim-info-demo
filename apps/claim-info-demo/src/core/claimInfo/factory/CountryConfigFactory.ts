/**
 * Country Configuration Factory
 * Carga dinámicamente la configuración de un país usando lazy loading
 */

import { CountryConfig, SupportedCountry } from '../types';
import { dynamicFieldsRegistry } from '../registry/dynamicFieldsRegistry';
import { storeExtensionRegistry } from '../registry/storeExtensionRegistry';

/**
 * Cache de configuraciones cargadas
 */
const configCache = new Map<string, CountryConfig>();

/**
 * Factory para cargar configuraciones de países
 */
export class CountryConfigFactory {
  /**
   * Carga la configuración de un país de forma dinámica
   */
  static async loadCountryConfig(
    countryCode: SupportedCountry
  ): Promise<CountryConfig> {
    // Verificar cache
    if (configCache.has(countryCode)) {
      return configCache.get(countryCode)!;
    }

    try {
      // Lazy load del módulo del país
      const config = await this.importCountryModule(countryCode);

      // Registrar campos dinámicos si existen
      if (config.dynamicFields && config.dynamicFields.length > 0) {
        dynamicFieldsRegistry.registerMany(config.dynamicFields);
      }

      // Registrar extensión de store si existe
      if (config.storeExtension?.actions) {
        const slice = (set: any, get: any) => {
          const actions: Record<string, any> = {};
          
          Object.entries(config.storeExtension!.actions!).forEach(([key, fn]) => {
            actions[key] = (...args: any[]) => fn(set, get, ...args);
          });

          return {
            ...config.storeExtension!.initialState,
            ...actions,
          };
        };

        storeExtensionRegistry.register(countryCode, slice);
      }

      // Guardar en cache
      configCache.set(countryCode, config);

      // Retornar la configuración para que el contexto pueda inicializar los campos dinámicos

      return config;
    } catch (error) {
      console.error(`Failed to load country configuration for ${countryCode}:`, error);
      throw new Error(`Country configuration not found for: ${countryCode}`);
    }
  }

  /**
   * Importa dinámicamente el módulo de un país
   */
  private static async importCountryModule(
    countryCode: SupportedCountry
  ): Promise<CountryConfig> {
    switch (countryCode) {
      case SupportedCountry.COSTA_RICA:
        const crModule = await import('@/extensions/costaRica');
        return crModule.costaRicaConfig;

      case SupportedCountry.PANAMA:
        const paModule = await import('@/extensions/panama');
        return paModule.panamaConfig;

      default:
        throw new Error(`Unsupported country code: ${countryCode}`);
    }
  }

  /**
   * Limpia el cache de configuraciones
   */
  static clearCache(): void {
    configCache.clear();
    dynamicFieldsRegistry.clear();
    storeExtensionRegistry.clear();
  }

  /**
   * Verifica si un país está soportado
   */
  static isCountrySupported(countryCode: string): countryCode is SupportedCountry {
    return Object.values(SupportedCountry).includes(countryCode as SupportedCountry);
  }

  /**
   * Obtiene la lista de países soportados
   */
  static getSupportedCountries(): SupportedCountry[] {
    return Object.values(SupportedCountry);
  }
}

/**
 * Hook para cargar configuración de país en componentes React
 */
export const useCountryConfig = () => {
  const loadConfig = async (countryCode: SupportedCountry) => {
    return await CountryConfigFactory.loadCountryConfig(countryCode);
  };

  const clearCache = () => {
    CountryConfigFactory.clearCache();
  };

  return {
    loadConfig,
    clearCache,
    isSupported: CountryConfigFactory.isCountrySupported,
    supportedCountries: CountryConfigFactory.getSupportedCountries(),
  };
};
