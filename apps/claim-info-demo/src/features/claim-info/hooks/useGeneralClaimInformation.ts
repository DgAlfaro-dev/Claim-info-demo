'use client';

import { useState } from 'react';
import { useClaimInfoStore } from '../store/claimInfoStore';
import { BannerState } from '@claim-info-demo/core';

export const useGeneralClaimInformation = () => {
  const [isWaiveModalOpen, setIsWaiveModalOpen] = useState(false);
  const [isDriverGenderModalOpen, setIsDriverGenderModalOpen] = useState(false);
  const [isDriverBirthdayModalOpen, setIsDriverBirthdayModalOpen] =
    useState(false);
  const [banner, setBanner] = useState<BannerState>(null);

  const { claimInfo, updateDriverGender, updateDriverBirthday } = useClaimInfoStore();

  const claimInfoData = claimInfo?.data;
  const isLoading = claimInfo?.isLoading ?? false;

  // Calcular suma asegurada basada en cobertura
  const coverageCode = claimInfoData?.coverageCode ?? '000';
  const coverages = claimInfoData?.policy?.coverages ?? [];
  const currentCoverage = coverages.find(
    (coverage) => coverage.coverageCode === coverageCode,
  );
  const insuredAmount = Number(currentCoverage?.insuredAmount ?? '0');
  const coverageDescription = currentCoverage?.description ?? 'N/A';

  // Determinar si tiene pacto amistoso
  const hasFriendlyPact =
    Boolean(claimInfoData?.claim) && claimInfoData?.claim?.fud !== 'NONE';

  // Handlers para modales
  const handleOpenWaiveModal = () => {
    if (claimInfoData?.deductible?.exoneratedByAnalyst) return;
    setIsWaiveModalOpen(true);
  };

  const handleOpenDriverGenderModal = () => {
    setIsDriverGenderModalOpen(true);
  };

  const handleOpenDriverBirthdayModal = () => {
    setIsDriverBirthdayModalOpen(true);
  };

  const handleCloseWaiveModal = () => {
    setIsWaiveModalOpen(false);
  };

  const handleCloseDriverGenderModal = () => {
    setIsDriverGenderModalOpen(false);
  };

  const handleCloseDriverBirthdayModal = () => {
    setIsDriverBirthdayModalOpen(false);
  };

  const handleCloseBanner = () => setBanner(null);

  // Handler para confirmar exoneración de deducible
  const handleConfirmWaive = async (state: BannerState) => {
    setIsWaiveModalOpen(false);
    setBanner(state);

    // Auto-cerrar el banner después de 5 segundos
    if (state) {
      setTimeout(() => {
        setBanner(null);
      }, 5000);
    }
  };

  // Handler para confirmar género del conductor
  const handleConfirmDriverGender = (gender: string) => {
    console.log('Género actualizado:', gender);
    updateDriverGender(gender);
    setIsDriverGenderModalOpen(false);
    setBanner('success');

    // Auto-cerrar el banner después de 3 segundos
    setTimeout(() => {
      setBanner(null);
    }, 3000);
  };

  // Handler para confirmar fecha de nacimiento del conductor
  const handleConfirmDriverBirthday = (birthday: Date | null) => {
    console.log('Fecha de nacimiento actualizada:', birthday);
    if (birthday) {
      // Formatear como YYYY-MM-DD sin conversión a UTC para evitar cambios de día
      const year = birthday.getFullYear();
      const month = String(birthday.getMonth() + 1).padStart(2, '0');
      const day = String(birthday.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      updateDriverBirthday(formattedDate);
      setIsDriverGenderModalOpen(false);
      setBanner('success');

      // Auto-cerrar el banner después de 3 segundos
      setTimeout(() => {
        setBanner(null);
      }, 3000);
    }
  };

  return {
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
  };
};