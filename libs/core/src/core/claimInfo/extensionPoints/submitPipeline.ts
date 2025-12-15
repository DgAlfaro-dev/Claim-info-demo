/**
 * Submit Pipeline
 * Orquesta la ejecución de todas las extensiones de submit
 */

import { submitExtensionsRegistry } from './submitExtensionsRegistry';
import {
  SubmitContext,
  SubmitPipelineResult,
  PreValidationResult,
  PostSubmitResult,
} from './types';

/**
 * Pipeline de submit que ejecuta todas las extensiones registradas
 */
export class SubmitPipeline {
  /**
   * Ejecuta el pipeline completo de submit
   * 
   * @param countryCode - Código del país
   * @param formData - Datos del formulario
   * @param submitFn - Función que realiza el submit real (ej: llamada al backend)
   * @returns Resultado del pipeline
   */
  static async execute(
    countryCode: string,
    formData: any,
    submitFn: (payload: any) => Promise<any>
  ): Promise<SubmitPipelineResult> {
    // Inicializar el contexto
    const context: SubmitContext = {
      formData,
      countryCode,
      payload: { ...formData }, // Copia inicial del payload
      errors: {},
      warnings: {},
      metadata: {},
    };

    try {
      // FASE 1: Ejecutar validadores pre-submit
      console.log('[SubmitPipeline] Ejecutando pre-validadores...');
      const preValidationResult = await this.runPreValidators(context);

      if (!preValidationResult.isValid) {
        console.warn('[SubmitPipeline] Pre-validación falló:', preValidationResult.errors);
        return {
          success: false,
          errors: preValidationResult.errors || {},
          warnings: preValidationResult.warnings || {},
          message: 'Errores de validación antes del submit',
        };
      }

      // Acumular warnings de pre-validación
      if (preValidationResult.warnings) {
        context.warnings = { ...context.warnings, ...preValidationResult.warnings };
      }

      // FASE 2: Ejecutar mutadores de payload
      console.log('[SubmitPipeline] Ejecutando mutadores de payload...');
      await this.runPayloadMutators(context);

      // FASE 3: Ejecutar el submit real
      console.log('\n' + '='.repeat(80));
      console.log('PAYLOAD FINAL QUE SE ENVIARÁ AL BACKEND');
      console.log('='.repeat(80));
      console.log(JSON.stringify(context.payload, null, 2));
      console.log('='.repeat(80) + '\n');
      
      const submitResponse = await submitFn(context.payload);

      // FASE 4: Ejecutar handlers post-submit
      console.log('[SubmitPipeline] Ejecutando post-handlers...');
      const postResults = await this.runPostHandlers(context, submitResponse);

      // Verificar si algún post-handler falló
      const hasPostFailures = postResults.some((result) => !result.success);

      return {
        success: !hasPostFailures,
        errors: context.errors,
        warnings: context.warnings,
        response: submitResponse,
        postResults,
        message: hasPostFailures 
          ? 'Submit completado pero algunos post-procesos fallaron' 
          : 'Submit completado exitosamente',
      };
    } catch (error) {
      console.warn('[SubmitPipeline] Error en el pipeline:', error);
      return {
        success: false,
        errors: {
          pipeline: error instanceof Error ? error.message : 'Error desconocido en el pipeline',
        },
        warnings: context.warnings,
        message: 'Error durante el proceso de submit',
      };
    }
  }

  /**
   * Ejecuta todos los validadores pre-submit registrados
   */
  private static async runPreValidators(
    context: SubmitContext
  ): Promise<PreValidationResult> {
    const validators = submitExtensionsRegistry.getPreValidators(context.countryCode);

    if (validators.length === 0) {
      return { isValid: true };
    }

    const allErrors: Record<string, string> = {};
    const allWarnings: Record<string, string> = {};
    let isValid = true;

    for (const validator of validators) {
      try {
        const result = await validator(context);

        if (!result.isValid) {
          isValid = false;
        }

        if (result.errors) {
          Object.assign(allErrors, result.errors);
        }

        if (result.warnings) {
          Object.assign(allWarnings, result.warnings);
        }
      } catch (error) {
        console.warn('[SubmitPipeline] Error en pre-validador:', error);
        isValid = false;
        allErrors['validator_error'] = 
          error instanceof Error ? error.message : 'Error en validador';
      }
    }

    return {
      isValid,
      errors: Object.keys(allErrors).length > 0 ? allErrors : undefined,
      warnings: Object.keys(allWarnings).length > 0 ? allWarnings : undefined,
    };
  }

  /**
   * Ejecuta todos los mutadores de payload registrados
   */
  private static async runPayloadMutators(context: SubmitContext): Promise<void> {
    const mutators = submitExtensionsRegistry.getPayloadMutators(context.countryCode);

    for (const mutator of mutators) {
      try {
        await mutator(context);
      } catch (error) {
        console.warn('[SubmitPipeline] Error en mutador de payload:', error);
        // Los errores en mutadores no bloquean el submit, solo se loguean
        // Si necesitas que bloqueen, agrégalos a context.errors
      }
    }
  }

  /**
   * Ejecuta todos los handlers post-submit registrados
   */
  private static async runPostHandlers(
    context: SubmitContext,
    submitResponse: any
  ): Promise<PostSubmitResult[]> {
    const handlers = submitExtensionsRegistry.getPostHandlers(context.countryCode);

    const results: PostSubmitResult[] = [];

    for (const handler of handlers) {
      try {
        const result = await handler(context, submitResponse);
        results.push(result);

        if (!result.success && result.message) {
          // Acumular errores de post-handlers
          context.errors[`post_handler_${results.length}`] = result.message;
        }
      } catch (error) {
        console.warn('[SubmitPipeline] Error en post-handler:', error);
        results.push({
          success: false,
          message: error instanceof Error ? error.message : 'Error en post-handler',
        });
      }
    }

    return results;
  }
}
