/**
 * Panama Tax ID Dynamic Field Definition
 */

import { DynamicFieldDefinition } from '@claim-info-demo/core';
import { PanamaTaxIdField } from '../components/PanamaTaxIdField';

export const panamaTaxIdField: DynamicFieldDefinition = {
  id: 'panamaTaxId',
  section: 'policy',
  position: 7,
  config: {
    label: 'RUC del Asegurado',
    required: true,
    visible: true,
    helperText: 'Formato: 1234567-1-123456',
  },
  component: PanamaTaxIdField,
};
