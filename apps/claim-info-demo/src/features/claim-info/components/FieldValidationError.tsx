/**
 * FieldValidationError Component
 * Muestra errores de validación debajo de los campos
 */

'use client';

import React from 'react';
import { Alert, Box, Collapse } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useClaimInfoStore } from '../store/claimInfoStore';

export interface FieldValidationErrorProps {
  /** Key del campo en el objeto de errores (ej: 'ruc', 'ownerName', 'plate') */
  fieldKey: string;
  /** Mensaje de error personalizado (opcional, si no se usa el del store) */
  errorMessage?: string;
}

/**
 * Componente que muestra un error de validación para un campo específico
 * Se conecta automáticamente al store para obtener el error
 */
export const FieldValidationError: React.FC<FieldValidationErrorProps> = ({
  fieldKey,
  errorMessage,
}) => {
  const { validationErrors } = useClaimInfoStore();
  
  // Usar el error del store o el mensaje personalizado
  const error = errorMessage || validationErrors[fieldKey];

  if (!error) {
    return null;
  }

  return (
    <Collapse in={!!error}>
      <Box sx={{ mt: 1, mb: 1 }}>
        <Alert 
          severity="error" 
          icon={<ErrorOutlineIcon fontSize="small" />}
          sx={{
            py: 0.5,
            px: 1.5,
            fontSize: '0.875rem',
            '& .MuiAlert-message': {
              padding: '4px 0',
            },
          }}
        >
          {error}
        </Alert>
      </Box>
    </Collapse>
  );
};
