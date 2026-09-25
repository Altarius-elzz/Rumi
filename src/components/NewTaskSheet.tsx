import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useStore } from '../store';
import { radius, spacing } from '../theme';
import { ParsedInput, ReminderOffset, Task } from '../types';
import { REMINDER_OPTIONS, reminderChipLabel, t } from '../i18n';
import { combineDateTime, formatChipDate, todayISO } from '../utils/date';
import { BottomSheet, DragHandle } from './ui';
import CategoryChip from './CategoryChip';

type SavePayload = Omit<Task, 'id' | 'createdAt' | 'done' | 'notificationIds'>;

export default function NewTaskSheet({
  visible,
  initial,
  editingId,
  onClose,
}: {
  visible: boolean;
  initial?: Partial<ParsedInput> | null;
  editingId?: string | null;
  onClose: () => void;
}) {
  const { colors, isDark, settings, categories, catLabel, addTask, updateTask } = useStore();
  const lang = settings.language;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState('09:00');
  const [category, setCategory] = useState('personal');
  const [reminders, setReminders] = useState<ReminderOffset[]>(['at_time']);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [seeded, setSeeded] = useState(false);

  // Seed the form when it becomes visible
  React.useEffect(() => {
    if (visible && !seeded) {
      setTitle(initial?.title ?? '');
      setDate(initial?.date || todayISO());
      setTime(initial?.time || '09:00');
      setCategory(initial?.category || 'personal');
      setReminders(['at_time']);
      setSeeded(true);
    }
    if (!visible && seeded) setSeeded(false);
  }, [visible, seeded, initial]);

  const toggleReminder = (r: ReminderOffset) => {
    setReminders((prev) => {
      if (r === 'none') return ['none'];
      const without = prev.filter((x) => x !== 'none');
      return without.includes(r) ? without.filter((x) => x !== r) : [...without, r];
    });
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const payload: SavePayload = {
      title: title.trim(),
      date,
      time,
      category,
      reminders: reminders.length ? reminders : ['none'],
    };
    if (editingId) updateTask(editingId, payload);
    else addTask(payload);
    onClose();
  };

  const label = (k: string) => t(lang, k);

  const fieldStyle = [
    styles.field,
    {
      backgroundColor: isDark ? colors.surfaceAlt : colors.surfaceAlt,
      borderColor: colors.border,
      color: colors.text,
    },
  ];

  return (
    <BottomSheet visible={visible} onClose={onClose} colors={colors}>
      <DragHandle colors={colors} />
      <View style={styles.header}>
        <Text style={[styles.heading, { color: colors.text }]}>{label('newTask')}</Text>
        <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.chipBg }]}>
          <Text style={[styles.closeX, { color: colors.textMuted }]}>✕</Text>
        </Pressable>
      </View>

      <ScrollView
        style={{ maxHeight: 520 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.label, { color: colors.textFaint }]}>{label('taskTitle')}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={label('taskTitlePlaceholder')}
          placeholderTextColor={colors.textFaint}
          style={fieldStyle}
        />

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={[styles.label, { color: colors.textFaint }]}>{label('date')}</Text>
            <Pressable style={fieldStyle} onPress={() => setShowDate(true)}>
              <Text style={{ color: colors.text }}>📅 {formatChipDate(date, lang)}</Text>
            </Pressable>
          </View>
          <View style={styles.flex1}>
            <Text style={[styles.label, { color: colors.textFaint }]}>{label('time')}</Text>
            <Pressable style={fieldStyle} onPress={() => setShowTime(true)}>
              <Text style={{ color: colors.text }}>🕐 {time}</Text>
            </Pressable>
          </View>
        </View>

        <Text style={[styles.label, { color: colors.textFaint }]}>{label('category')}</Text>
        <View style={styles.chipWrap}>
          {categories.map((c) => (
            <CategoryChip
              key={c.id}
              cat={c}
              label={catLabel(c.id)}
              size="md"
              selected={category === c.id}
              onPress={() => setCategory(c.id)}
            />
          ))}
        </View>

        <Text style={[styles.label, { color: colors.textFaint }]}>{label('reminder')}</Text>
        <View style={styles.chipWrap}>
          {REMINDER_OPTIONS.map((r) => {
            const active = reminders.includes(r);
            return (
              <Pressable
                key={r}
                onPress={() => toggleReminder(r)}
                style={[
                  styles.remChip,
                  {
                    backgroundColor: active ? colors.primary : colors.surfaceAlt,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: active ? '#fff' : colors.textMuted }}>
                  {reminderChipLabel(lang, r)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={handleSave}
          style={[
            styles.saveBtn,
            { backgroundColor: title.trim() ? colors.primary : colors.primary + '80' },
          ]}
        >
          <Text style={styles.saveText}>{label('addToCalendar')}</Text>
        </Pressable>
      </ScrollView>

      {showDate && (
        <DateTimePicker
          value={combineDateTime(date, time)}
          mode="date"
          onChange={(e, sel) => {
            setShowDate(Platform.OS === 'ios');
            if (e.type === 'set' && sel) {
              const y = sel.getFullYear();
              const m = String(sel.getMonth() + 1).padStart(2, '0');
              const d = String(sel.getDate()).padStart(2, '0');
              setDate(`${y}-${m}-${d}`);
            }
          }}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={combineDateTime(date, time)}
          mode="time"
          is24Hour
          onChange={(e, sel) => {
            setShowTime(Platform.OS === 'ios');
            if (e.type === 'set' && sel) {
              const hh = String(sel.getHours()).padStart(2, '0');
              const mm = String(sel.getMinutes()).padStart(2, '0');
              setTime(`${hh}:${mm}`);
            }
          }}
        />
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
  },
  heading: { fontSize: 18, fontWeight: '800' },
  closeBtn: { width: 32, height: 32, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  closeX: { fontSize: 14, fontWeight: '700' },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: spacing.lg, marginBottom: spacing.sm },
  field: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: 14,
  },
  row: { flexDirection: 'row', gap: spacing.md },
  flex1: { flex: 1 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  remChip: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1 },
  saveBtn: { marginTop: spacing.xl, paddingVertical: 16, borderRadius: radius.lg, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
