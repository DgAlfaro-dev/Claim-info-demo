import { CountryConfigFactory } from '../../core/claimInfo/factory/CountryConfigFactory';
import { SupportedCountry, CountryConfig } from '../../core/claimInfo/types';
import { dynamicFieldsRegistry } from '../../core/claimInfo/registry/dynamicFieldsRegistry';
import { storeExtensionRegistry } from '../../core/claimInfo/registry/storeExtensionRegistry';

describe('CountryConfigFactory', () => {
  beforeEach(() => {
    CountryConfigFactory.clearCache();
  });

  afterEach(() => {
    CountryConfigFactory.clearCache();
  });

  describe('registerCountryExtension', () => {
    it('should register a country loader', () => {
      const mockConfig: CountryConfig = {
        countryCode: SupportedCountry.COSTA_RICA,
        countryName: 'Costa Rica',
      };
      const loader = async () => mockConfig;

      CountryConfigFactory.registerCountryExtension(SupportedCountry.COSTA_RICA, loader);

      expect(CountryConfigFactory.isCountrySupported('CR')).toBe(true);
    });

    it('should allow multiple countries to be registered', () => {
      const crConfig: CountryConfig = {
        countryCode: SupportedCountry.COSTA_RICA,
        countryName: 'Costa Rica',
      };
      const paConfig: CountryConfig = {
        countryCode: SupportedCountry.PANAMA,
        countryName: 'Panama',
      };

      CountryConfigFactory.registerCountryExtension(
        SupportedCountry.COSTA_RICA,
        async () => crConfig
      );
      CountryConfigFactory.registerCountryExtension(
        SupportedCountry.PANAMA,
        async () => paConfig
      );

      expect(CountryConfigFactory.isCountrySupported('CR')).toBe(true);
      expect(CountryConfigFactory.isCountrySupported('PA')).toBe(true);
    });
  });

  describe('loadCountryConfig', () => {
    it('should load country config successfully', async () => {
      const mockConfig: CountryConfig = {
        countryCode: SupportedCountry.COSTA_RICA,
        countryName: 'Costa Rica',
        fieldOverrides: {},
      };
      const loader = jest.fn(async () => mockConfig);

      CountryConfigFactory.registerCountryExtension(SupportedCountry.COSTA_RICA, loader);

      const config = await CountryConfigFactory.loadCountryConfig(SupportedCountry.COSTA_RICA);

      expect(config).toEqual(mockConfig);
      expect(loader).toHaveBeenCalledTimes(1);
    });

    it('should cache loaded configurations', async () => {
      const mockConfig: CountryConfig = {
        countryCode: SupportedCountry.COSTA_RICA,
        countryName: 'Costa Rica',
      };
      const loader = jest.fn(async () => mockConfig);

      CountryConfigFactory.registerCountryExtension(SupportedCountry.COSTA_RICA, loader);

      const config1 = await CountryConfigFactory.loadCountryConfig(SupportedCountry.COSTA_RICA);
      const config2 = await CountryConfigFactory.loadCountryConfig(SupportedCountry.COSTA_RICA);

      expect(config1).toEqual(mockConfig);
      expect(config2).toEqual(mockConfig);
      expect(loader).toHaveBeenCalledTimes(1); // Should only be called once due to cache
    });

    it('should throw error if country is not registered', async () => {
      // Use a country that definitely won't be registered
      await expect(
        CountryConfigFactory.loadCountryConfig('XX' as SupportedCountry)
      ).rejects.toThrow('Country configuration not found for');
    });

    it('should register dynamic fields when loading config', async () => {
      const mockConfig: CountryConfig = {
        countryCode: SupportedCountry.PANAMA,
        countryName: 'Panama',
        dynamicFields: [
          {
            id: 'testField',
            section: 'policy',
            position: 1,
            config: { label: 'Test', required: false, visible: true },
            component: () => null,
          },
        ],
      };

      CountryConfigFactory.registerCountryExtension(
        SupportedCountry.PANAMA,
        async () => mockConfig
      );

      await CountryConfigFactory.loadCountryConfig(SupportedCountry.PANAMA);

      expect(dynamicFieldsRegistry.has('testField')).toBe(true);
    });

    it('should register store extension when loading config', async () => {
      const mockConfig: CountryConfig = {
        countryCode: SupportedCountry.PANAMA,
        countryName: 'Panama',
        storeExtension: {
          initialState: { testField: 'value' },
          actions: {
            updateTestField: (set, get, value: string) => set({ testField: value }),
          },
        },
      };

      CountryConfigFactory.registerCountryExtension(
        SupportedCountry.PANAMA,
        async () => mockConfig
      );

      await CountryConfigFactory.loadCountryConfig(SupportedCountry.PANAMA);

      expect(storeExtensionRegistry.has('PA')).toBe(true);
    });
  });

  describe('clearCache', () => {
    it('should clear all cached configurations', async () => {
      const mockConfig: CountryConfig = {
        countryCode: SupportedCountry.COSTA_RICA,
        countryName: 'Costa Rica',
      };
      const loader = jest.fn(async () => mockConfig);

      CountryConfigFactory.registerCountryExtension(SupportedCountry.COSTA_RICA, loader);

      await CountryConfigFactory.loadCountryConfig(SupportedCountry.COSTA_RICA);
      expect(loader).toHaveBeenCalledTimes(1);

      CountryConfigFactory.clearCache();

      await CountryConfigFactory.loadCountryConfig(SupportedCountry.COSTA_RICA);
      expect(loader).toHaveBeenCalledTimes(2); // Called again after cache clear
    });

    it('should clear dynamic fields registry', async () => {
      const mockConfig: CountryConfig = {
        countryCode: SupportedCountry.PANAMA,
        countryName: 'Panama',
        dynamicFields: [
          {
            id: 'testField',
            section: 'policy',
            position: 1,
            config: { label: 'Test', required: false, visible: true },
            component: () => null,
          },
        ],
      };

      CountryConfigFactory.registerCountryExtension(
        SupportedCountry.PANAMA,
        async () => mockConfig
      );

      await CountryConfigFactory.loadCountryConfig(SupportedCountry.PANAMA);
      expect(dynamicFieldsRegistry.has('testField')).toBe(true);

      CountryConfigFactory.clearCache();
      expect(dynamicFieldsRegistry.has('testField')).toBe(false);
    });
  });

  describe('isCountrySupported', () => {
    it('should return true for valid country codes', () => {
      expect(CountryConfigFactory.isCountrySupported('CR')).toBe(true);
      expect(CountryConfigFactory.isCountrySupported('PA')).toBe(true);
    });

    it('should return false for invalid country codes', () => {
      expect(CountryConfigFactory.isCountrySupported('XX')).toBe(false);
      expect(CountryConfigFactory.isCountrySupported('INVALID')).toBe(false);
    });
  });

  describe('getSupportedCountries', () => {
    it('should return array of supported countries', () => {
      const countries = CountryConfigFactory.getSupportedCountries();

      expect(Array.isArray(countries)).toBe(true);
      expect(countries).toContain(SupportedCountry.COSTA_RICA);
      expect(countries).toContain(SupportedCountry.PANAMA);
    });
  });
});
