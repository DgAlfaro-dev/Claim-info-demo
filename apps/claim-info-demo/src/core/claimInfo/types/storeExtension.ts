/**
 * Store Extension Types
 * Define cómo extender el store Zustand sin modificar el core
 */

import { StoreApi, UseBoundStore } from 'zustand';

/**
 * Tipo base del store del core
 */
export interface CoreStoreState {
  [key: string]: any;
}

/**
 * Store slice que puede ser agregado por un país
 */
export type StoreSlice<T = any> = (
  set: StoreApi<CoreStoreState>['setState'],
  get: StoreApi<CoreStoreState>['getState']
) => T;

/**
 * Registro de extensiones de store
 */
export interface StoreExtensionRegistry {
  /** Slices registrados por países */
  slices: Map<string, StoreSlice>;
  /** Registra un nuevo slice */
  register: (countryCode: string, slice: StoreSlice) => void;
  /** Obtiene todos los slices registrados */
  getAll: () => StoreSlice[];
  /** Limpia el registro */
  clear: () => void;
}

/**
 * Estado dinámico que contiene extensiones de países
 */
export interface DynamicStoreState {
  /** Datos de campos dinámicos por país */
  dynamicFieldsData: Record<string, any>;
  /** Actualiza valor de campo dinámico */
  setDynamicFieldValue: (fieldId: string, value: any) => void;
  /** Obtiene valor de campo dinámico */
  getDynamicFieldValue: (fieldId: string) => any;
}
