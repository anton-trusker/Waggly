import React from 'react';
import { render } from '@testing-library/react-native';
import CalendarMonthView from '@/components/features/calendar/CalendarMonthView';

describe('CalendarMonthView language', () => {
  it('renders localized weekday headers', () => {
    const { getByText } = render(
      <CalendarMonthView
        year={2025}
        month={0}
        selected={undefined}
        onSelect={() => {}}
        markers={{}}
        locale="fr"
      />
    );
    // Expect a French short weekday exists (e.g., "lun." for Monday)
    // Since Sunday-first header, check a few possibilities
    const possible = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
    const found = possible.some((label) => {
      try { return !!getByText(label); } catch { return false; }
    });
    expect(found).toBe(true);
  });
});

