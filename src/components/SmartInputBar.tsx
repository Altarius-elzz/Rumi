import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useStore } from '../store';
import { radius, spacing } from '../theme';
import { ParsedInput } from '../types';
import { parseSmartInput } from '../utils/smartParse';
import { t } from '../i18n';

export default function SmartInputBar({ onParsed }: { onParsed: (p: ParsedInput) => void }) {
  const { colors, isDark, settings } = useStore();
  const [value, setValue] = useState('');

  const submit = () => {
    const parsed = parseSmartInput(value);
    if (parsed) {
      onParsed(parsed);
      setValue('');
    }
  };

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.surface, borderColor: colors.border },
        !isDark && styles.lightShadow,
      ]}
    >
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        onSubmitEditing={submit}
        returnKeyType="done"
        placeholder={t(settings.language, 'smartPlaceholder')}
        placeholderTextColor={colors.textFaint}
        style={[styles.input, { color: colors.text }]}
      />
      {value.trim().length > 0 && (
        <Pressable onPress={submit} style={[styles.send, { backgroundColor: colors.primary }]}>
          <Text style={styles.sendIcon}>→</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  lightShadow: {
    shadowColor: '#1E2233',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  icon: { fontSize: 15 },
  input: { flex: 1, fontSize: 14, padding: 0 },
  send: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { color: '#fff', fontSize: 15, fontWeight: '700', marginTop: -1 },
});
