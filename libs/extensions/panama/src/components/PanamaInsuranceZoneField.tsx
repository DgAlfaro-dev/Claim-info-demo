/**
 * Panama Insurance Zone Field Component
 * Campo dinámico para zona de seguro en Panamá con modal de edición
 */

'use client';

import { FC, useState } from 'react';
import {
  Grid,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { DynamicFieldComponentProps, PROJECT_NAME, useClaimInfoStore } from '@claim-info-demo/core';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InsuranceZoneModal } from './InsuranceZoneModal';

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
 * Zonas de seguro en Panamá
 */
const INSURANCE_ZONES = [
  { value: 'URBAN', label: 'Urbana' },
  { value: 'RURAL', label: 'Rural' },
  { value: 'INTERIOR', label: 'Interior' },
];

/**
 * Campo para zona de seguro en Panamá
 * Muestra el valor con icono de edición que abre modal
 */
export const PanamaInsuranceZoneField: FC<DynamicFieldComponentProps> = ({
  fieldId,
  config,
  value,
  onChange,
  isLoading,
  disabled,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleConfirm = (newZone: string) => {
    onChange(newZone);
  };

  const getZoneLabel = (zoneValue: string) => {
    return INSURANCE_ZONES.find((zone) => zone.value === zoneValue)?.label || zoneValue;
  };

  return (
    <>
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
              {value ? getZoneLabel(value as string) : 'N/A'}
            </ValueTypography>
          )}
          <EditIconButton
            id={`${PROJECT_NAME}-button-edit-${fieldId}`}
            data-testid={`${PROJECT_NAME}-button-edit-${fieldId}`}
            size="small"
            disabled={disabled || isLoading}
            onClick={handleOpenModal}
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

      <InsuranceZoneModal
        open={isModalOpen}
        currentValue={value as string}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </>
  );
};
