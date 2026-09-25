import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Category, Language, Task } from '../types';
import { radius, spacing, ThemeColors } from '../theme';
import { DAY_SHORT } from '../i18n';
import { toDateKey, todayISO } from '../utils/date';

export default function CalendarGrid({
  year,
  month,
  selectedDate,
  tasks,
  getCategory,
  colors,
  isDark,
  lang,
  onSelect,
}: {
  year: number;
  month: number;
  selectedDate: string;
  tasks: Task[];
  getCategory: (id: string) => Category;
  colors: ThemeColors;
  isDark: boolean;
  lang: Language;
  onSelect: (dateISO: string) => void;
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = todayISO();

  const dotsByDate = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const t of tasks) {
      const color = getCategory(t.category).color;
      if (!map[t.date]) map[t.date] = [];
      if (!map[t.date].includes(color)) map[t.date].push(color);
    }
    return map;
  }, [tasks, getCategory]);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View>
      <View style={styles.weekRow}>
        {DAY_SHORT[lang].map((d, i) => (
          <View key={i} style={styles.weekCell}>
            <Text style={[styles.weekText, { color: colors.textFaint }]}>{d}</Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, i) => {
          if (!day) return <View key={i} style={styles.cell} />;
          const key = toDateKey(year, month, day);
          const isSelected = key === selectedDate;
          const isToday = key === todayKey;
          const dots = dotsByDate[key] || [];
          return (
            <View key={i} style={styles.cell}>
              <Pressable
                onPress={() => onSelect(key)}
                style={[
                  styles.dayBtn,
                  isSelected && { backgroundColor: colors.primary },
                  !isSelected && isToday && { borderWidth: 2, borderColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: isSelected
                        ? '#fff'
                        : isToday
                        ? colors.primary
                        : colors.text,
                      fontWeight: isSelected || isToday ? '700' : '500',
                    },
                  ]}
                >
                  {day}
                </Text>
              </Pressable>
              <View style={styles.dotsRow}>
                {dots.slice(0, 3).map((c, di) => (
                  <View key={di} style={[styles.dot, { backgroundColor: c }]} />
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const CELL = `${100 / 7}%`;

const styles = StyleSheet.create({
  weekRow: { flexDirection: 'row', marginBottom: spacing.sm },
  weekCell: { width: CELL as any, alignItems: 'center' },
  weekText: { fontSize: 11, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: CELL as any, alignItems: 'center', marginBottom: spacing.xs },
  dayBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: { fontSize: 13 },
  dotsRow: { flexDirection: 'row', gap: 2, height: 8, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
