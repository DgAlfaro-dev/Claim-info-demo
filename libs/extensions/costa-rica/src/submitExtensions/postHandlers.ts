/**
 * Costa Rica - Post-Submit Handlers
 * Funciones que se ejecutan después del submit exitoso
 */

import {
  PostSubmitHandler,
  PostSubmitResult,
  SubmitContext,
} from '@claim-info-demo/core';

/**
 * Registra el submit en un log local (simulado)
 */
export const logSubmitToLocalStorage: PostSubmitHandler = async (
  context: SubmitContext,
  submitResponse: any
): Promise<PostSubmitResult> => {
  try {
    // En un caso real, esto podría enviar a un servicio de logging
    const logEntry = {
      timestamp: new Date().toISOString(),
      country: 'CR',
      claimId: submitResponse?.claimId,
      ownerName: context.formData?.claimInfo?.policy?.Owner?.name,
      plate: context.formData?.claimInfo?.vehicleInformation?.plate,
    };

    console.log('[CR Post-Handler] Registro de submit:', logEntry);

    // Guardar en localStorage como ejemplo
    const existingLogs = localStorage.getItem('cr_submit_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(logEntry);
    localStorage.setItem('cr_submit_logs', JSON.stringify(logs));

    return {
      success: true,
      message: 'Submit registrado en log local',
      data: logEntry,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al registrar en log local',
    };
  }
};

/**
 * Envía notificación de confirmación (simulado)
 */
export const sendConfirmationNotification: PostSubmitHandler = async (
  context: SubmitContext,
  submitResponse: any
): Promise<PostSubmitResult> => {
  try {
    // Simular envío de notificación
    console.log('[CR Post-Handler] Enviando notificación de confirmación...');
    
    await new Promise((resolve) => setTimeout(resolve, 500));

    const notification = {
      to: context.formData?.claimInfo?.policy?.Owner?.name,
      message: `Su reclamo ${submitResponse?.claimId} ha sido enviado exitosamente`,
      country: 'Costa Rica',
      timestamp: new Date().toISOString(),
    };

    console.log('[CR Post-Handler] Notificación enviada:', notification);

    return {
      success: true,
      message: 'Notificación enviada',
      data: notification,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al enviar notificación',
    };
  }
};

/**
 * Genera un documento PDF del reclamo (simulado)
 */
export const generateClaimDocument: PostSubmitHandler = async (
  context: SubmitContext,
  submitResponse: any
): Promise<PostSubmitResult> => {
  try {
    console.log('[CR Post-Handler] Generando documento del reclamo...');
    
    // Simular generación de documento
    await new Promise((resolve) => setTimeout(resolve, 800));

    const document = {
      claimId: submitResponse?.claimId,
      documentType: 'PDF',
      generatedAt: new Date().toISOString(),
      country: 'Costa Rica',
      url: `https://storage.example.com/claims/${submitResponse?.claimId}.pdf`,
    };

    console.log('[CR Post-Handler] Documento generado:', document);

    return {
      success: true,
      message: 'Documento generado',
      data: document,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al generar documento',
    };
  }
};
