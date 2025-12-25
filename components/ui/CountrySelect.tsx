import React from 'react';
import { COUNTRIES } from '@/constants/countries';
import SearchableSelect from './SearchableSelect';

type Props = {
  value?: string;
  onChange: (code: string) => void;
  label?: string;
};

export default function CountrySelect({ value, onChange, label = 'Country' }: Props) {
  const items = COUNTRIES.map(c => ({
    value: c.code,
    label: c.name,
    icon: c.flag
  }));

  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      items={items}
      label={label}
      placeholder="Select country"
      searchPlaceholder="Search country..."
    />
  );
}
