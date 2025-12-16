/**
 * Styled Components for General Claim Information
 * Componentes estilizados reutilizables
 */

import { Box, Grid, IconButton, styled, Typography } from '@mui/material';

export const InfoCard = styled(Box)(() => ({
  width: '90%',
  padding: '16px 21px',
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.08)',
  borderRadius: '8px',
  backgroundColor: '#fff',
  border: '1px solid #EAEAEA',
})) as typeof Box;

export const CardTitle = styled(Typography)(() => ({
  color: '#0D2E68',
  fontWeight: 900,
  fontSize: '19px',
})) as typeof Typography;

export const CardContent = styled(Grid)(() => ({})) as typeof Grid;

export const CardItem = styled(Grid)(() => ({})) as typeof Grid;

export const LabelText = styled(Typography)(() => ({
  color: '#7E8084',
  fontWeight: 500,
  fontSize: '11px',
})) as typeof Typography;

export const ValueTypography = styled(Typography)(() => ({
  color: '#0D2E68',
  fontWeight: 700,
  fontSize: '15px',
})) as typeof Typography;

export const EditIconButton = styled(IconButton)(() => ({
  borderRadius: '70px',
  width: '34px',
  height: '27px',
  padding: '8px 8px 8px 3px',
})) as typeof IconButton;
