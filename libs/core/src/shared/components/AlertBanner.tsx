'use client';

import { FC } from 'react';
import { Stack, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark as faHexagonXmark } from '@fortawesome/free-regular-svg-icons';
import { PROJECT_NAME } from '../model/constants';
import { AlertBannerProps, BannerVariant } from '../interfaces/alertBanner';

const BannerContainer = styled(Stack)<{ variant: BannerVariant }>(
  ({ variant, theme }) => ({
    width: '100%',
    maxHeight: '62px',
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    zIndex: theme.zIndex.snackbar,
    padding: '16px',
    boxSizing: 'border-box',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: variant === 'success' ? '#E8FBF3' : '#FFDCE0',
    border: variant === 'success' ? '1px solid #E8FBF3' : '1px solid #FFDCE0',
  }),
);

const BannerText = styled(Typography)(() => ({
  fontSize: '15px',
  fontWeight: 400,
}));

const CloseButton = styled(IconButton)(() => ({
  padding: 4,
}));

export const AlertBanner: FC<AlertBannerProps> = ({ variant, onClose }) => {
  const isSuccess = variant === 'success';

  return (
    <BannerContainer
      direction="row"
      variant={variant}
      role="alert"
      id={`${PROJECT_NAME}-banner-alert-${variant}`}
      data-testid={`${PROJECT_NAME}-banner-alert-${variant}`}
    >
      <FontAwesomeIcon
        icon={isSuccess ? faCircleCheck : faHexagonXmark}
        style={{
          fontSize: 24,
          color: isSuccess ? '#27AE60' : '#BB0016',
        }}
      />
      <BannerText sx={{ color: isSuccess ? '#0C472C' : '#910314' }}>
        {isSuccess
          ? '¡La operación se realizó con éxito!'
          : 'Disculpa, no pudimos completar la operación. Por favor, vuelve a intentar en unos minutos.'}
      </BannerText>

      <CloseButton
        onClick={onClose}
        id={`${PROJECT_NAME}-button-close-banner-${variant}`}
        data-testid={`${PROJECT_NAME}-button-close-banner-${variant}`}
      >
        <FontAwesomeIcon
          icon={faXmark}
          style={{ fontSize: 24, color: isSuccess ? '#27AE60' : '#BB0016' }}
        />
      </CloseButton>
    </BannerContainer>
  );
};