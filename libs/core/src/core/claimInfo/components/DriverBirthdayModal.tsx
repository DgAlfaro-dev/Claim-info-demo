'use client';

import { FC, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { PROJECT_NAME } from '../../../features/shared/model/constants';
import { BaseModal } from '../../../features/shared/components/BaseModal';

interface DriverBirthdayModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (birthday: Date | null) => void;
}

export const DriverBirthdayModal: FC<DriverBirthdayModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedDate) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular llamada API
      await new Promise((resolve) => setTimeout(resolve, 800));

      onConfirm(selectedDate);
      handleClose();
    } catch (error) {
      console.error('Error al actualizar fecha de nacimiento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedDate(null);
    setIsSubmitting(false);
    onClose();
  };

  const isDisabled = !selectedDate || isSubmitting;

  // Fecha máxima: 18 años atrás desde hoy
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  // Fecha mínima: 100 años atrás desde hoy
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Editar Fecha de Nacimiento"
      maxWidth="xs"
    >
      <Stack spacing={3}>
        <Box>
          <Typography
            id={`${PROJECT_NAME}-modal-birthday-label`}
            data-testid={`${PROJECT_NAME}-modal-birthday-label`}
            variant="body2"
            sx={{ mb: 2, fontWeight: 500 }}
          >
            Seleccione la fecha de nacimiento del conductor *
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
                label="Fecha de nacimiento"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                maxDate={maxDate}
                minDate={minDate}
                disabled={isSubmitting}
                slotProps={{
                    textField: {
                    fullWidth: true,
                    id: `${PROJECT_NAME}-modal-birthday-picker`,
                    inputProps: {
                        'data-testid': `${PROJECT_NAME}-modal-birthday-picker`,
                    },
                    },
                }}
            />
          </LocalizationProvider>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block' }}
          >
            El conductor debe tener al menos 18 años
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            id={`${PROJECT_NAME}-modal-birthday-cancel-button`}
            data-testid={`${PROJECT_NAME}-modal-birthday-cancel-button`}
            variant="outlined"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            id={`${PROJECT_NAME}-modal-birthday-confirm-button`}
            data-testid={`${PROJECT_NAME}-modal-birthday-confirm-button`}
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