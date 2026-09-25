import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Category } from '../types';
import { radius, spacing } from '../theme';

export default function CategoryChip({
  cat,
  label,
  size = 'sm',
  selected,
  onPress,
}: {
  cat: Category;
  label: string;
  size?: 'sm' | 'md';
  selected?: boolean;
  onPress?: () => void;
}) {
  const padH = size === 'md' ? spacing.md : spacing.sm + 2;
  const padV = size === 'md' ? 6 : 4;
  const fontSize = size === 'md' ? 13 : 12;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          paddingHorizontal: padH,
          paddingVertical: padV,
          backgroundColor: selected ? cat.color : cat.color + '20',
          borderColor: selected ? cat.color : cat.color + '40',
        },
      ]}
    >
      <Text style={[styles.text, { fontSize, color: selected ? '#fff' : cat.color }]}>
        {cat.emoji} {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: { fontWeight: '600' },
});
