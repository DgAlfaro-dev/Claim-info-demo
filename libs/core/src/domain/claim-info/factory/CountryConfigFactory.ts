/**
 * Country Configuration Factory
 * Carga dinámicamente la configuración de un país usando lazy loading
 */

import { CountryConfig, SupportedCountry } from '../../../infrastructure/country-config/types/countryConfig';
import { dynamicFieldsRegistry } from '../registry/dynamicFieldsRegistry';
import { storeExtensionRegistry } from '../registry/storeExtensionRegistry';
import { submitExtensionsRegistry } from '../extensionPoints/submitExtensionsRegistry';

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

      // Registrar extensiones de submit si existen
      if (config.submitExtensions) {
        submitExtensionsRegistry.registerCountryExtensions(
          countryCode,
          config.submitExtensions
        );
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
   * Las extensiones deben ser registradas externamente usando registerCountryExtension
   */
  private static async importCountryModule(
    countryCode: SupportedCountry
  ): Promise<CountryConfig> {
    // Verificar si hay un loader registrado para este país
    const loader = this.countryLoaders.get(countryCode);
    if (loader) {
      return await loader();
    }

    throw new Error(
      `No extension registered for country: ${countryCode}. ` +
      `Please register the extension using CountryConfigFactory.registerCountryExtension()`
    );
  }

  /**
   * Map de loaders de países registrados
   */
  private static countryLoaders = new Map<SupportedCountry, () => Promise<CountryConfig>>();

  /**
   * Registra una extensión de país
   * Esto permite que las extensiones se carguen dinámicamente sin crear dependencias circulares
   */
  static registerCountryExtension(
    countryCode: SupportedCountry,
    loader: () => Promise<CountryConfig>
  ): void {
    this.countryLoaders.set(countryCode, loader);
  }

  /**
   * Limpia el cache de configuraciones
   */
  static clearCache(): void {
    configCache.clear();
    dynamicFieldsRegistry.clear();
    storeExtensionRegistry.clear();
    submitExtensionsRegistry.clear();
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
