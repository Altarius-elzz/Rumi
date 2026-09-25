import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import EmptyState from '../../src/components/EmptyState';
import NewTaskSheet from '../../src/components/NewTaskSheet';
import TaskCard from '../../src/components/TaskCard';
import { FloatingPlusButton } from '../../src/components/ui';
import { useStore } from '../../src/store';
import { spacing } from '../../src/theme';
import { Task } from '../../src/types';

export default function TasksScreen() {
  const { colors, isDark, tasks, getCategory, catLabel, toggleTask, deleteTask, tr } = useStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const sorted = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        if (a.date !== b.date) return a.date < b.date ? -1 : 1;
        return a.time.localeCompare(b.time);
      }),
    [tasks],
  );

  const confirmDelete = (task: Task) => {
    Alert.alert(task.title, tr('deleteTask'), [
      { text: tr('cancel'), style: 'cancel' },
      { text: tr('delete'), style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={[styles.title, { color: colors.text }]}>{tr('myTasks')}</Text>

      {sorted.length === 0 ? (
        <EmptyState
          colors={colors}
          isDark={isDark}
          title={tr('noTasksTitle')}
          desc={tr('noTasksDesc')}
          actionLabel={tr('addFirstTask')}
          onAction={() => {
            setEditing(null);
            setSheetOpen(true);
          }}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {sorted.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              category={getCategory(task.category)}
              categoryLabel={catLabel(task.category)}
              colors={colors}
              isDark={isDark}
              overdueLabel={tr('overdue')}
              onToggle={() => toggleTask(task.id)}
              onPress={() => {
                setEditing(task);
                setSheetOpen(true);
              }}
              onLongPress={() => confirmDelete(task)}
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.fabWrap}>
        <FloatingPlusButton
          color={colors.primary}
          onPress={() => {
            setEditing(null);
            setSheetOpen(true);
          }}
        />
      </View>

      <NewTaskSheet
        visible={sheetOpen}
        initial={editing ? { title: editing.title, date: editing.date, time: editing.time, category: editing.category } : null}
        editingId={editing?.id ?? null}
        onClose={() => {
          setSheetOpen(false);
          setEditing(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '800', paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 110, gap: spacing.sm + 2 },
  fabWrap: { position: 'absolute', right: spacing.xl, bottom: spacing.xl },
});
