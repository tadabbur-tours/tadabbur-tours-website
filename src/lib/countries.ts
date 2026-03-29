import countryList from 'country-list';

export interface CountryOption {
  value: string;
  label: string;
}

/** English country names, sorted A–Z — for searchable selects (citizenship, passport issuing country). */
export const COUNTRY_OPTIONS: CountryOption[] = countryList
  .getNames()
  .map((name) => ({ value: name, label: name }))
  .sort((a, b) => a.label.localeCompare(b.label, 'en'));
