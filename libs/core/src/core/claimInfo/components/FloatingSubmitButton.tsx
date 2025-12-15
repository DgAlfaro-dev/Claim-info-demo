/**
 * FloatingSubmitButton Component
 * Botón flotante de submit que funciona para todos los países
 */

'use client';

import React from 'react';
import { Fab, CircularProgress, Tooltip, Zoom } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useSubmitClaim } from '../hooks/useSubmitClaim';

export interface FloatingSubmitButtonProps {
  /** Posición vertical del botón */
  bottom?: number;
  /** Posición horizontal del botón */
  right?: number;
  /** Callback cuando el submit es exitoso */
  onSuccess?: () => void;
  /** Callback cuando el submit falla */
  onError?: () => void;
}

export const FloatingSubmitButton: React.FC<FloatingSubmitButtonProps> = ({
  bottom = 24,
  right = 24,
  onSuccess,
  onError,
}) => {
  const { submitClaim, isSubmitting, submitResult } = useSubmitClaim({
    onSuccess: () => {
      onSuccess?.();
      // Auto-limpiar el resultado después de mostrar el success
      setTimeout(() => {
        // El resultado se limpiará automáticamente con el próximo submit
      }, 2000);
    },
    onError: () => {
      onError?.();
    },
  });

  const handleSubmit = () => {
    submitClaim();
  };

  // Determinar el estado del botón
  const getButtonState = () => {
    if (isSubmitting) return 'submitting';
    if (submitResult?.success) return 'success';
    if (submitResult && !submitResult.success) return 'error';
    return 'idle';
  };

  const buttonState = getButtonState();

  // Colores según el estado
  const getColor = () => {
    switch (buttonState) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'primary';
    }
  };

  // Icono según el estado
  const getIcon = () => {
    switch (buttonState) {
      case 'submitting':
        return <CircularProgress size={24} color="inherit" />;
      case 'success':
        return <CheckCircleIcon />;
      case 'error':
        return <ErrorIcon />;
      default:
        return <SendIcon />;
    }
  };

  // Tooltip según el estado
  const getTooltip = () => {
    switch (buttonState) {
      case 'submitting':
        return 'Enviando...';
      case 'success':
        return '¡Enviado exitosamente!';
      case 'error':
        return 'Error al enviar. Click para reintentar';
      default:
        return 'Enviar formulario';
    }
  };

  return (
    <Zoom in={true} timeout={300}>
      <Tooltip title={getTooltip()} placement="left">
        <Fab
          color={getColor()}
          aria-label="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            position: 'fixed',
            bottom: `${bottom}px`,
            right: `${right}px`,
            zIndex: 1000,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
          }}
          data-testid="floating-submit-button"
        >
          {getIcon()}
        </Fab>
      </Tooltip>
    </Zoom>
  );
};
