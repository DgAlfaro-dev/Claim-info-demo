/**
 * Panama Tax ID Field Component
 * Campo dinámico para RUC de Panamá con edición inline
 */

'use client';

import { FC, useState } from 'react';
import { Grid, IconButton, Skeleton, Stack, styled, TextField, Typography } from '@mui/material';
import { DynamicFieldComponentProps, PROJECT_NAME, useClaimInfoStore } from '@claim-info-demo/core';
import { faPen, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LabelText = styled(Typography)(() => ({
  color: '#7E8084',
  fontWeight: 500,
  fontSize: '11px',
}));

const ValueTypography = styled(Typography)(() => ({
  color: '#0D2E68',
  fontWeight: 700,
  fontSize: '15px',
}));

const EditIconButton = styled(IconButton)(() => ({
  borderRadius: '70px',
  width: '34px',
  height: '27px',
  padding: '8px 8px 8px 3px',
}));

const CardItem = styled(Grid)(() => ({}));

/**
 * Valida formato de Tax ID panameño
 * Acepta: cédula (8-123-456), jurídica (PE-12-3456) o RUC (1234567-1-123456)
 */
const validateTaxId = (value: string): boolean => {
  // Natural: 8-123-456
  const naturalRegex = /^[1-9N]-\d{1,3}-\d{1,6}$/;
  // Jurídica: PE-12-3456
  const juridicaRegex = /^(PE|E|N|PI|NT|AV)-\d{1,4}-\d{1,6}$/;
  // RUC completo: 1234567-1-123456
  const rucRegex = /^\d{7}-\d{1}-\d{6}$/;
  
  return naturalRegex.test(value) || juridicaRegex.test(value) || rucRegex.test(value);
};

/**
 * Campo para RUC de Panamá (Registro Único de Contribuyente)
 * Permite edición inline con validación
 */
export const PanamaTaxIdField: FC<DynamicFieldComponentProps> = ({
  fieldId,
  config,
  value,
  onChange,
  isLoading,
  disabled,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const [error, setError] = useState('');

  const handleStartEdit = () => {
    setTempValue((value as string) || '');
    setError('');
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (!tempValue.trim()) {
      setError('El Tax ID es requerido');
      return;
    }

    if (!validateTaxId(tempValue)) {
      setError('Formato inválido. Ej: 8-123-456, PE-12-3456');
      return;
    }

    onChange(tempValue);
    setIsEditing(false);
    setError('');
  };

  const handleCancel = () => {
    setTempValue('');
    setError('');
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <CardItem size={6}>
        <LabelText
          id={`${PROJECT_NAME}-label-${fieldId}`}
          data-testid={`${PROJECT_NAME}-label-${fieldId}`}
        >
          {config.label} {config.required && '*'}
        </LabelText>
        <Stack direction="row" gap={1} alignItems="start">
          <TextField
            id={`${PROJECT_NAME}-input-${fieldId}`}
            data-testid={`${PROJECT_NAME}-input-${fieldId}`}
            fullWidth
            size="small"
            value={tempValue}
            onChange={(e) => {
              setTempValue(e.target.value);
              setError('');
            }}
            onKeyDown={handleKeyPress}
            placeholder="8-123-456"
            error={!!error}
            helperText={error || 'Ej: 8-123-456, PE-12-3456 o 1234567-1-123456'}
            autoFocus
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '15px',
                fontWeight: 700,
                color: '#0D2E68',
              },
            }}
          />
          <Stack direction="row" gap={0.5}>
            <EditIconButton
              id={`${PROJECT_NAME}-button-confirm-${fieldId}`}
              data-testid={`${PROJECT_NAME}-button-confirm-${fieldId}`}
              size="small"
              onClick={handleConfirm}
            >
              <FontAwesomeIcon
                icon={faCheck}
                style={{ fontSize: '16px', color: '#28a745' }}
              />
            </EditIconButton>
            <EditIconButton
              id={`${PROJECT_NAME}-button-cancel-${fieldId}`}
              data-testid={`${PROJECT_NAME}-button-cancel-${fieldId}`}
              size="small"
              onClick={handleCancel}
            >
              <FontAwesomeIcon
                icon={faTimes}
                style={{ fontSize: '16px', color: '#dc3545' }}
              />
            </EditIconButton>
          </Stack>
        </Stack>
      </CardItem>
    );
  }

  return (
    <CardItem size={6}>
      <LabelText
        id={`${PROJECT_NAME}-label-${fieldId}`}
        data-testid={`${PROJECT_NAME}-label-${fieldId}`}
      >
        {config.label} {config.required && '*'}
      </LabelText>
      <Stack
        direction="row"
        gap={1}
        alignItems="end"
        justifyContent="space-between"
      >
        {isLoading ? (
          <Skeleton variant="text" width={110} height={16} />
        ) : (
          <ValueTypography
            id={`${PROJECT_NAME}-value-${fieldId}`}
            data-testid={`${PROJECT_NAME}-value-${fieldId}`}
          >
            {value || 'N/A'}
          </ValueTypography>
        )}
        <EditIconButton
          id={`${PROJECT_NAME}-button-edit-${fieldId}`}
          data-testid={`${PROJECT_NAME}-button-edit-${fieldId}`}
          size="small"
          disabled={disabled || isLoading}
          onClick={handleStartEdit}
        >
          <FontAwesomeIcon
            icon={faPen}
            id={`${PROJECT_NAME}-icon-edit-${fieldId}`}
            data-testid={`${PROJECT_NAME}-icon-edit-${fieldId}`}
            style={{
              fontSize: '16px',
              color: disabled ? '#A3A2A2' : '#0193E5',
            }}
          />
        </EditIconButton>
      </Stack>
    </CardItem>
  );
};
