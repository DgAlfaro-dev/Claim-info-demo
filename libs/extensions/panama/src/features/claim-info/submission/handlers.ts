/**
 * Panama - Post-Submit Handlers
 * Funciones que se ejecutan después del submit exitoso
 */

import {
  PostSubmitHandler,
  PostSubmitResult,
  SubmitContext,
} from '@claim-info-demo/core';

/**
 * Registra el submit en un log específico de Panamá
 */
export const logPanamaSubmit: PostSubmitHandler = async (
  context: SubmitContext,
  submitResponse: any
): Promise<PostSubmitResult> => {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      country: 'PA',
      claimId: submitResponse?.claimId,
      ownerName: context.formData?.claimInfo?.policy?.Owner?.name,
      taxId: context.payload?.panamaSpecific?.taxId,
      insuranceZone: context.payload?.panamaSpecific?.insuranceZone,
      plate: context.formData?.claimInfo?.vehicleInformation?.plate,
    };

    console.log('[PA Post-Handler] Registro de submit:', logEntry);

    // Guardar en localStorage
    const existingLogs = localStorage.getItem('pa_submit_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(logEntry);
    localStorage.setItem('pa_submit_logs', JSON.stringify(logs));

    return {
      success: true,
      message: 'Submit registrado en log de Panamá',
      data: logEntry,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al registrar en log de Panamá',
    };
  }
};

/**
 * Notifica a la Superintendencia (simulado)
 */
export const notifySuperintendencia: PostSubmitHandler = async (
  context: SubmitContext,
  submitResponse: any
): Promise<PostSubmitResult> => {
  try {
    console.log('[PA Post-Handler] Notificando a la Superintendencia...');
    
    await new Promise((resolve) => setTimeout(resolve, 600));

    const notification = {
      entity: 'Superintendencia de Seguros y Reaseguros de Panamá',
      claimId: submitResponse?.claimId,
      insuranceZone: context.payload?.panamaSpecific?.insuranceZone,
      notifiedAt: new Date().toISOString(),
      status: 'notified',
    };

    console.log('[PA Post-Handler] Superintendencia notificada:', notification);

    return {
      success: true,
      message: 'Superintendencia notificada',
      data: notification,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al notificar a la Superintendencia',
    };
  }
};

/**
 * Genera certificado de reclamo para Panamá
 */
export const generatePanamaCertificate: PostSubmitHandler = async (
  context: SubmitContext,
  submitResponse: any
): Promise<PostSubmitResult> => {
  try {
    console.log('[PA Post-Handler] Generando certificado de reclamo...');
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const certificate = {
      claimId: submitResponse?.claimId,
      certificateNumber: `PA-CERT-${Date.now()}`,
      type: 'CERTIFICADO_RECLAMO',
      country: 'Panama',
      insuranceZone: context.payload?.panamaSpecific?.insuranceZone,
      taxId: context.payload?.panamaSpecific?.taxId,
      generatedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 días
      url: `https://storage.example.com/certificates/${submitResponse?.claimId}.pdf`,
    };

    console.log('[PA Post-Handler] Certificado generado:', certificate);

    return {
      success: true,
      message: 'Certificado de reclamo generado',
      data: certificate,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al generar certificado',
    };
  }
};

/**
 * Envía SMS de confirmación (simulado)
 */
export const sendSmsConfirmation: PostSubmitHandler = async (
  context: SubmitContext,
  submitResponse: any
): Promise<PostSubmitResult> => {
  try {
    console.log('[PA Post-Handler] Enviando SMS de confirmación...');
    
    await new Promise((resolve) => setTimeout(resolve, 400));

    const sms = {
      to: '+507-XXXX-XXXX', // Número simulado
      message: `Reclamo ${submitResponse?.claimId} recibido. Zona: ${context.payload?.panamaSpecific?.insuranceZone}`,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    console.log('[PA Post-Handler] SMS enviado:', sms);

    return {
      success: true,
      message: 'SMS de confirmación enviado',
      data: sms,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al enviar SMS',
    };
  }
};

/**
 * Actualiza estadísticas de zona de seguro
 */
export const updateZoneStatistics: PostSubmitHandler = async (
  context: SubmitContext,
  submitResponse: any
): Promise<PostSubmitResult> => {
  try {
    const zone = context.payload?.panamaSpecific?.insuranceZone;
    
    if (!zone) {
      return {
        success: false,
        message: 'No se pudo determinar la zona de seguro',
      };
    }

    console.log('[PA Post-Handler] Actualizando estadísticas de zona...');

    // Simular actualización de estadísticas
    const statsKey = `pa_zone_stats_${zone}`;
    const existingStats = localStorage.getItem(statsKey);
    const stats = existingStats ? JSON.parse(existingStats) : { count: 0, lastUpdate: null };
    
    stats.count += 1;
    stats.lastUpdate = new Date().toISOString();
    stats.lastClaimId = submitResponse?.claimId;

    localStorage.setItem(statsKey, JSON.stringify(stats));

    console.log('[PA Post-Handler] Estadísticas actualizadas:', stats);

    return {
      success: true,
      message: 'Estadísticas de zona actualizadas',
      data: { zone, stats },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al actualizar estadísticas',
    };
  }
};
