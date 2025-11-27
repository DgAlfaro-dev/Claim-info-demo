'use client';

import {
  Box,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { useGeneralClaimInformation } from '../hooks/useGeneralClaimInformation';
import { LoadingProp } from '../model/types/common';
import { PROJECT_NAME } from '@features/shared/model/constants';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { moneyFormat } from '@utils/utils';
import { Colones } from '@utils/constants/constants';
import { WaiveDeductibleModal } from './WaiveDeductibleModal';
import { AlertBanner } from '@features/shared/components/AlertBanner';
import { getDriverBirthday, getDriverGender } from '../lib/utils';
import { DriverGenderModal } from './DriverGenderModal';
import { DriverBirthdayModal } from './DriverBirthdayModal';

// Styled Components
const InfoCard = styled(Box)(() => ({
  width: '90%',
  padding: '16px 21px',
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.08)',
  borderRadius: '8px',
  backgroundColor: '#fff',
  border: '1px solid #EAEAEA',
}));

const CardTitle = styled(Typography)(() => ({
  color: '#0D2E68',
  fontWeight: 900,
  fontSize: '19px',
}));

const CardContent = styled(Grid)(() => ({}));
const CardItem = styled(Grid)(() => ({}));

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

// Value Text Component with Loading State
const ValueText: FC<PropsWithChildren<LoadingProp>> = ({
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

// Editable Field Row Component
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

const EditableFieldRow: FC<EditableFieldRowProps> = ({
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

// Main Component
export const GeneralClaimInformation = () => {
  const {
    banner,
    isLoading,
    claimInfoData,
    insuredAmount,
    hasFriendlyPact,
    isWaiveModalOpen,
    handleCloseBanner,
    handleConfirmWaive,
    coverageDescription,
    handleOpenWaiveModal,
    handleCloseWaiveModal,
    isDriverGenderModalOpen,
    isDriverBirthdayModalOpen,
    handleConfirmDriverGender,
    handleConfirmDriverBirthday,
    handleOpenDriverGenderModal,
    handleCloseDriverGenderModal,
    handleOpenDriverBirthdayModal,
    handleCloseDriverBirthdayModal,
  } = useGeneralClaimInformation();

  return (
    <>
      {banner && <AlertBanner variant={banner} onClose={handleCloseBanner} />}

      <Stack direction="column" gap={2} sx={{ paddingY: '20px' }}>
        {/* === Datos de la póliza === */}
        <InfoCard
          id={`${PROJECT_NAME}-card-policy-information`}
          data-testid={`${PROJECT_NAME}-card-policy-information`}
        >
          <Stack direction="column" gap={2}>
            <CardTitle
              id={`${PROJECT_NAME}-label-title-policy-information`}
              data-testid={`${PROJECT_NAME}-label-title-policy-information`}
            >
              Datos de la póliza
            </CardTitle>

            <CardContent container spacing={2}>
              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-policy-information-name`}
                  data-testid={`${PROJECT_NAME}-label-title-policy-information-name`}
                >
                  Nombre
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {claimInfoData?.policy?.Owner?.name ?? 'N/A'}{' '}
                  {claimInfoData?.policy?.Owner?.lastName}
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-policy-information-ruc`}
                  data-testid={`${PROJECT_NAME}-label-title-policy-information-ruc`}
                >
                  Cédula
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {claimInfoData?.policy?.Owner?.ruc ?? 'N/A'}
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-policy-information-model`}
                  data-testid={`${PROJECT_NAME}-label-title-policy-information-model`}
                >
                  Modelo del auto
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {claimInfoData?.vehicleInformation?.model ?? 'N/A'}
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-policy-information-plate`}
                  data-testid={`${PROJECT_NAME}-label-title-policy-information-plate`}
                >
                  Nro. de placa
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {claimInfoData?.vehicleInformation?.plate ?? 'N/A'}
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-policy-information-chassis`}
                  data-testid={`${PROJECT_NAME}-label-title-policy-information-chassis`}
                >
                  Nro. de chasis
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {claimInfoData?.vehicleInformation?.serialChassis ?? 'N/A'}
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-policy-information-year`}
                  data-testid={`${PROJECT_NAME}-label-title-policy-information-year`}
                >
                  Año del auto
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {claimInfoData?.vehicleInformation?.year ?? 'N/A'}
                </ValueText>
              </CardItem>
            </CardContent>
          </Stack>
        </InfoCard>

        {/* === Datos del reclamo === */}
        <InfoCard
          id={`${PROJECT_NAME}-card-claim-information`}
          data-testid={`${PROJECT_NAME}-card-claim-information`}
        >
          <Stack direction="column" gap={2}>
            <CardTitle
              id={`${PROJECT_NAME}-label-title-claim-information`}
              data-testid={`${PROJECT_NAME}-label-title-claim-information`}
            >
              Datos del reclamo
            </CardTitle>

            <CardContent container spacing={2}>
              <EditableFieldRow
                label="Género de conductor"
                isLoading={isLoading}
                onEdit={handleOpenDriverGenderModal}
                labelId={`${PROJECT_NAME}-label-title-claim-information-driver-gender`}
                labelTestId={`${PROJECT_NAME}-label-title-claim-information-driver-gender`}
                buttonId={`${PROJECT_NAME}-button-edit-driver-gender`}
                buttonTestId={`${PROJECT_NAME}-button-edit-driver-gender`}
                iconId={`${PROJECT_NAME}-icon-edit-driver-gender`}
                iconTestId={`${PROJECT_NAME}-icon-edit-driver-gender`}
              >
                {getDriverGender(claimInfoData?.claim?.driver?.gender)}
              </EditableFieldRow>

              <EditableFieldRow
                label="Fecha de nacimiento de conductor"
                isLoading={isLoading}
                onEdit={handleOpenDriverBirthdayModal}
                labelId={`${PROJECT_NAME}-label-title-claim-information-driver-birthday`}
                labelTestId={`${PROJECT_NAME}-label-title-claim-information-driver-birthday`}
                buttonId={`${PROJECT_NAME}-button-edit-driver-birthday`}
                buttonTestId={`${PROJECT_NAME}-button-edit-driver-birthday`}
                iconId={`${PROJECT_NAME}-icon-edit-driver-birthday`}
                iconTestId={`${PROJECT_NAME}-icon-edit-driver-birthday`}
              >
                {getDriverBirthday(claimInfoData?.claim?.driver?.birthday)}
              </EditableFieldRow>

              <EditableFieldRow
                label="Deducible / Deducible calculado"
                isLoading={isLoading}
                onEdit={handleOpenWaiveModal}
                disabledEdit={
                  claimInfoData?.deductible?.exoneratedByAnalyst ?? false
                }
                labelId={`${PROJECT_NAME}-label-title-claim-information-deductible`}
                labelTestId={`${PROJECT_NAME}-label-title-claim-information-deductible`}
                buttonId={`${PROJECT_NAME}-button-edit-deductible`}
                buttonTestId={`${PROJECT_NAME}-button-edit-deductible`}
                iconId={`${PROJECT_NAME}-icon-edit-deductible`}
                iconTestId={`${PROJECT_NAME}-icon-edit-deductible`}
              >
                {moneyFormat(claimInfoData?.deductible?.Base ?? 0, Colones)} /{' '}
                {moneyFormat(
                  claimInfoData?.deductible?.Calculated ?? 0,
                  Colones,
                )}
              </EditableFieldRow>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-claim-information-insured-sum`}
                  data-testid={`${PROJECT_NAME}-label-title-claim-information-insured-sum`}
                >
                  Suma asegurada
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {moneyFormat(insuredAmount, Colones)}
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-claim-information-total-loss`}
                  data-testid={`${PROJECT_NAME}-label-title-claim-information-total-loss`}
                >
                  Porcentaje de pérdida total
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {claimInfoData?.totalLossPercentage ?? '0'}%
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-claim-information-delinquency`}
                  data-testid={`${PROJECT_NAME}-label-title-claim-information-delinquency`}
                >
                  Morosidad de la póliza
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {claimInfoData?.policy?.payOverdueDays
                    ? `${claimInfoData?.policy?.payOverdueDays} días`
                    : 'N/A'}
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-claim-information-friendly`}
                  data-testid={`${PROJECT_NAME}-label-title-claim-information-friendly`}
                >
                  Pacto amistoso
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {hasFriendlyPact ? 'Aplica' : 'No Aplica'}
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-claim-information-depreciation`}
                  data-testid={`${PROJECT_NAME}-label-title-claim-information-depreciation`}
                >
                  Porcentaje de depreciación
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {claimInfoData?.vehicleInformation?.depreciation ?? 0}%
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-claim-information-plan-type`}
                  data-testid={`${PROJECT_NAME}-label-title-claim-information-plan-type`}
                >
                  Tipo de plan
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {claimInfoData?.endorsement ?? 'N/A'}
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-claim-information-coverage`}
                  data-testid={`${PROJECT_NAME}-label-title-claim-information-coverage`}
                >
                  Cobertura
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {coverageDescription}
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-claim-information-broker`}
                  data-testid={`${PROJECT_NAME}-label-title-claim-information-broker`}
                >
                  Corredor de seguro
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {claimInfoData?.policy?.Broker?.FullName ?? 'N/A'}
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-claim-information-creditor`}
                  data-testid={`${PROJECT_NAME}-label-title-claim-information-creditor`}
                >
                  Acreedor
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {claimInfoData?.creditor ?? 'N/A'}
                </ValueText>
              </CardItem>

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-claim-information-deductible-payment`}
                  data-testid={`${PROJECT_NAME}-label-title-claim-information-deductible-payment`}
                >
                  Pago de deducible
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {claimInfoData?.deductiblePayment ?? 'N/A'}
                </ValueText>
              </CardItem>
            </CardContent>
          </Stack>
        </InfoCard>

        {/* === Costo total del reclamo === */}
        <Box
          id={`${PROJECT_NAME}-container-claim-total`}
          data-testid={`${PROJECT_NAME}-container-claim-total`}
          sx={{
            padding: '24px 15px',
            backgroundColor: '#F5FAFF',
            boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              id={`${PROJECT_NAME}-label-title-claim-total`}
              data-testid={`${PROJECT_NAME}-label-title-claim-total`}
              sx={{ fontWeight: 900, fontSize: '18px', color: '#0D2E68' }}
            >
              Costo total del reclamo
            </Typography>
            <Box
              id={`${PROJECT_NAME}-box-claim-total-value`}
              data-testid={`${PROJECT_NAME}-box-claim-total-value`}
              sx={{
                backgroundColor: '#CEE8FF',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '40px',
                width: '138px',
              }}
            >
              <Typography
                id={`${PROJECT_NAME}-label-value-claim-total`}
                data-testid={`${PROJECT_NAME}-label-value-claim-total`}
                sx={{ fontWeight: 900, fontSize: '18px', color: '#0D2E68' }}
              >
                {moneyFormat(claimInfoData?.totalClaimCost ?? 0, Colones)}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>

      <WaiveDeductibleModal
        open={isWaiveModalOpen}
        onClose={handleCloseWaiveModal}
        onConfirm={handleConfirmWaive}
      />

      <DriverGenderModal
        open={isDriverGenderModalOpen}
        onClose={handleCloseDriverGenderModal}
        onConfirm={handleConfirmDriverGender}
      />

      <DriverBirthdayModal
        open={isDriverBirthdayModalOpen}
        onClose={handleCloseDriverBirthdayModal}
        onConfirm={handleConfirmDriverBirthday}
      />
    </>
  );
};