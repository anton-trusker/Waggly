import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ViewStyle, TextStyle } from 'react-native';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';

type Props = {
  year: number;
  month: number; // 0-11
  selected?: string; // yyyy-mm-dd
  onSelect: (isoDate: string) => void;
  markers?: Record<string, string[]>;
  locale?: string;
  onDayPress?: (isoDate: string) => void;
  eventsByDay?: Record<string, { title: string; color: string; petName?: string; type?: string }[]>;
};

function getMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0 Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(new Date(year, month, d));
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

export default function CalendarMonthView({ year, month, selected, onSelect, markers = {}, locale = 'en-US', onDayPress, eventsByDay = {} }: Props) {
  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);
  const weeks = useMemo(() => {
    const arr: (Date | null)[][] = [];
    for (let i = 0; i < grid.length; i += 7) arr.push(grid.slice(i, i + 7));
    return arr;
  }, [grid]);
  const todayISO = new Date().toISOString().slice(0, 10);
  const header = useMemo(() => {
    const base = new Date(2020, 10, 1); // arbitrary Sunday
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      return d.toLocaleDateString(locale, { weekday: 'short' });
    });
  }, [locale]);
  const [hoveredIso, setHoveredIso] = useState<string | null>(null);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const safeSetHover = useCallback((iso: string | null) => {
    if (mountedRef.current) setHoveredIso(iso);
  }, []);

  return (
    <View style={styles.container as ViewStyle}>
      <View style={styles.headerRow as ViewStyle}>
        {header.map((h) => (
          <Text key={h} style={styles.headerCell as TextStyle}>{h}</Text>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow as ViewStyle}>
          {week.map((date, di) => {
            if (!date) return <View key={di} style={styles.cell as ViewStyle} />;
            const iso = date.toISOString().slice(0, 10);
            const isToday = iso === todayISO;
            const isSelected = selected === iso;
            const dots = markers[iso] || [];
            const dotsToShow = dots.slice(0, 3);
            const eventsForDay = eventsByDay[iso] || [];
            return (
              <TouchableOpacity
                key={di}
                style={[styles.cell, isSelected && styles.cellSelected, isToday && styles.cellToday] as ViewStyle}
                onPress={() => {
                  onSelect(iso);
                  onDayPress?.(iso);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Select ${iso}. ${dots.length > 0 ? 'Has events' : 'No events'}`}
                {...(Platform.OS === 'web'
                  ? {
                    onMouseEnter: () => safeSetHover(iso),
                    onMouseLeave: () => safeSetHover(null),
                  }
                  : {})}
              >
                <Text style={[styles.cellText, isSelected && styles.cellTextSelected] as TextStyle}>{date.getDate()}</Text>
                {dotsToShow.length > 0 && (
                  <View style={styles.dotsRow}>
                    {dotsToShow.map((c, idx) => (
                      <View key={idx} testID="calendar-dot" style={[styles.dot, { backgroundColor: c }]} />
                    ))}
                  </View>
                )}
                {Platform.OS === 'web' && hoveredIso === iso && eventsForDay.length > 0 && (
                  <View style={styles.tooltip}>
                    {eventsForDay.slice(0, 4).map((ev, idx) => (
                      <View key={idx} style={styles.tooltipRow}>
                        <View style={[styles.dot, { backgroundColor: ev.color, marginRight: 6 }]} />
                        <Text style={styles.tooltipText}>
                          {ev.title}{ev.petName ? ` • ${ev.petName}` : ''}
                        </Text>
                      </View>
                    ))}
                    {eventsForDay.length > 4 && (
                      <Text style={styles.tooltipMore}>+{eventsForDay.length - 4} more</Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: designSystem.colors.background.secondary, borderRadius: designSystem.borderRadius.lg, padding: getSpacing(2), marginBottom: getSpacing(3), borderWidth: 1, borderColor: designSystem.colors.border.primary },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  headerCell: { width: 40, textAlign: 'center', color: getColor('text.secondary'), ...designSystem.typography.label.small },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: getSpacing(1) },
  cell: { width: 40, height: 40, borderRadius: designSystem.borderRadius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: designSystem.colors.background.primary, position: 'relative' },
  cellSelected: { backgroundColor: designSystem.colors.primary[500] },
  cellToday: { borderWidth: 1, borderColor: designSystem.colors.primary[500] },
  cellText: { color: getColor('text.primary'), ...designSystem.typography.body.medium },
  cellTextSelected: { color: designSystem.colors.text.inverse, fontWeight: '700' },
  dotsRow: { flexDirection: 'row', gap: getSpacing(0.5), marginTop: getSpacing(0.5) },
  dot: { width: getSpacing(1), height: getSpacing(1), borderRadius: designSystem.borderRadius.full },
  tooltip: {
    position: 'absolute',
    top: getSpacing(8),
    left: 0,
    right: 0,
    backgroundColor: designSystem.colors.background.secondary,
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
    borderRadius: designSystem.borderRadius.md,
    paddingHorizontal: getSpacing(1.5),
    paddingVertical: getSpacing(1.5),
    zIndex: 10,
    ...designSystem.shadows.md,
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing(0.5),
  },
  tooltipText: {
    ...designSystem.typography.label.extraSmall,
    color: designSystem.colors.text.primary,
    flexShrink: 1,
  },
  tooltipMore: {
    ...designSystem.typography.label.extraSmall,
    color: getColor('text.secondary'),
  },
});
