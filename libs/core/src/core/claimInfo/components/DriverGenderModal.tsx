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
import { PROJECT_NAME } from '../../../features/shared/model/constants';
import { BaseModal } from '../../../features/shared/components/BaseModal';

interface DriverGenderModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (gender: string) => void;
}

export const DriverGenderModal: FC<DriverGenderModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedGender) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular llamada API
      await new Promise((resolve) => setTimeout(resolve, 800));

      onConfirm(selectedGender);
      handleClose();
    } catch (error) {
      console.error('Error al actualizar género:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedGender('');
    setIsSubmitting(false);
    onClose();
  };

  const isDisabled = !selectedGender || isSubmitting;

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Editar Género del Conductor"
      maxWidth="xs"
    >
      <Stack spacing={3}>
        <Box>
          <Typography
            id={`${PROJECT_NAME}-modal-gender-label`}
            data-testid={`${PROJECT_NAME}-modal-gender-label`}
            variant="body2"
            sx={{ mb: 2, fontWeight: 500 }}
          >
            Seleccione el género del conductor *
          </Typography>
          <FormControl fullWidth>
            <RadioGroup
              id={`${PROJECT_NAME}-modal-gender-radio-group`}
              data-testid={`${PROJECT_NAME}-modal-gender-radio-group`}
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <FormControlLabel
                value="M"
                control={<Radio />}
                label="Masculino"
                disabled={isSubmitting}
              />
              <FormControlLabel
                value="F"
                control={<Radio />}
                label="Femenino"
                disabled={isSubmitting}
              />
              <FormControlLabel
                value="O"
                control={<Radio />}
                label="Otro"
                disabled={isSubmitting}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            id={`${PROJECT_NAME}-modal-gender-cancel-button`}
            data-testid={`${PROJECT_NAME}-modal-gender-cancel-button`}
            variant="outlined"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            id={`${PROJECT_NAME}-modal-gender-confirm-button`}
            data-testid={`${PROJECT_NAME}-modal-gender-confirm-button`}
            variant="contained"
            onClick={handleConfirm}
            disabled={isDisabled}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </Stack>
      </Stack>
    </BaseModal>
  );
};