'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import { 
  CountryConfigProvider, 
  GeneralClaimInformation, 
  SupportedCountry, 
  useClaimInfoStore, 
  useCountryConfigContext,
  CountryConfigFactory 
} from '@claim-info-demo/core';
import { costaRicaConfig } from '@claim-info-demo/extension-costa-rica';
import { panamaConfig } from '@claim-info-demo/extension-panama';

// Registrar extensiones de países antes de usarlas
CountryConfigFactory.registerCountryExtension(
  SupportedCountry.COSTA_RICA,
  async () => costaRicaConfig
);
CountryConfigFactory.registerCountryExtension(
  SupportedCountry.PANAMA,
  async () => panamaConfig
);

function HomePageContent() {
  const { loadMockData, claimInfo } = useClaimInfoStore();
  const { currentCountry, loadCountry, isLoading: isLoadingConfig } = useCountryConfigContext();
  const [selectedCountry, setSelectedCountry] = useState<SupportedCountry>(
    SupportedCountry.COSTA_RICA
  );

  useEffect(() => {
    // Cargar datos mock al montar el componente
    loadMockData();
  }, [loadMockData]);

  const handleReloadData = () => {
    loadMockData();
  };

  const handleCountryChange = async (country: SupportedCountry) => {
    setSelectedCountry(country);
    await loadCountry(country);
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
            <Stack spacing={2}>
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

              {/* Country Selector */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  paddingTop: 2,
                  borderTop: '1px solid #EAEAEA',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: '#0D2E68', minWidth: '120px' }}
                >
                  Seleccionar país:
                </Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <Select
                    value={selectedCountry}
                    onChange={(e) =>
                      handleCountryChange(e.target.value as SupportedCountry)
                    }
                    disabled={isLoadingConfig}
                  >
                    <MenuItem value={SupportedCountry.COSTA_RICA}>
                      🇨🇷 Costa Rica
                    </MenuItem>
                    <MenuItem value={SupportedCountry.PANAMA}>
                      🇵🇦 Panamá
                    </MenuItem>
                  </Select>
                </FormControl>
                {currentCountry && (
                  <Chip
                    label={`País activo: ${currentCountry === SupportedCountry.COSTA_RICA ? 'Costa Rica' : 'Panamá'}`}
                    color="primary"
                    size="small"
                  />
                )}
              </Box>
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

export default function HomePage() {
  return (
    <CountryConfigProvider defaultCountry={SupportedCountry.COSTA_RICA}>
      <HomePageContent />
    </CountryConfigProvider>
  );
}