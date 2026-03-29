'use client';

import Select, { type SingleValue, type StylesConfig } from 'react-select';
import type { CountryOption } from '@/lib/countries';
import { COUNTRY_OPTIONS } from '@/lib/countries';

const selectStyles: StylesConfig<CountryOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 38,
    borderRadius: 8,
    borderColor: state.isFocused ? '#10b981' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(16, 185, 129, 0.25)' : 'none',
    '&:hover': { borderColor: state.isFocused ? '#10b981' : '#9ca3af' },
    fontSize: '0.875rem',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (base) => ({ ...base, zIndex: 9999 }),
  option: (base, state) => ({
    ...base,
    fontSize: '0.875rem',
    backgroundColor: state.isSelected ? '#059669' : state.isFocused ? '#ecfdf5' : undefined,
    color: state.isSelected ? 'white' : '#111827',
  }),
  placeholder: (base) => ({ ...base, color: '#6b7280' }),
  singleValue: (base) => ({ ...base, color: '#111827' }),
};

interface CountrySelectProps {
  id?: string;
  value: string;
  onChange: (countryName: string) => void;
  placeholder?: string;
  inputId?: string;
  'aria-labelledby'?: string;
}

export default function CountrySelect({
  id,
  value,
  onChange,
  placeholder = 'Search or select country…',
  inputId,
  'aria-labelledby': ariaLabelledBy,
}: CountrySelectProps) {
  const selected = value ? COUNTRY_OPTIONS.find((o) => o.value === value) ?? null : null;

  const handleChange = (opt: SingleValue<CountryOption>) => {
    onChange(opt?.value ?? '');
  };

  return (
    <div id={id}>
      <Select<CountryOption, false>
        inputId={inputId}
        instanceId={inputId ?? 'country-select'}
        aria-labelledby={ariaLabelledBy}
        options={COUNTRY_OPTIONS}
        value={selected}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable
        isSearchable
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        menuPosition="fixed"
        styles={selectStyles}
        classNames={{
          control: () => '!text-sm',
        }}
        noOptionsMessage={() => 'No country found'}
      />
    </div>
  );
}
