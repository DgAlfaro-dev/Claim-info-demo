'use client';

import { FC, ReactNode } from 'react';
import { PROJECT_NAME } from '../model/constants';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  styled,
} from '@mui/material';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DialogTitleText = styled(DialogTitle)(() => ({
  padding: 0,
  fontSize: '23px',
  fontWeight: 700,
  color: '#0D2E68',
  textAlign: 'center',
  width: '100%',
}));

const CloseIconButton = styled(IconButton)(() => ({
  padding: 0,
}));

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const BaseModal: FC<BaseModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'sm',
}) => {
  const modalId = `${PROJECT_NAME}-modal-base`;
  const titleId = `${PROJECT_NAME}-title-base`;
  const headerId = `${PROJECT_NAME}-header-base`;
  const bodyId = `${PROJECT_NAME}-body-base`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      id={modalId}
      data-testid={modalId}
      maxWidth={maxWidth}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '10px',
            paddingX: '20px',
            paddingTop: '10px',
            paddingBottom: '20px',
          },
        },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        id={headerId}
        data-testid={headerId}
      >
        <CloseIconButton
          size="small"
          onClick={onClose}
          id={`${PROJECT_NAME}-button-close-modal`}
          data-testid={`${PROJECT_NAME}-button-close-modal`}
        >
          <FontAwesomeIcon
            icon={faCircleXmark}
            id={`${PROJECT_NAME}-icon-close-modal`}
            data-testid={`${PROJECT_NAME}-icon-close-modal`}
            style={{ fontSize: '24px', color: '#0193E5' }}
          />
        </CloseIconButton>
      </Stack>

      {/* Body */}
      <Stack direction="column" id={bodyId} data-testid={bodyId}>
        <Stack alignItems="center" sx={{ mb: 2 }}>
          <DialogTitleText id={titleId} data-testid={titleId}>
            {title}
          </DialogTitleText>
        </Stack>

        <DialogContent
          sx={{ px: 2, py: 0 }}
          id={`${PROJECT_NAME}-content-modal`}
          data-testid={`${PROJECT_NAME}-content-modal`}
        >
          {children}
        </DialogContent>
      </Stack>
    </Dialog>
  );
};