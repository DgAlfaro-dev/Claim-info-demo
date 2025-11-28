/**
 * Reusable UI Components
 * Componentes de UI reutilizables para información de reclamos
 */

import { FC, PropsWithChildren, ReactNode } from 'react';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadingProp } from '../../model/types/common';
import { PROJECT_NAME } from '../../../../features/shared/model/constants';
import { CardItem, EditIconButton, LabelText, ValueTypography } from './StyledComponents';

/**
 * Value Text Component with Loading State
 */
export const ValueText: FC<PropsWithChildren<LoadingProp>> = ({
  isLoading,
  children,
}) => {
  return isLoading ? (
    <Skeleton variant="text" width={110} height={16} />
  ) : (
    <ValueTypography
      id={`${PROJECT_NAME}-label-value-policy-information`}
      data-testid={`${PROJECT_NAME}-label-value-policy-information`}
    >
      {children}
    </ValueTypography>
  );
};

/**
 * Editable Field Row Component
 * Campo con valor y botón de edición
 */
interface EditableFieldRowProps extends LoadingProp {
  label: string;
  children: ReactNode;
  onEdit?: () => void;
  disabledEdit?: boolean;
  labelId: string;
  labelTestId: string;
  buttonId: string;
  buttonTestId: string;
  iconId: string;
  iconTestId: string;
}

export const EditableFieldRow: FC<EditableFieldRowProps> = ({
  label,
  isLoading,
  children,
  onEdit,
  disabledEdit,
  labelId,
  labelTestId,
  buttonId,
  buttonTestId,
  iconId,
  iconTestId,
}) => {
  return (
    <CardItem size={6}>
      <LabelText id={labelId} data-testid={labelTestId}>
        {label}
      </LabelText>
      <Stack
        direction="row"
        gap={1}
        alignItems="end"
        justifyContent="space-between"
      >
        <ValueText isLoading={isLoading}>{children}</ValueText>
        <EditIconButton
          id={buttonId}
          data-testid={buttonTestId}
          size="small"
          disabled={disabledEdit}
          onClick={onEdit}
        >
          <FontAwesomeIcon
            icon={faPen}
            id={iconId}
            data-testid={iconTestId}
            style={{
              fontSize: '16px',
              color: disabledEdit ? '#A3A2A2' : '#0193E5',
            }}
          />
        </EditIconButton>
      </Stack>
    </CardItem>
  );
};
