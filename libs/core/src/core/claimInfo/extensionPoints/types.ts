/**
 * Extension Points Types
 * Define los tipos para el sistema de extensibilidad del submit
 */

/**
 * Contexto que se pasa a través del pipeline de submit
 */
export interface SubmitContext {
  /** Datos del formulario */
  formData: any;
  /** Código del país actual */
  countryCode: string;
  /** Payload que se enviará al backend (puede ser mutado) */
  payload: any;
  /** Errores de validación acumulados */
  errors: Record<string, string>;
  /** Warnings acumulados */
  warnings: Record<string, string>;
  /** Metadata adicional */
  metadata: Record<string, any>;
}

/**
 * Resultado de una validación pre-submit
 */
export interface PreValidationResult {
  /** Indica si la validación fue exitosa */
  isValid: boolean;
  /** Errores encontrados */
  errors?: Record<string, string>;
  /** Warnings (no bloquean el submit) */
  warnings?: Record<string, string>;
  /** Mensaje general */
  message?: string;
}

/**
 * Función de validación pre-submit
 * Se ejecuta antes de construir el payload
 */
export type PreSubmitValidator = (
  context: SubmitContext
) => PreValidationResult | Promise<PreValidationResult>;

/**
 * Función que muta el payload
 * Puede modificar el payload según las reglas del país
 */
export type PayloadMutator = (
  context: SubmitContext
) => void | Promise<void>;

/**
 * Resultado de un handler post-submit
 */
export interface PostSubmitResult {
  /** Indica si el post-procesamiento fue exitoso */
  success: boolean;
  /** Mensaje de resultado */
  message?: string;
  /** Datos adicionales */
  data?: any;
}

/**
 * Función de post-procesamiento
 * Se ejecuta después del submit exitoso
 */
export type PostSubmitHandler = (
  context: SubmitContext,
  submitResponse: any
) => PostSubmitResult | Promise<PostSubmitResult>;

/**
 * Configuración de extensiones de submit para un país
 */
export interface SubmitExtensions {
  /** Validadores que se ejecutan antes del submit */
  preValidators?: PreSubmitValidator[];
  /** Mutadores del payload */
  payloadMutators?: PayloadMutator[];
  /** Handlers post-submit */
  postHandlers?: PostSubmitHandler[];
}

/**
 * Resultado final del pipeline de submit
 */
export interface SubmitPipelineResult {
  /** Indica si el submit fue exitoso */
  success: boolean;
  /** Errores acumulados */
  errors: Record<string, string>;
  /** Warnings acumulados */
  warnings: Record<string, string>;
  /** Respuesta del backend */
  response?: any;
  /** Resultados de post-procesamiento */
  postResults?: PostSubmitResult[];
  /** Mensaje general */
  message?: string;
}
