/**
 * Country Configuration Context
 * Provee la configuración del país activo a toda la aplicación
 */

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CountryConfig, SupportedCountry } from '../types';
import { CountryConfigFactory } from '../factory/CountryConfigFactory';
import { FieldConfigMap } from '../types';
import { mergeAllFieldConfigs } from '../utils/configUtils';

interface CountryConfigContextValue {
  /** Configuración del país actual */
  countryConfig: CountryConfig | null;
  /** País actualmente seleccionado */
  currentCountry: SupportedCountry | null;
  /** Configuraciones de campos resueltas (defaults + overrides) */
  resolvedFieldConfigs: FieldConfigMap | null;
  /** Indica si está cargando la configuración */
  isLoading: boolean;
  /** Error al cargar configuración */
  error: string | null;
  /** Carga la configuración de un país */
  loadCountry: (countryCode: SupportedCountry) => Promise<void>;
  /** Limpia la configuración actual */
  clearCountry: () => void;
}

const CountryConfigContext = createContext<CountryConfigContextValue | undefined>(undefined);

interface CountryConfigProviderProps {
  children: ReactNode;
  /** País por defecto al iniciar */
  defaultCountry?: SupportedCountry;
}

/**
 * Provider para la configuración de país
 */
export const CountryConfigProvider: React.FC<CountryConfigProviderProps> = ({
  children,
  defaultCountry,
}) => {
  const [countryConfig, setCountryConfig] = useState<CountryConfig | null>(null);
  const [currentCountry, setCurrentCountry] = useState<SupportedCountry | null>(
    defaultCountry || null
  );
  const [resolvedFieldConfigs, setResolvedFieldConfigs] = useState<FieldConfigMap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga la configuración de un país
   */
  const loadCountry = useCallback(async (countryCode: SupportedCountry) => {
    setIsLoading(true);
    setError(null);

    try {
      // Limpiar configuración anterior si es un país diferente
      if (currentCountry && currentCountry !== countryCode) {
        CountryConfigFactory.clearCache();
      }

      // Cargar nueva configuración
      const config = await CountryConfigFactory.loadCountryConfig(countryCode);
      setCountryConfig(config);
      setCurrentCountry(countryCode);

      // Resolver configuraciones de campos (merge defaults + overrides)
      const resolved = mergeAllFieldConfigs(config.fieldOverrides);
      setResolvedFieldConfigs(resolved);

      // Inicializar valores dinámicos en el store si existe initialState
      if (config.storeExtension?.initialState) {
        // Necesitamos importar el store dinámicamente para evitar ciclos
        const { useClaimInfoStore } = await import('../store/claimInfoStore');
        const store = useClaimInfoStore.getState();
        if (store.initializeDynamicFields) {
          store.initializeDynamicFields(config.storeExtension.initialState);
        }
      }

      console.log(`✓ Country configuration loaded: ${config.countryName}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Failed to load country configuration:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCountry]);

  /**
   * Limpia la configuración actual
   */
  const clearCountry = useCallback(() => {
    setCountryConfig(null);
    setCurrentCountry(null);
    setResolvedFieldConfigs(null);
    setError(null);
    CountryConfigFactory.clearCache();
  }, []);

  // Cargar país por defecto al montar
  React.useEffect(() => {
    if (defaultCountry && !currentCountry) {
      loadCountry(defaultCountry);
    }
  }, [defaultCountry, currentCountry, loadCountry]);

  const value: CountryConfigContextValue = {
    countryConfig,
    currentCountry,
    resolvedFieldConfigs,
    isLoading,
    error,
    loadCountry,
    clearCountry,
  };

  return (
    <CountryConfigContext.Provider value={value}>
      {children}
    </CountryConfigContext.Provider>
  );
};

/**
 * Hook para acceder a la configuración del país
 */
export const useCountryConfigContext = (): CountryConfigContextValue => {
  const context = useContext(CountryConfigContext);
  if (!context) {
    throw new Error(
      'useCountryConfigContext must be used within a CountryConfigProvider'
    );
  }
  return context;
};
