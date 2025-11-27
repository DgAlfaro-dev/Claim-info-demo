'use client';

import { useEffect } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useClaimInfoStore } from '@/features/claimInfo/store/claimInfoStore';
import { GeneralClaimInformation } from '@/features/claimInfo/components/GeneralClaimInformation';

export default function HomePage() {
  const { loadMockData, claimInfo } = useClaimInfoStore();

  useEffect(() => {
    // Cargar datos mock al montar el componente
    loadMockData();
  }, [loadMockData]);

  const handleReloadData = () => {
    loadMockData();
  };

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
          {/* Header */}
          <Box
            sx={{
              backgroundColor: '#fff',
              padding: 3,
              borderRadius: 2,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#0D2E68',
                    marginBottom: 1,
                  }}
                >
                  General Claim Information - Demo
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#7E8084',
                  }}
                >
                  Componente de demostración con datos mock
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleReloadData}
                disabled={claimInfo?.isLoading}
              >
                {claimInfo?.isLoading ? 'Cargando...' : 'Recargar Datos'}
              </Button>
            </Stack>
          </Box>

          {/* Main Content */}
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
    </Box>
  );
}