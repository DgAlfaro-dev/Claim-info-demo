/**
 * Dynamic Fields Registry
 * Permite registrar y obtener campos dinámicos inyectados por países
 */

import { DynamicFieldDefinition } from '../../../infrastructure/country-config/types/fieldConfig';

/**
 * Registro global de campos dinámicos
 */
class DynamicFieldsRegistry {
  private fields: Map<string, DynamicFieldDefinition> = new Map();

  /**
   * Registra un nuevo campo dinámico
   */
  register(field: DynamicFieldDefinition): void {
    if (this.fields.has(field.id)) {
      console.warn(`Dynamic field with id "${field.id}" is already registered. Overwriting.`);
    }
    this.fields.set(field.id, field);
  }

  /**
   * Registra múltiples campos dinámicos
   */
  registerMany(fields: DynamicFieldDefinition[]): void {
    fields.forEach(field => this.register(field));
  }

  /**
   * Obtiene un campo dinámico por ID
   */
  get(fieldId: string): DynamicFieldDefinition | undefined {
    return this.fields.get(fieldId);
  }

  /**
   * Obtiene todos los campos dinámicos
   */
  getAll(): DynamicFieldDefinition[] {
    return Array.from(this.fields.values());
  }

  /**
   * Obtiene campos dinámicos por sección
   */
  getBySection(section: 'policy' | 'claim'): DynamicFieldDefinition[] {
    return this.getAll().filter(field => field.section === section);
  }

  /**
   * Verifica si un campo está registrado
   */
  has(fieldId: string): boolean {
    return this.fields.has(fieldId);
  }

  /**
   * Elimina un campo dinámico
   */
  unregister(fieldId: string): boolean {
    return this.fields.delete(fieldId);
  }

  /**
   * Limpia todos los campos registrados
   */
  clear(): void {
    this.fields.clear();
  }

  /**
   * Obtiene el número de campos registrados
   */
  get size(): number {
    return this.fields.size;
  }
}

/**
 * Instancia singleton del registro
 */
export const dynamicFieldsRegistry = new DynamicFieldsRegistry();

/**
 * Hook para obtener campos dinámicos en componentes React
 */
export const useDynamicFields = () => {
  return {
    getAllFields: () => dynamicFieldsRegistry.getAll(),
    getFieldsBySection: (section: 'policy' | 'claim') => 
      dynamicFieldsRegistry.getBySection(section),
    getField: (fieldId: string) => dynamicFieldsRegistry.get(fieldId),
  };
};
