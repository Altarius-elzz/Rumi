import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Category, Task } from '../types';
import { radius, spacing, ThemeColors } from '../theme';
import { isPast } from '../utils/date';

export default function TaskCard({
  task,
  category,
  categoryLabel,
  colors,
  isDark,
  overdueLabel,
  onToggle,
  onPress,
  onLongPress,
}: {
  task: Task;
  category: Category;
  categoryLabel: string;
  colors: ThemeColors;
  isDark: boolean;
  overdueLabel: string;
  onToggle: () => void;
  onPress: () => void;
  onLongPress?: () => void;
}) {
  const overdue = !task.done && isPast(task.date, task.time);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isDark ? colors.border : colors.border,
        },
        !isDark && styles.lightShadow,
        pressed && { opacity: 0.75 },
      ]}
    >
      <Pressable onPress={onToggle} hitSlop={10}>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: task.done ? colors.primary : isDark ? '#4B5563' : '#D1D5DB',
              backgroundColor: task.done ? colors.primary : 'transparent',
            },
          ]}
        >
          {task.done && <Text style={styles.check}>✓</Text>}
        </View>
      </Pressable>

      <View style={styles.body}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            { color: task.done ? colors.textFaint : colors.text },
            task.done && styles.done,
          ]}
        >
          {task.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.time, { color: colors.textFaint }]}>{task.time}</Text>
          {overdue && (
            <View style={[styles.overdue, { backgroundColor: colors.danger + '22' }]}>
              <Text style={[styles.overdueText, { color: colors.danger }]}>{overdueLabel}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.catChip, { backgroundColor: category.color + '20' }]}>
        <Text style={[styles.catText, { color: category.color }]}>
          {category.emoji} {categoryLabel}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderWidth: 1,
    gap: spacing.md,
  },
  lightShadow: {
    shadowColor: '#1E2233',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { color: '#fff', fontSize: 12, fontWeight: '800' },
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 14, fontWeight: '600' },
  done: { textDecorationLine: 'line-through' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 },
  time: { fontSize: 12 },
  overdue: { paddingHorizontal: spacing.sm, paddingVertical: 1, borderRadius: radius.pill },
  overdueText: { fontSize: 10, fontWeight: '700' },
  catChip: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  catText: { fontSize: 12, fontWeight: '600' },
});
