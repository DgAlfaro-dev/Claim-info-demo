/**
 * SubmitFeedback Component
 * Muestra el feedback del resultado del submit con errores y warnings
 */

'use client';

import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { SubmitPipelineResult } from '@claim-info-demo/core';

export interface SubmitFeedbackProps {
  /** Resultado del submit */
  result: SubmitPipelineResult | null;
  /** Callback cuando se cierra el feedback */
  onClose: () => void;
  /** Mostrar automáticamente */
  open?: boolean;
  /** Duración del auto-hide (ms), null para no auto-ocultar */
  autoHideDuration?: number | null;
}

export const SubmitFeedback: React.FC<SubmitFeedbackProps> = ({
  result,
  onClose,
  open = true,
  autoHideDuration = 6000,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);

  if (!result) return null;

  const hasErrors = result.errors && Object.keys(result.errors).length > 0;
  const hasWarnings = result.warnings && Object.keys(result.warnings).length > 0;
  const severity = result.success ? 'success' : 'error';

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={result.success ? autoHideDuration : null}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity={severity}
        onClose={onClose}
        sx={{ maxWidth: '600px', minWidth: '400px' }}
        variant="filled"
      >
        <AlertTitle>{result.message}</AlertTitle>

        {result.success && result.response && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            ID del Reclamo: <strong>{result.response.claimId}</strong>
          </Typography>
        )}

        {/* Mostrar errores si existen */}
        {hasErrors && (
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                mb: 1,
              }}
              onClick={toggleDetails}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', flex: 1 }}>
                Errores encontrados ({Object.keys(result.errors).length})
              </Typography>
              <IconButton size="small" sx={{ color: 'inherit' }}>
                {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={showDetails}>
              <List dense disablePadding>
                {Object.entries(result.errors).map(([key, message]) => (
                  <ListItem key={key} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <ErrorOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={message}
                      secondary={key}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        )}

        {/* Mostrar warnings si existen */}
        {hasWarnings && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Advertencias ({Object.keys(result.warnings).length})
            </Typography>
            <List dense disablePadding>
              {Object.entries(result.warnings).map(([key, message]) => (
                <ListItem key={key} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <WarningAmberIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={message}
                    secondary={key}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Alert>
    </Snackbar>
  );
};
