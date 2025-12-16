'use client';

import { useState } from 'react';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { SupportedCountry, useCountryConfigContext } from '@claim-info-demo/core';
import { useSubmitClaim } from '@/features/claim-info';

const COUNTRIES = [
  { value: SupportedCountry.COSTA_RICA, label: '🇨🇷 Costa Rica' },
  { value: SupportedCountry.PANAMA, label: '🇵🇦 Panamá' },
];

export function CountrySelector() {
  const { currentCountry, loadCountry, isLoading } = useCountryConfigContext();
  const { clearSubmitResult } = useSubmitClaim();
  const [selectedCountry, setSelectedCountry] = useState<SupportedCountry>(
    currentCountry || SupportedCountry.COSTA_RICA
  );

  const handleCountryChange = async (country: SupportedCountry) => {
    setSelectedCountry(country);
    clearSubmitResult(); // Limpiar estado del botón de submit al cambiar de país
    await loadCountry(country);
  };

  const getCountryLabel = (country: SupportedCountry) => {
    return COUNTRIES.find((c) => c.value === country)?.label || country;
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={2}
      sx={{
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
          onChange={(e) => handleCountryChange(e.target.value as SupportedCountry)}
          disabled={isLoading}
        >
          {COUNTRIES.map((country) => (
            <MenuItem key={country.value} value={country.value}>
              {country.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {currentCountry && (
        <Chip
          label={`País activo: ${getCountryLabel(currentCountry).replace(/🇨🇷|🇵🇦/, '').trim()}`}
          color="primary"
          size="small"
        />
      )}
    </Stack>
  );
}
