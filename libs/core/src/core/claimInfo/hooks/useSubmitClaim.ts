/**
 * useSubmitClaim Hook
 * Hook para manejar el submit del formulario usando el pipeline de extensiones
 */

'use client';

import { useState, useCallback } from 'react';
import { useCountryConfigContext } from '../context/CountryConfigContext';
import { useClaimInfoStore } from '../store/claimInfoStore';
import { SubmitPipeline } from '../extensionPoints/submitPipeline';
import { SubmitPipelineResult } from '../extensionPoints/types';

export interface UseSubmitClaimOptions {
  /** Callback que se ejecuta cuando el submit es exitoso */
  onSuccess?: (result: SubmitPipelineResult) => void;
  /** Callback que se ejecuta cuando el submit falla */
  onError?: (result: SubmitPipelineResult) => void;
}

export const useSubmitClaim = (options?: UseSubmitClaimOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitPipelineResult | null>(null);
  const { currentCountry } = useCountryConfigContext();
  const { claimInfo, dynamicFieldsData, setValidationErrors, clearValidationErrors } = useClaimInfoStore();

  /**
   * Función que simula el submit real al backend
   * En una implementación real, aquí iría la llamada HTTP
   */
  const mockBackendSubmit = async (payload: any): Promise<any> => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simular respuesta exitosa del backend
    return {
      success: true,
      claimId: `CLM-${Date.now()}`,
      message: 'Claim submitted successfully',
      timestamp: new Date().toISOString(),
      data: payload,
    };
  };

  /**
   * Ejecuta el submit del formulario
   */
  const submitClaim = useCallback(async () => {
    if (!currentCountry) {
      console.warn('[useSubmitClaim] No hay país seleccionado');
      return;
    }

    if (isSubmitting) {
      console.warn('[useSubmitClaim] Ya hay un submit en proceso');
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);
    clearValidationErrors(); // Limpiar errores previos antes de nuevo submit

    try {
      // Preparar datos del formulario
      const formData = {
        claimInfo: claimInfo?.data,
        dynamicFields: dynamicFieldsData,
        country: currentCountry,
        timestamp: new Date().toISOString(),
      };

      console.log('[useSubmitClaim] Iniciando submit con datos:', formData);
      console.log('[useSubmitClaim] Campos dinámicos disponibles:', dynamicFieldsData);

      // Ejecutar el pipeline completo
      const result = await SubmitPipeline.execute(
        currentCountry,
        formData,
        mockBackendSubmit
      );

      console.log('[useSubmitClaim] Resultado del pipeline:', result);

      setSubmitResult(result);

      // Guardar errores de validación en el store para mostrarlos en los campos
      if (!result.success && result.errors) {
        setValidationErrors(result.errors);
      } else {
        clearValidationErrors();
      }

      // Ejecutar callbacks
      if (result.success) {
        options?.onSuccess?.(result);
      } else {
        options?.onError?.(result);
      }

      return result;
    } catch (error) {
      console.warn('[useSubmitClaim] Error inesperado:', error);
      
      const errorResult: SubmitPipelineResult = {
        success: false,
        errors: {
          unexpected: error instanceof Error ? error.message : 'Error desconocido',
        },
        warnings: {},
        message: 'Error inesperado durante el submit',
      };

      setSubmitResult(errorResult);
      options?.onError?.(errorResult);

      return errorResult;
    } finally {
      setIsSubmitting(false);
    }
  }, [currentCountry, claimInfo, dynamicFieldsData, isSubmitting, options]);

  /**
   * Limpia el resultado del submit anterior
   */
  const clearSubmitResult = useCallback(() => {
    setSubmitResult(null);
  }, []);

  return {
    submitClaim,
    isSubmitting,
    submitResult,
    clearSubmitResult,
  };
};
