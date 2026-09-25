import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useStore } from '../store';
import { spacing } from '../theme';
import { formatShortDate } from '../utils/date';
import { todayISO } from '../utils/date';

export default function AppHeader() {
  const { colors, settings } = useStore();
  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <View>
        <Text style={[styles.title, { color: colors.text }]}>
          Todo<Text style={{ color: colors.primary }}>ku</Text>
        </Text>
        <Text style={[styles.date, { color: colors.textFaint }]}>
          {formatShortDate(todayISO(), settings.language)}
        </Text>
      </View>
      <View style={[styles.avatar, { borderColor: colors.primary }]}>
        <View style={[styles.avatarInner, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>A</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  date: { fontSize: 12, marginTop: 2 },
  avatar: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, padding: 1 },
  avatarInner: { flex: 1, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
