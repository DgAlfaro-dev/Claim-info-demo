'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useGeneralClaimInformation } from '../hooks/useGeneralClaimInformation';
import { PROJECT_NAME } from '../../../features/shared/model/constants';
import { moneyFormat } from '../../../utils/utils';
import { Colones, Dollar } from '../../../utils/constants/constants';
import { WaiveDeductibleModal } from './WaiveDeductibleModal';
import { AlertBanner } from '../../../features/shared/components/AlertBanner';
import { getDriverBirthday, getDriverGender } from '../lib/utils';
import { DriverGenderModal } from './DriverGenderModal';
import { DriverBirthdayModal } from './DriverBirthdayModal';
import { DynamicFieldsRenderer } from './DynamicFieldsRenderer';
import { InfoCard, CardTitle, CardContent, CardItem, LabelText } from './shared/StyledComponents';
import { ValueText, EditableFieldRow } from './shared/UIComponents';
import { useCountryConfigContext } from '../context/CountryConfigContext';
import { FixedFieldId } from '../types';
import { getDefaultFieldConfig } from '../config/defaultFieldConfigs';
import { FieldValidationError } from './FieldValidationError';

/**
 * Obtiene el símbolo de moneda según el código de la moneda
 */
const getCurrencySymbol = (currencyCode?: string): string => {
  switch (currencyCode?.toUpperCase()) {
    case 'CRC': // Colones costarricenses
      return Colones;
    case 'USD': // Dólares estadounidenses
    case 'PAB': // Balboa panameño (usa mismo símbolo que USD)
      return Dollar;
    default:
      return Colones; // Default: Colones
  }
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

  // Obtener configuraciones resueltas del país
  const { resolvedFieldConfigs } = useCountryConfigContext();

  // Obtener símbolo de moneda dinámico según los datos
  const currencySymbol = getCurrencySymbol(claimInfoData?.currency);

  // Helper para obtener configuración de un campo
  const getFieldConfig = (fieldId: FixedFieldId) => {
    // Si hay configuración resuelta del país, usarla
    if (resolvedFieldConfigs?.[fieldId]) {
      return resolvedFieldConfigs[fieldId];
    }
    // Sino, usar configuración por defecto
    try {
      return getDefaultFieldConfig(fieldId);
    } catch {
      return { label: '', required: false, visible: true };
    }
  };

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
              {getFieldConfig(FixedFieldId.POLICY_OWNER_NAME).visible && (
                <CardItem size={6}>
                  <LabelText
                    id={`${PROJECT_NAME}-label-title-policy-information-name`}
                    data-testid={`${PROJECT_NAME}-label-title-policy-information-name`}
                  >
                    {getFieldConfig(FixedFieldId.POLICY_OWNER_NAME).label}
                  </LabelText>
                  <ValueText isLoading={isLoading}>
                    {claimInfoData?.policy?.Owner?.name ?? 'N/A'}{' '}
                    {claimInfoData?.policy?.Owner?.lastName}
                  </ValueText>
                  <FieldValidationError fieldKey="ownerName" />
                </CardItem>
              )}

              {getFieldConfig(FixedFieldId.POLICY_OWNER_RUC).visible && (
                <CardItem size={6}>
                  <LabelText
                    id={`${PROJECT_NAME}-label-title-policy-information-ruc`}
                    data-testid={`${PROJECT_NAME}-label-title-policy-information-ruc`}
                  >
                    {getFieldConfig(FixedFieldId.POLICY_OWNER_RUC).label}
                  </LabelText>
                  <ValueText isLoading={isLoading}>
                    {claimInfoData?.policy?.Owner?.ruc ?? 'N/A'}
                  </ValueText>
                  <FieldValidationError fieldKey="ruc" />
                </CardItem>
              )}

              {getFieldConfig(FixedFieldId.VEHICLE_MODEL).visible && (
                <CardItem size={6}>
                  <LabelText
                    id={`${PROJECT_NAME}-label-title-policy-information-model`}
                    data-testid={`${PROJECT_NAME}-label-title-policy-information-model`}
                  >
                    {getFieldConfig(FixedFieldId.VEHICLE_MODEL).label}
                  </LabelText>
                  <ValueText isLoading={isLoading}>
                    {claimInfoData?.vehicleInformation?.model ?? 'N/A'}
                  </ValueText>
                  <FieldValidationError fieldKey="model" />
                </CardItem>
              )}

              {getFieldConfig(FixedFieldId.VEHICLE_PLATE).visible && (
                <CardItem size={6}>
                  <LabelText
                    id={`${PROJECT_NAME}-label-title-policy-information-plate`}
                    data-testid={`${PROJECT_NAME}-label-title-policy-information-plate`}
                  >
                    {getFieldConfig(FixedFieldId.VEHICLE_PLATE).label}
                  </LabelText>
                  <ValueText isLoading={isLoading}>
                    {claimInfoData?.vehicleInformation?.plate ?? 'N/A'}
                  </ValueText>
                  <FieldValidationError fieldKey="plate" />
                </CardItem>
              )}

              {getFieldConfig(FixedFieldId.VEHICLE_CHASSIS).visible && (
                <CardItem size={6}>
                  <LabelText
                    id={`${PROJECT_NAME}-label-title-policy-information-chassis`}
                    data-testid={`${PROJECT_NAME}-label-title-policy-information-chassis`}
                  >
                    {getFieldConfig(FixedFieldId.VEHICLE_CHASSIS).label}
                  </LabelText>
                  <ValueText isLoading={isLoading}>
                    {claimInfoData?.vehicleInformation?.serialChassis ?? 'N/A'}
                  </ValueText>
                </CardItem>
              )}

              {getFieldConfig(FixedFieldId.VEHICLE_YEAR).visible && (
                <CardItem size={6}>
                  <LabelText
                    id={`${PROJECT_NAME}-label-title-policy-information-year`}
                    data-testid={`${PROJECT_NAME}-label-title-policy-information-year`}
                  >
                    {getFieldConfig(FixedFieldId.VEHICLE_YEAR).label}
                  </LabelText>
                  <ValueText isLoading={isLoading}>
                    {claimInfoData?.vehicleInformation?.year ?? 'N/A'}
                  </ValueText>
                </CardItem>
              )}

              {/* Campos dinámicos de la sección Policy */}
              <DynamicFieldsRenderer section="policy" isLoading={isLoading} />
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
              {getFieldConfig(FixedFieldId.DRIVER_GENDER).visible && (
                <EditableFieldRow
                  label={getFieldConfig(FixedFieldId.DRIVER_GENDER).label}
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
              )}

              {getFieldConfig(FixedFieldId.DRIVER_BIRTHDAY).visible && (
                <EditableFieldRow
                  label={getFieldConfig(FixedFieldId.DRIVER_BIRTHDAY).label}
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
              )}

              {getFieldConfig(FixedFieldId.DEDUCTIBLE).visible && (
                <EditableFieldRow
                  label={getFieldConfig(FixedFieldId.DEDUCTIBLE).label}
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
                  {moneyFormat(claimInfoData?.deductible?.Base ?? 0, currencySymbol)} /{' '}
                  {moneyFormat(
                    claimInfoData?.deductible?.Calculated ?? 0,
                    currencySymbol,
                  )}
                </EditableFieldRow>
              )}

              <CardItem size={6}>
                <LabelText
                  id={`${PROJECT_NAME}-label-title-claim-information-insured-sum`}
                  data-testid={`${PROJECT_NAME}-label-title-claim-information-insured-sum`}
                >
                  Suma asegurada
                </LabelText>
                <ValueText isLoading={isLoading}>
                  {moneyFormat(insuredAmount, currencySymbol)}
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

              {/* Campos dinámicos de la sección Claim */}
              <DynamicFieldsRenderer section="claim" isLoading={isLoading} />
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
                {moneyFormat(claimInfoData?.totalClaimCost ?? 0, currencySymbol)}
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