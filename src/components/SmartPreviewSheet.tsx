import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useStore } from '../store';
import { radius, spacing } from '../theme';
import { ParsedInput } from '../types';
import { t } from '../i18n';
import { formatChipDate } from '../utils/date';
import { BottomSheet, DragHandle } from './ui';

export default function SmartPreviewSheet({
  visible,
  parsed,
  onSave,
  onEdit,
  onClose,
}: {
  visible: boolean;
  parsed: ParsedInput | null;
  onSave: () => void;
  onEdit: () => void;
  onClose: () => void;
}) {
  const { colors, isDark, settings, getCategory, catLabel } = useStore();
  const lang = settings.language;
  const label = (k: string) => t(lang, k);

  if (!parsed) return null;
  const cat = getCategory(parsed.category);

  const metaChip = (text: string) => (
    <View
      style={[
        styles.metaChip,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>{text}</Text>
    </View>
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} colors={colors}>
      <DragHandle colors={colors} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={[styles.accent, { backgroundColor: colors.primary }]} />
          <Text style={[styles.eyebrow, { color: colors.textMuted }]}>
            {label('smartParseResult')}
          </Text>
        </View>

        <View
          style={[
            styles.resultCard,
            {
              backgroundColor: isDark ? colors.primarySoft : '#F5F2FF',
              borderColor: isDark ? colors.primary + '40' : '#E5DEFF',
            },
          ]}
        >
          <Text style={[styles.taskTitle, { color: colors.text }]}>
            {parsed.title || label('untitledTask')}
          </Text>
          <View style={styles.metaWrap}>
            {!!parsed.date && metaChip(`📅 ${formatChipDate(parsed.date, lang)}`)}
            {!!parsed.time && metaChip(`🕐 ${parsed.time}`)}
            <View
              style={[
                styles.metaChip,
                { backgroundColor: cat.color + '20', borderColor: cat.color + '40' },
              ]}
            >
              <Text style={{ color: cat.color, fontSize: 13, fontWeight: '600' }}>
                🏷️ {catLabel(cat.id)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={onEdit}
            style={[styles.btn, styles.editBtn, { borderColor: colors.primary }]}
          >
            <Text style={[styles.editText, { color: colors.primary }]}>{label('edit')}</Text>
          </Pressable>
          <Pressable onPress={onSave} style={[styles.btn, { backgroundColor: colors.primary }]}>
            <Text style={styles.saveText}>{label('saveToCalendar')}</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  accent: { width: 6, height: 24, borderRadius: radius.pill },
  eyebrow: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  resultCard: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg },
  taskTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.lg },
  metaWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  btn: { flex: 1, paddingVertical: 14, borderRadius: radius.lg, alignItems: 'center' },
  editBtn: { borderWidth: 2 },
  editText: { fontWeight: '700', fontSize: 14 },
  saveText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
