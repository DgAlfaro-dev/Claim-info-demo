/**
 * Insurance Zone Modal Component
 * Modal para seleccionar zona de cobertura en Panamá
 */

'use client';

import { FC, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { BaseModal, PROJECT_NAME } from '@claim-info-demo/core';

interface InsuranceZoneModalProps {
  open: boolean;
  currentValue?: string;
  onClose: () => void;
  onConfirm: (zone: string) => void;
}

/**
 * Zonas de seguro disponibles en Panamá
 */
const INSURANCE_ZONES = [
  { value: 'URBAN', label: 'Urbana' },
  { value: 'RURAL', label: 'Rural' },
  { value: 'INTERIOR', label: 'Interior' },
];

/**
 * Modal para seleccionar zona de cobertura del seguro
 */
export const InsuranceZoneModal: FC<InsuranceZoneModalProps> = ({
  open,
  currentValue,
  onClose,
  onConfirm,
}) => {
  const [selectedZone, setSelectedZone] = useState(currentValue || '');

  const handleConfirm = () => {
    if (!selectedZone) {
      return;
    }
    onConfirm(selectedZone);
    onClose();
  };

  const handleClose = () => {
    setSelectedZone(currentValue || '');
    onClose();
  };

  const getZoneLabel = (value: string) => {
    return INSURANCE_ZONES.find((zone) => zone.value === value)?.label || value;
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Seleccionar Zona de Cobertura"
    >
      <Stack spacing={3}>
        <Typography
          id={`${PROJECT_NAME}-modal-panama-insurance-zone-description`}
          data-testid={`${PROJECT_NAME}-modal-panama-insurance-zone-description`}
          sx={{ color: '#7E8084', fontSize: '14px' }}
        >
          Seleccione la zona geográfica de cobertura del seguro.
        </Typography>

        <Box>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              id={`${PROJECT_NAME}-radio-group-panama-insurance-zone`}
              data-testid={`${PROJECT_NAME}-radio-group-panama-insurance-zone`}
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
            >
              {INSURANCE_ZONES.map((zone) => (
                <FormControlLabel
                  key={zone.value}
                  value={zone.value}
                  control={
                    <Radio
                      sx={{
                        color: '#0193E5',
                        '&.Mui-checked': {
                          color: '#0193E5',
                        },
                      }}
                    />
                  }
                  label={zone.label}
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '14px',
                      color: '#0D2E68',
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            id={`${PROJECT_NAME}-button-cancel-panama-insurance-zone`}
            data-testid={`${PROJECT_NAME}-button-cancel-panama-insurance-zone`}
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
            id={`${PROJECT_NAME}-button-confirm-panama-insurance-zone`}
            data-testid={`${PROJECT_NAME}-button-confirm-panama-insurance-zone`}
            variant="contained"
            onClick={handleConfirm}
            disabled={!selectedZone}
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
