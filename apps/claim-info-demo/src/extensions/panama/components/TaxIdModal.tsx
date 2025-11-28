/**
 * Tax ID Modal Component
 * Modal para editar RUC del asegurado en Panamá
 */

'use client';

import { FC, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { BaseModal } from '@/features/shared/components/BaseModal';
import { PROJECT_NAME } from '@/features/shared/model/constants';

interface TaxIdModalProps {
  open: boolean;
  currentValue?: string;
  onClose: () => void;
  onConfirm: (taxId: string) => void;
}

/**
 * Modal para editar el RUC del asegurado
 * Formato esperado: 1234567-1-123456
 */
export const TaxIdModal: FC<TaxIdModalProps> = ({
  open,
  currentValue,
  onClose,
  onConfirm,
}) => {
  const [taxId, setTaxId] = useState(currentValue || '');
  const [error, setError] = useState('');

  const validateTaxId = (value: string): boolean => {
    // Formato: 1234567-1-123456 (número-dígito-número)
    const rucRegex = /^\d{7}-\d{1}-\d{6}$/;
    return rucRegex.test(value);
  };

  const handleConfirm = () => {
    if (!taxId.trim()) {
      setError('El RUC es requerido');
      return;
    }

    if (!validateTaxId(taxId)) {
      setError('Formato inválido. Use: 1234567-1-123456');
      return;
    }

    onConfirm(taxId);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setTaxId(currentValue || '');
    setError('');
    onClose();
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Editar RUC del Asegurado"
    >
      <Stack spacing={3}>
        <Typography
          id={`${PROJECT_NAME}-modal-panama-tax-id-description`}
          data-testid={`${PROJECT_NAME}-modal-panama-tax-id-description`}
          sx={{ color: '#7E8084', fontSize: '14px' }}
        >
          Ingrese el Registro Único de Contribuyente (RUC) del asegurado.
        </Typography>

        <Box>
          <TextField
            id={`${PROJECT_NAME}-input-panama-tax-id`}
            data-testid={`${PROJECT_NAME}-input-panama-tax-id`}
            fullWidth
            label="RUC"
            placeholder="1234567-1-123456"
            value={taxId}
            onChange={(e) => {
              setTaxId(e.target.value);
              setError('');
            }}
            error={!!error}
            helperText={error || 'Formato: 1234567-1-123456'}
            autoFocus
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '15px',
                fontWeight: 500,
              },
            }}
          />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            id={`${PROJECT_NAME}-button-cancel-panama-tax-id`}
            data-testid={`${PROJECT_NAME}-button-cancel-panama-tax-id`}
            variant="outlined"
            onClick={handleClose}
            sx={{
              textTransform: 'none',
              borderColor: '#0193E5',
              color: '#0193E5',
            }}
          >
            Cancelar
          </Button>
          <Button
            id={`${PROJECT_NAME}-button-confirm-panama-tax-id`}
            data-testid={`${PROJECT_NAME}-button-confirm-panama-tax-id`}
            variant="contained"
            onClick={handleConfirm}
            sx={{
              textTransform: 'none',
              backgroundColor: '#0193E5',
              '&:hover': {
                backgroundColor: '#017AC0',
              },
            }}
          >
            Confirmar
          </Button>
        </Stack>
      </Stack>
    </BaseModal>
  );
};
