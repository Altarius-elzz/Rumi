import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CalendarGrid from '../../src/components/CalendarGrid';
import NewTaskSheet from '../../src/components/NewTaskSheet';
import SmartInputBar from '../../src/components/SmartInputBar';
import SmartPreviewSheet from '../../src/components/SmartPreviewSheet';
import TaskCard from '../../src/components/TaskCard';
import { FloatingPlusButton } from '../../src/components/ui';
import { useStore } from '../../src/store';
import { MONTH_NAMES } from '../../src/i18n';
import { cardShadow, radius, spacing } from '../../src/theme';
import { ParsedInput, Task } from '../../src/types';
import { formatLongDate, formatShortDate, todayISO } from '../../src/utils/date';

type CardMode = 'calendar' | 'list';
type SheetKind = 'none' | 'preview' | 'manual';

export default function HomeScreen() {
  const { colors, isDark, settings, tasks, getCategory, catLabel, toggleTask, deleteTask, tr, addTask } =
    useStore();
  const lang = settings.language;

  const [cardMode, setCardMode] = useState<CardMode>('calendar');
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [sheet, setSheet] = useState<SheetKind>('none');
  const [parsed, setParsed] = useState<ParsedInput | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const now = new Date();
  const calYear = now.getFullYear();
  const calMonth = now.getMonth();

  const dayTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.date === selectedDate)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [tasks, selectedDate],
  );
  const doneCount = dayTasks.filter((t) => t.done).length;

  const openManual = (initial?: ParsedInput | null, task?: Task | null) => {
    setParsed(initial ?? null);
    setEditingTask(task ?? null);
    setSheet('manual');
  };

  const handleParsed = (p: ParsedInput) => {
    setParsed(p);
    setSheet('preview');
  };

  const doSave = (p: ParsedInput) => {
    addTask({
      title: p.title || tr('untitledTask'),
      date: p.date || selectedDate,
      time: p.time || '09:00',
      category: p.category || 'personal',
      reminders: ['at_time'],
    });
    if (p.date) setSelectedDate(p.date);
  };

  const confirmDelete = (task: Task) => {
    Alert.alert(task.title, tr('deleteTask'), [
      { text: tr('cancel'), style: 'cancel' },
      { text: tr('delete'), style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);
  };

  const renderTaskCard = (task: Task) => (
    <TaskCard
      key={task.id}
      task={task}
      category={getCategory(task.category)}
      categoryLabel={catLabel(task.category)}
      colors={colors}
      isDark={isDark}
      overdueLabel={tr('overdue')}
      onToggle={() => toggleTask(task.id)}
      onPress={() => openManual(null, task)}
      onLongPress={() => confirmDelete(task)}
    />
  );

  const toggleBtn = (mode: CardMode, emoji: string) => {
    const active = cardMode === mode;
    return (
      <Pressable
        onPress={() => setCardMode(mode)}
        style={[styles.toggleBtn, active && { backgroundColor: colors.primary }]}
      >
        <Text style={{ fontSize: 15, opacity: active ? 1 : 0.5 }}>{emoji}</Text>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SmartInputBar onParsed={handleParsed} />

        {/* Date header + toggle */}
        <View style={styles.dateRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.eyebrow, { color: colors.textFaint }]}>
              {MONTH_NAMES[lang][calMonth]} {calYear}
            </Text>
            <Text style={[styles.dateLong, { color: colors.text }]} numberOfLines={1}>
              {formatLongDate(selectedDate, lang)}
            </Text>
          </View>
          <View style={[styles.toggleWrap, { backgroundColor: colors.chipBg }]}>
            {toggleBtn('calendar', '📅')}
            {toggleBtn('list', '📋')}
          </View>
        </View>

        {/* Main card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(settings.theme)]}>
          {cardMode === 'calendar' ? (
            <CalendarGrid
              year={calYear}
              month={calMonth}
              selectedDate={selectedDate}
              tasks={tasks}
              getCategory={getCategory}
              colors={colors}
              isDark={isDark}
              lang={lang}
              onSelect={setSelectedDate}
            />
          ) : (
            <View style={{ gap: spacing.md }}>
              {dayTasks.length === 0 ? (
                <View style={styles.emptyMini}>
                  <Text style={{ fontSize: 32 }}>🌿</Text>
                  <Text style={[styles.emptyMiniText, { color: colors.textMuted }]}>
                    {tr('nothingScheduled')}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textFaint }}>{tr('dayAllYours')}</Text>
                </View>
              ) : (
                dayTasks.map(renderTaskCard)
              )}
            </View>
          )}
        </View>

        {/* Page dots */}
        <View style={styles.dots}>
          <View style={[styles.dotActive, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.borderSoft }]} />
        </View>

        {/* Tasks below calendar (calendar mode only) */}
        {cardMode === 'calendar' && (
          <View style={{ marginTop: spacing.lg }}>
            <View style={styles.listHeader}>
              <View style={styles.listHeaderLeft}>
                <Text style={[styles.listTitle, { color: colors.text }]}>
                  {formatShortDate(selectedDate, lang)}
                </Text>
                {dayTasks.length > 0 && (
                  <View style={[styles.countPill, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>
                      {dayTasks.length}
                    </Text>
                  </View>
                )}
              </View>
              {doneCount > 0 && (
                <Text style={{ color: colors.textFaint, fontSize: 12 }}>
                  {doneCount}/{dayTasks.length} {tr('done')}
                </Text>
              )}
            </View>

            {dayTasks.length === 0 ? (
              <View style={[styles.emptyDashed, { borderColor: colors.borderSoft }]}>
                <Text style={{ fontSize: 24 }}>🌿</Text>
                <Text style={{ color: colors.textFaint, fontSize: 14, fontWeight: '500', marginTop: 4 }}>
                  {tr('noTasksThisDay')}
                </Text>
              </View>
            ) : (
              <View style={{ gap: spacing.sm + 2 }}>{dayTasks.map(renderTaskCard)}</View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.fabWrap}>
        <FloatingPlusButton color={colors.primary} onPress={() => openManual()} />
      </View>

      <SmartPreviewSheet
        visible={sheet === 'preview'}
        parsed={parsed}
        onSave={() => {
          if (parsed) doSave(parsed);
          setSheet('none');
        }}
        onEdit={() => setSheet('manual')}
        onClose={() => setSheet('none')}
      />
      <NewTaskSheet
        visible={sheet === 'manual'}
        initial={parsed}
        editingId={editingTask?.id ?? null}
        onClose={() => {
          setSheet('none');
          setParsed(null);
          setEditingTask(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: 110 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.md },
  eyebrow: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  dateLong: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  toggleWrap: { flexDirection: 'row', borderRadius: radius.md, padding: 2 },
  toggleBtn: { width: 36, height: 36, borderRadius: radius.sm + 2, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: radius.xxl, borderWidth: 1, padding: spacing.xl },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.md },
  dotActive: { width: 20, height: 6, borderRadius: 3 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  listHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  listTitle: { fontSize: 15, fontWeight: '800' },
  countPill: { paddingHorizontal: spacing.sm, paddingVertical: 1, borderRadius: radius.pill },
  emptyMini: { alignItems: 'center', paddingVertical: spacing.xxl, gap: 2 },
  emptyMiniText: { fontSize: 14, fontWeight: '600' },
  emptyDashed: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  fabWrap: { position: 'absolute', right: spacing.xl, bottom: spacing.xl },
});
