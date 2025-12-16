'use client';

import { useEffect } from 'react';
import { Box, Container, Stack } from '@mui/material';
import { CountryConfigProvider, SupportedCountry, useClaimInfoStore } from '@claim-info-demo/core';
import { GeneralClaimInformation, FloatingSubmitButton, SubmitFeedback } from '@/features/claim-info';
import { registerCountryExtensions } from '../config/country-extensions';
import { PageHeader } from '@/features/claim-info/components/PageHeader';
import { CountrySelector } from '@/features/country-selector/components/CountrySelector';
import { useSubmitFeedback } from '@/features/submit-feedback/hook/useSubmitFeedback';

// Registrar extensiones de países al cargar el módulo
registerCountryExtensions();

function ClaimInfoPage() {
  const { loadMockData } = useClaimInfoStore();
  const { showFeedback, submitResult, handleSubmitComplete, handleCloseFeedback } = useSubmitFeedback();

  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        paddingY: 4,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <PageHeader />

          <Box
            sx={{
              backgroundColor: '#fff',
              padding: 3,
              borderRadius: 2,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CountrySelector />
          </Box>

          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: 2,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              padding: 2,
            }}
          >
            <GeneralClaimInformation />
          </Box>
        </Stack>
      </Container>

      <FloatingSubmitButton 
        onSuccess={handleSubmitComplete}
        onError={handleSubmitComplete}
      />

      <SubmitFeedback
        result={submitResult}
        open={showFeedback}
        onClose={handleCloseFeedback}
      />
    </Box>
  );
}

export default function HomePage() {
  return (
    <CountryConfigProvider defaultCountry={SupportedCountry.COSTA_RICA}>
      <ClaimInfoPage />
    </CountryConfigProvider>
  );
}
