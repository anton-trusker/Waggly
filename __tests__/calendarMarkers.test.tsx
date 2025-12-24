import React from 'react';
import { render } from '@testing-library/react-native';
import CalendarMonthView from '@/components/features/calendar/CalendarMonthView';

describe('CalendarMonthView markers', () => {
  it('shows dots for dates with events', () => {
    // Use a month where the 15th exists and mark it
    const markers: Record<string, string[]> = { '2025-01-15': ['#FF0000', '#00FF00'] };
    const { getAllByTestId } = render(
      <CalendarMonthView
        year={2025}
        month={0}
        selected={undefined}
        onSelect={() => {}}
        markers={markers}
        locale="en-US"
      />
    );
    // There should be dot views with the given colors rendered
    const dots = getAllByTestId('calendar-dot');
    const redDots = dots.filter((d) => Array.isArray(d.props.style) && d.props.style.some((s: any) => s && s.backgroundColor === '#FF0000'));
    const greenDots = dots.filter((d) => Array.isArray(d.props.style) && d.props.style.some((s: any) => s && s.backgroundColor === '#00FF00'));
    expect(redDots.length).toBeGreaterThan(0);
    expect(greenDots.length).toBeGreaterThan(0);
  });
});
