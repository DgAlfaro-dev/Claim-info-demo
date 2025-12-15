/**
 * Submit Extensions Registry
 * Registro central de todas las extensiones de submit por país
 */

import {
  PreSubmitValidator,
  PayloadMutator,
  PostSubmitHandler,
  SubmitExtensions,
} from './types';

/**
 * Registro global de extensiones de submit
 */
class SubmitExtensionsRegistry {
  private preValidators: Map<string, PreSubmitValidator[]> = new Map();
  private payloadMutators: Map<string, PayloadMutator[]> = new Map();
  private postHandlers: Map<string, PostSubmitHandler[]> = new Map();

  /**
   * Registra todas las extensiones de submit para un país
   */
  registerCountryExtensions(
    countryCode: string,
    extensions: SubmitExtensions
  ): void {
    if (extensions.preValidators) {
      this.preValidators.set(countryCode, extensions.preValidators);
    }

    if (extensions.payloadMutators) {
      this.payloadMutators.set(countryCode, extensions.payloadMutators);
    }

    if (extensions.postHandlers) {
      this.postHandlers.set(countryCode, extensions.postHandlers);
    }
  }

  /**
   * Registra un validador pre-submit para un país
   */
  registerPreValidator(
    countryCode: string,
    validator: PreSubmitValidator
  ): void {
    const existing = this.preValidators.get(countryCode) || [];
    this.preValidators.set(countryCode, [...existing, validator]);
  }

  /**
   * Registra un mutador de payload para un país
   */
  registerPayloadMutator(
    countryCode: string,
    mutator: PayloadMutator
  ): void {
    const existing = this.payloadMutators.get(countryCode) || [];
    this.payloadMutators.set(countryCode, [...existing, mutator]);
  }

  /**
   * Registra un handler post-submit para un país
   */
  registerPostHandler(
    countryCode: string,
    handler: PostSubmitHandler
  ): void {
    const existing = this.postHandlers.get(countryCode) || [];
    this.postHandlers.set(countryCode, [...existing, handler]);
  }

  /**
   * Obtiene todos los validadores pre-submit de un país
   */
  getPreValidators(countryCode: string): PreSubmitValidator[] {
    return this.preValidators.get(countryCode) || [];
  }

  /**
   * Obtiene todos los mutadores de payload de un país
   */
  getPayloadMutators(countryCode: string): PayloadMutator[] {
    return this.payloadMutators.get(countryCode) || [];
  }

  /**
   * Obtiene todos los handlers post-submit de un país
   */
  getPostHandlers(countryCode: string): PostSubmitHandler[] {
    return this.postHandlers.get(countryCode) || [];
  }

  /**
   * Obtiene todas las extensiones de un país
   */
  getCountryExtensions(countryCode: string): SubmitExtensions {
    return {
      preValidators: this.getPreValidators(countryCode),
      payloadMutators: this.getPayloadMutators(countryCode),
      postHandlers: this.getPostHandlers(countryCode),
    };
  }

  /**
   * Limpia todas las extensiones
   */
  clear(): void {
    this.preValidators.clear();
    this.payloadMutators.clear();
    this.postHandlers.clear();
  }

  /**
   * Limpia las extensiones de un país específico
   */
  clearCountry(countryCode: string): void {
    this.preValidators.delete(countryCode);
    this.payloadMutators.delete(countryCode);
    this.postHandlers.delete(countryCode);
  }

  /**
   * Verifica si un país tiene extensiones registradas
   */
  hasExtensions(countryCode: string): boolean {
    return (
      this.preValidators.has(countryCode) ||
      this.payloadMutators.has(countryCode) ||
      this.postHandlers.has(countryCode)
    );
  }
}

/**
 * Instancia única del registro
 */
export const submitExtensionsRegistry = new SubmitExtensionsRegistry();
