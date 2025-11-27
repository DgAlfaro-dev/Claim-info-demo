'use client';

import { FC, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { PROJECT_NAME } from '@features/shared/model/constants';
import { WaiveDeductibleModalProps } from '../model/types/waiveDeductibleModal';
import { BannerState } from '@features/shared/interfaces/alertBanner';
import { BaseModal } from '@features/shared/components/BaseModal';

export const WaiveDeductibleModal: FC<WaiveDeductibleModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!reason) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular llamada API (en el proyecto real esto sería una llamada real)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simular éxito
      const bannerState: BannerState = 'success';
      
      onConfirm(bannerState);
      handleClose();
    } catch (error) {
      // Simular error
      const bannerState: BannerState = 'error';
      onConfirm(bannerState);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setComments('');
    setIsSubmitting(false);
    onClose();
  };

  const isDisabled = !reason || isSubmitting;

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Exonerar Deducible"
      maxWidth="sm"
    >
      <Stack spacing={3}>
        <Box>
          <Typography
            id={`${PROJECT_NAME}-modal-waive-label`}
            data-testid={`${PROJECT_NAME}-modal-waive-label`}
            variant="body2"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            Motivo de exoneración *
          </Typography>
          <FormControl fullWidth>
            <Select
              id={`${PROJECT_NAME}-modal-waive-reason-select`}
              data-testid={`${PROJECT_NAME}-modal-waive-reason-select`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              displayEmpty
              disabled={isSubmitting}
            >
              <MenuItem value="" disabled>
                Seleccione un motivo
              </MenuItem>
              <MenuItem value="customer_loyalty">Fidelización del cliente</MenuItem>
              <MenuItem value="special_case">Caso especial</MenuItem>
              <MenuItem value="low_damage">Daño menor</MenuItem>
              <MenuItem value="good_history">Buen historial del cliente</MenuItem>
              <MenuItem value="management_decision">Decisión gerencial</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography
            id={`${PROJECT_NAME}-modal-waive-comments-label`}
            data-testid={`${PROJECT_NAME}-modal-waive-comments-label`}
            variant="body2"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            Comentarios adicionales (opcional)
          </Typography>
          <TextField
            id={`${PROJECT_NAME}-modal-waive-comments-input`}
            data-testid={`${PROJECT_NAME}-modal-waive-comments-input`}
            multiline
            rows={4}
            fullWidth
            placeholder="Ingrese comentarios adicionales..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            disabled={isSubmitting}
          />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            id={`${PROJECT_NAME}-modal-waive-cancel-button`}
            data-testid={`${PROJECT_NAME}-modal-waive-cancel-button`}
            variant="outlined"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            id={`${PROJECT_NAME}-modal-waive-confirm-button`}
            data-testid={`${PROJECT_NAME}-modal-waive-confirm-button`}
            variant="contained"
            onClick={handleConfirm}
            disabled={isDisabled}
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar'}
          </Button>
        </Stack>
      </Stack>
    </BaseModal>
  );
};