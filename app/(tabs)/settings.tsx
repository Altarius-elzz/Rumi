import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Toggle } from '../../src/components/ui';
import { useStore } from '../../src/store';
import { categoryPalette, radius, spacing } from '../../src/theme';
import { Language } from '../../src/types';

const EMOJI_CHOICES = ['📌', '🍳', '📚', '💼', '🛒', '💊', '🏃', '🎯', '🎨', '🎵', '✈️', '🐶'];

export default function SettingsScreen() {
  const {
    colors,
    isDark,
    settings,
    categories,
    catLabel,
    addCategory,
    deleteCategory,
    setLanguage,
    toggleTheme,
    setNotificationsEnabled,
    tr,
  } = useStore();

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState(EMOJI_CHOICES[0]);
  const [newColor, setNewColor] = useState(categoryPalette[0]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory({ label: newName.trim(), emoji: newEmoji, color: newColor });
    setNewName('');
    setNewEmoji(EMOJI_CHOICES[0]);
    setNewColor(categoryPalette[0]);
    setAdding(false);
  };

  const confirmDeleteCat = (id: string, label: string) => {
    Alert.alert(label, tr('deleteCategory'), [
      { text: tr('cancel'), style: 'cancel' },
      { text: tr('delete'), style: 'destructive', onPress: () => deleteCategory(id) },
    ]);
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'id', label: 'Indonesia' },
  ];

  const cardStyle = [styles.card, { backgroundColor: colors.surface, borderColor: colors.border }];
  const sectionTitle = (txt: string) => (
    <Text style={[styles.sectionTitle, { color: colors.textFaint }]}>{txt}</Text>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={[styles.title, { color: colors.text }]}>{tr('settings')}</Text>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        {sectionTitle(tr('categories'))}
        <View style={cardStyle}>
          {categories.map((c, i) => (
            <View
              key={c.id}
              style={[styles.row, { borderBottomColor: colors.border }, i === categories.length - 1 && !adding && styles.noBorder]}
            >
              <View style={[styles.catIcon, { backgroundColor: c.color + '20' }]}>
                <Text style={{ fontSize: 16 }}>{c.emoji}</Text>
              </View>
              <Text style={[styles.rowLabel, { color: colors.text }]}>{catLabel(c.id)}</Text>
              <View style={[styles.colorDot, { backgroundColor: c.color }]} />
              {!c.isDefault && (
                <Pressable hitSlop={8} onPress={() => confirmDeleteCat(c.id, catLabel(c.id))}>
                  <Text style={[styles.deleteX, { color: colors.danger }]}>✕</Text>
                </Pressable>
              )}
            </View>
          ))}

          {adding ? (
            <View style={styles.addForm}>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder={tr('categoryName')}
                placeholderTextColor={colors.textFaint}
                style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
              />
              <Text style={[styles.miniLabel, { color: colors.textFaint }]}>{tr('emoji')}</Text>
              <View style={styles.chipWrap}>
                {EMOJI_CHOICES.map((e) => (
                  <Pressable
                    key={e}
                    onPress={() => setNewEmoji(e)}
                    style={[
                      styles.emojiChip,
                      { borderColor: newEmoji === e ? colors.primary : colors.border, backgroundColor: newEmoji === e ? colors.primarySoft : colors.surfaceAlt },
                    ]}
                  >
                    <Text style={{ fontSize: 18 }}>{e}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={[styles.miniLabel, { color: colors.textFaint }]}>{tr('color')}</Text>
              <View style={styles.chipWrap}>
                {categoryPalette.map((col) => (
                  <Pressable
                    key={col}
                    onPress={() => setNewColor(col)}
                    style={[styles.colorPick, { backgroundColor: col, borderColor: newColor === col ? colors.text : 'transparent' }]}
                  />
                ))}
              </View>
              <View style={styles.addActions}>
                <Pressable onPress={() => setAdding(false)} style={[styles.addBtn, { backgroundColor: colors.chipBg }]}>
                  <Text style={{ color: colors.textMuted, fontWeight: '700' }}>{tr('cancel')}</Text>
                </Pressable>
                <Pressable onPress={handleAdd} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>{tr('addCategory')}</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable style={styles.addRow} onPress={() => setAdding(true)}>
              <View style={[styles.addIcon, { borderColor: colors.primary }]}>
                <Text style={{ color: colors.primary, fontSize: 16 }}>+</Text>
              </View>
              <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 14 }}>{tr('addCategory')}</Text>
            </Pressable>
          )}
        </View>

        {/* Preferences */}
        {sectionTitle(tr('preferences'))}
        <View style={cardStyle}>
          {/* Language */}
          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <View style={[styles.catIcon, { backgroundColor: colors.primary + '20' }]}>
              <Text style={{ fontSize: 16 }}>🌐</Text>
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{tr('language')}</Text>
            <View style={[styles.segment, { backgroundColor: colors.chipBg }]}>
              {languages.map((l) => {
                const active = settings.language === l.code;
                return (
                  <Pressable
                    key={l.code}
                    onPress={() => setLanguage(l.code)}
                    style={[styles.segmentBtn, active && { backgroundColor: colors.primary }]}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: active ? '#fff' : colors.textMuted }}>
                      {l.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Notifications */}
          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <View style={[styles.catIcon, { backgroundColor: colors.primary + '20' }]}>
              <Text style={{ fontSize: 16 }}>🔔</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: colors.text, flex: 0 }]}>{tr('notifications')}</Text>
              <Text style={{ fontSize: 12, color: colors.textFaint }}>{tr('notificationsDesc')}</Text>
            </View>
            <Toggle on={settings.notificationsEnabled} onToggle={() => setNotificationsEnabled(!settings.notificationsEnabled)} colors={colors} />
          </View>

          {/* Dark mode */}
          <View style={[styles.row, styles.noBorder]}>
            <View style={[styles.catIcon, { backgroundColor: colors.primary + '20' }]}>
              <Text style={{ fontSize: 16 }}>{isDark ? '🌙' : '☀️'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: colors.text, flex: 0 }]}>{tr('darkMode')}</Text>
              <Text style={{ fontSize: 12, color: colors.textFaint }}>
                {isDark ? tr('darkActive') : tr('lightActive')}
              </Text>
            </View>
            <Toggle on={isDark} onToggle={toggleTheme} colors={colors} />
          </View>
        </View>

        <Text style={[styles.footer, { color: colors.textFaint }]}>Todoku v2.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '800', paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 110 },
  sectionTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: spacing.lg, marginBottom: spacing.md },
  card: { borderRadius: radius.xl, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 14, borderBottomWidth: 1, gap: spacing.md },
  noBorder: { borderBottomWidth: 0 },
  catIcon: { width: 32, height: 32, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  deleteX: { fontSize: 15, fontWeight: '800', marginLeft: spacing.sm },
  addRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 14, gap: spacing.md },
  addIcon: { width: 32, height: 32, borderRadius: radius.md, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  addForm: { padding: spacing.lg, gap: spacing.sm },
  input: { borderRadius: radius.md, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: 10, fontSize: 14 },
  miniLabel: { fontSize: 11, fontWeight: '700', marginTop: spacing.sm },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  emojiChip: { width: 40, height: 40, borderRadius: radius.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  colorPick: { width: 32, height: 32, borderRadius: radius.pill, borderWidth: 3 },
  addActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  addBtn: { flex: 1, paddingVertical: 12, borderRadius: radius.md, alignItems: 'center' },
  segment: { flexDirection: 'row', borderRadius: radius.md, padding: 2 },
  segmentBtn: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.sm + 2 },
  footer: { textAlign: 'center', fontSize: 12, marginTop: spacing.xl },
});
