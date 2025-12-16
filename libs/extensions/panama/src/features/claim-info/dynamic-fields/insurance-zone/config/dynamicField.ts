/**
 * Panama Insurance Zone Dynamic Field Definition
 */

import { DynamicFieldDefinition } from '@claim-info-demo/core';
import { PanamaInsuranceZoneField } from '../components/PanamaInsuranceZoneField';

export const panamaInsuranceZoneField: DynamicFieldDefinition = {
  id: 'panamaInsuranceZone',
  section: 'claim',
  position: 14,
  config: {
    label: 'Zona de cobertura',
    required: true,
    visible: true,
    helperText: 'Zona geográfica del seguro',
  },
  component: PanamaInsuranceZoneField,
};
