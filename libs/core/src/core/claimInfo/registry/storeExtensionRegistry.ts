/**
 * Store Extension Registry
 * Permite que países extiendan el store Zustand sin modificar el core
 */

import { StoreApi } from 'zustand';
import { StoreSlice, StoreExtensionRegistry, CoreStoreState } from '../types';

/**
 * Implementación del registro de extensiones de store
 */
class StoreExtensionRegistryImpl implements StoreExtensionRegistry {
  slices: Map<string, StoreSlice> = new Map();

  /**
   * Registra un nuevo slice para un país
   */
  register(countryCode: string, slice: StoreSlice): void {
    if (this.slices.has(countryCode)) {
      console.warn(`Store extension for country "${countryCode}" is already registered. Overwriting.`);
    }
    this.slices.set(countryCode, slice);
  }

  /**
   * Obtiene todos los slices registrados
   */
  getAll(): StoreSlice[] {
    return Array.from(this.slices.values());
  }

  /**
   * Obtiene el slice de un país específico
   */
  get(countryCode: string): StoreSlice | undefined {
    return this.slices.get(countryCode);
  }

  /**
   * Verifica si un país tiene un slice registrado
   */
  has(countryCode: string): boolean {
    return this.slices.has(countryCode);
  }

  /**
   * Elimina el slice de un país
   */
  unregister(countryCode: string): boolean {
    return this.slices.delete(countryCode);
  }

  /**
   * Limpia todos los slices registrados
   */
  clear(): void {
    this.slices.clear();
  }

  /**
   * Combina todos los slices registrados en un objeto
   */
  combineSlices(
    set: StoreApi<CoreStoreState>['setState'],
    get: StoreApi<CoreStoreState>['getState']
  ): Record<string, any> {
    const combined: Record<string, any> = {};
    
    this.slices.forEach((slice, countryCode) => {
      try {
        const sliceState = slice(set, get);
        Object.assign(combined, sliceState);
      } catch (error) {
        console.error(`Error combining slice for country "${countryCode}":`, error);
      }
    });

    return combined;
  }
}

/**
 * Instancia singleton del registro
 */
export const storeExtensionRegistry = new StoreExtensionRegistryImpl();

/**
 * Helper para crear un store slice tipado
 */
export const createStoreSlice = <T extends Record<string, any>>(
  sliceCreator: (
    set: StoreApi<CoreStoreState>['setState'],
    get: StoreApi<CoreStoreState>['getState']
  ) => T
): StoreSlice<T> => {
  return sliceCreator;
};
