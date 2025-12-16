'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import { useClaimInfoStore } from '@claim-info-demo/core';
import { useSubmitClaim } from '../hooks/useSubmitClaim';

export function PageHeader() {
  const { loadMockData, claimInfo } = useClaimInfoStore();
  const { clearSubmitResult } = useSubmitClaim();

  const handleReloadData = () => {
    clearSubmitResult(); // Limpiar estado del botón de submit
    loadMockData();
  };

  return (
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
            Sistema extensible por país con configuraciones dinámicas
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
  );
}
