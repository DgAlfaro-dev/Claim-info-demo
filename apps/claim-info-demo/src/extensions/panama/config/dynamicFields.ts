/**
 * Panama Dynamic Fields
 * Definición de campos dinámicos para Panamá
 */

import { DynamicFieldDefinition } from '@/core/claimInfo';
import { PanamaTaxIdField } from '../components/PanamaTaxIdField';
import { PanamaInsuranceZoneField } from '../components/PanamaInsuranceZoneField';

/**
 * Campos dinámicos específicos de Panamá
 */
export const panamaDynamicFields: DynamicFieldDefinition[] = [
  {
    id: 'panamaTaxId',
    section: 'policy',
    position: 7, // Después del año del vehículo
    config: {
      label: 'RUC del Asegurado',
      required: true,
      visible: true,
      helperText: 'Formato: 1234567-1-123456',
    },
    component: PanamaTaxIdField,
  },
  {
    id: 'panamaInsuranceZone',
    section: 'claim',
    position: 14, // Después del pago de deducible
    config: {
      label: 'Zona de cobertura',
      required: true,
      visible: true,
      helperText: 'Zona geográfica del seguro',
    },
    component: PanamaInsuranceZoneField,
  },
];
