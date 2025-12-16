import {
  mergeFieldConfig,
  mergeAllFieldConfigs,
  getResolvedFieldConfig,
  getVisibleFields,
  sortFieldsByOrder,
  validateRequiredFields,
} from '../../core/claimInfo/utils/configUtils';
import { FieldConfig, FixedFieldId } from '../../core/claimInfo/types';
import { DEFAULT_FIELD_CONFIGS } from '../../core/claimInfo/config/defaultFieldConfigs';

describe('configUtils', () => {
  describe('mergeFieldConfig', () => {
    it('should return default config when no overrides provided', () => {
      const defaultConfig: FieldConfig = {
        label: 'Default Label',
        required: true,
        visible: true,
        order: 1,
      };

      const result = mergeFieldConfig(defaultConfig);

      expect(result).toEqual(defaultConfig);
      expect(result).not.toBe(defaultConfig); // Should be a new object
    });

    it('should merge overrides with default config', () => {
      const defaultConfig: FieldConfig = {
        label: 'Default Label',
        required: true,
        visible: true,
        order: 1,
      };

      const overrides: Partial<FieldConfig> = {
        label: 'Overridden Label',
        helperText: 'New helper text',
      };

      const result = mergeFieldConfig(defaultConfig, overrides);

      expect(result).toEqual({
        label: 'Overridden Label',
        required: true,
        visible: true,
        order: 1,
        helperText: 'New helper text',
      });
    });

    it('should allow overriding visibility', () => {
      const defaultConfig: FieldConfig = {
        label: 'Label',
        required: true,
        visible: true,
        order: 1,
      };

      const overrides: Partial<FieldConfig> = {
        visible: false,
      };

      const result = mergeFieldConfig(defaultConfig, overrides);

      expect(result.visible).toBe(false);
    });
  });

  describe('mergeAllFieldConfigs', () => {
    it('should return all default configs when no overrides provided', () => {
      const result = mergeAllFieldConfigs();

      expect(Object.keys(result).length).toBe(Object.keys(DEFAULT_FIELD_CONFIGS).length);
      expect(result[FixedFieldId.POLICY_OWNER_NAME]).toBeDefined();
    });

    it('should merge overrides for specific fields', () => {
      const overrides = {
        [FixedFieldId.POLICY_OWNER_RUC]: {
          label: 'RUC',
          helperText: 'Registro Único',
        },
      };

      const result = mergeAllFieldConfigs(overrides);

      expect(result[FixedFieldId.POLICY_OWNER_RUC].label).toBe('RUC');
      expect(result[FixedFieldId.POLICY_OWNER_RUC].helperText).toBe('Registro Único');
      // Other fields should remain unchanged
      expect(result[FixedFieldId.POLICY_OWNER_NAME]).toEqual(
        DEFAULT_FIELD_CONFIGS[FixedFieldId.POLICY_OWNER_NAME]
      );
    });

    it('should not modify fields without overrides', () => {
      const overrides = {
        [FixedFieldId.POLICY_OWNER_RUC]: {
          label: 'Modified',
        },
      };

      const result = mergeAllFieldConfigs(overrides);

      expect(result[FixedFieldId.VEHICLE_PLATE]).toEqual(
        DEFAULT_FIELD_CONFIGS[FixedFieldId.VEHICLE_PLATE]
      );
    });
  });

  describe('getResolvedFieldConfig', () => {
    it('should return config with fieldId included', () => {
      const result = getResolvedFieldConfig(FixedFieldId.POLICY_OWNER_NAME);

      expect(result.fieldId).toBe(FixedFieldId.POLICY_OWNER_NAME);
      expect(result.label).toBeDefined();
    });

    it('should apply overrides to specific field', () => {
      const overrides = {
        [FixedFieldId.POLICY_OWNER_RUC]: {
          label: 'Custom RUC Label',
        },
      };

      const result = getResolvedFieldConfig(FixedFieldId.POLICY_OWNER_RUC, overrides);

      expect(result.label).toBe('Custom RUC Label');
      expect(result.fieldId).toBe(FixedFieldId.POLICY_OWNER_RUC);
    });

    it('should throw error for non-existent field', () => {
      expect(() => {
        getResolvedFieldConfig('NON_EXISTENT_FIELD' as FixedFieldId);
      }).toThrow('No default configuration found for field');
    });
  });

  describe('getVisibleFields', () => {
    it('should return only visible fields', () => {
      const configs = {
        field1: { label: 'Field 1', required: true, visible: true, order: 1 },
        field2: { label: 'Field 2', required: false, visible: false, order: 2 },
        field3: { label: 'Field 3', required: true, visible: true, order: 3 },
      };

      const result = getVisibleFields(configs);

      expect(Object.keys(result)).toEqual(['field1', 'field3']);
      expect(result.field2).toBeUndefined();
    });

    it('should return empty object when no fields are visible', () => {
      const configs = {
        field1: { label: 'Field 1', required: true, visible: false, order: 1 },
        field2: { label: 'Field 2', required: false, visible: false, order: 2 },
      };

      const result = getVisibleFields(configs);

      expect(Object.keys(result)).toHaveLength(0);
    });

    it('should return all fields when all are visible', () => {
      const configs = {
        field1: { label: 'Field 1', required: true, visible: true, order: 1 },
        field2: { label: 'Field 2', required: false, visible: true, order: 2 },
      };

      const result = getVisibleFields(configs);

      expect(Object.keys(result)).toHaveLength(2);
    });
  });

  describe('sortFieldsByOrder', () => {
    it('should sort fields by order property', () => {
      const configs = {
        field1: { label: 'Field 1', required: true, visible: true, order: 3 },
        field2: { label: 'Field 2', required: false, visible: true, order: 1 },
        field3: { label: 'Field 3', required: true, visible: true, order: 2 },
      };

      const result = sortFieldsByOrder(configs);

      expect(result[0][0]).toBe('field2'); // order 1
      expect(result[1][0]).toBe('field3'); // order 2
      expect(result[2][0]).toBe('field1'); // order 3
    });

    it('should place fields without order at the end', () => {
      const configs = {
        field1: { label: 'Field 1', required: true, visible: true, order: 1 },
        field2: { label: 'Field 2', required: false, visible: true }, // No order
        field3: { label: 'Field 3', required: true, visible: true, order: 2 },
      };

      const result = sortFieldsByOrder(configs);

      expect(result[0][0]).toBe('field1'); // order 1
      expect(result[1][0]).toBe('field3'); // order 2
      expect(result[2][0]).toBe('field2'); // no order (defaults to 999)
    });
  });

  describe('validateRequiredFields', () => {
    it('should return valid when all required fields have values', () => {
      const configs = {
        field1: { label: 'Field 1', required: true, visible: true, order: 1 },
        field2: { label: 'Field 2', required: true, visible: true, order: 2 },
      };

      const values = {
        field1: 'value1',
        field2: 'value2',
      };

      const result = validateRequiredFields(configs, values);

      expect(result.isValid).toBe(true);
      expect(result.missingFields).toHaveLength(0);
    });

    it('should return invalid when required fields are missing', () => {
      const configs = {
        field1: { label: 'Field 1', required: true, visible: true, order: 1 },
        field2: { label: 'Field 2', required: true, visible: true, order: 2 },
      };

      const values = {
        field1: 'value1',
        // field2 is missing
      };

      const result = validateRequiredFields(configs, values);

      expect(result.isValid).toBe(false);
      expect(result.missingFields).toEqual(['field2']);
    });

    it('should ignore non-required fields', () => {
      const configs = {
        field1: { label: 'Field 1', required: true, visible: true, order: 1 },
        field2: { label: 'Field 2', required: false, visible: true, order: 2 },
      };

      const values = {
        field1: 'value1',
        // field2 is missing but not required
      };

      const result = validateRequiredFields(configs, values);

      expect(result.isValid).toBe(true);
      expect(result.missingFields).toHaveLength(0);
    });

    it('should ignore hidden required fields', () => {
      const configs = {
        field1: { label: 'Field 1', required: true, visible: true, order: 1 },
        field2: { label: 'Field 2', required: true, visible: false, order: 2 },
      };

      const values = {
        field1: 'value1',
        // field2 is missing but hidden
      };

      const result = validateRequiredFields(configs, values);

      expect(result.isValid).toBe(true);
      expect(result.missingFields).toHaveLength(0);
    });

    it('should treat empty strings as missing values', () => {
      const configs = {
        field1: { label: 'Field 1', required: true, visible: true, order: 1 },
      };

      const values = {
        field1: '',
      };

      const result = validateRequiredFields(configs, values);

      expect(result.isValid).toBe(false);
      expect(result.missingFields).toEqual(['field1']);
    });

    it('should treat null and undefined as missing values', () => {
      const configs = {
        field1: { label: 'Field 1', required: true, visible: true, order: 1 },
        field2: { label: 'Field 2', required: true, visible: true, order: 2 },
      };

      const values = {
        field1: null,
        field2: undefined,
      };

      const result = validateRequiredFields(configs, values);

      expect(result.isValid).toBe(false);
      expect(result.missingFields).toEqual(['field1', 'field2']);
    });
  });
});
