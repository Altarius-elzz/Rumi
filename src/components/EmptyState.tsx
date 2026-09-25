import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, ThemeColors } from '../theme';

export default function EmptyState({
  colors,
  isDark,
  title,
  desc,
  actionLabel,
  onAction,
}: {
  colors: ThemeColors;
  isDark: boolean;
  title: string;
  desc?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.circle, { backgroundColor: colors.primarySoft }]}>
        <Text style={styles.emoji}>🗓️</Text>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {!!desc && <Text style={[styles.desc, { color: colors.textFaint }]}>{desc}</Text>}
      {!!actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [
            styles.btn,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.btnText}>+ {actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, paddingVertical: 48 },
  circle: { width: 112, height: 112, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  emoji: { fontSize: 56 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: spacing.sm, textAlign: 'center' },
  desc: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: spacing.xl },
  btn: { paddingHorizontal: spacing.xl, paddingVertical: 14, borderRadius: radius.lg },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
