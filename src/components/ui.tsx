import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { radius, spacing, ThemeColors } from '../theme';

/** Small drag handle shown at the top of bottom sheets */
export function DragHandle({ colors }: { colors: ThemeColors }) {
  return (
    <View style={styles.handleWrap}>
      <View style={[styles.handle, { backgroundColor: colors.borderSoft }]} />
    </View>
  );
}

/** A bottom sheet with a dimmed backdrop */
export function BottomSheet({
  visible,
  onClose,
  colors,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  colors: ThemeColors;
  children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetRoot}>
        <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>{children}</View>
      </View>
    </Modal>
  );
}

/** Floating "+" action button */
export function FloatingPlusButton({
  onPress,
  color = '#6C5CE7',
}: {
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor: color },
        pressed && { transform: [{ scale: 0.95 }] },
      ]}
    >
      <Text style={styles.fabIcon}>+</Text>
    </Pressable>
  );
}

/** iOS-style toggle switch */
export function Toggle({
  on,
  onToggle,
  colors,
}: {
  on: boolean;
  onToggle: () => void;
  colors: ThemeColors;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.toggle, { backgroundColor: on ? colors.primary : '#9CA3AF' }]}
    >
      <View style={[styles.knob, { transform: [{ translateX: on ? 22 : 0 }] }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  handleWrap: { alignItems: 'center', paddingTop: spacing.md, paddingBottom: spacing.xs },
  handle: { width: 40, height: 5, borderRadius: radius.pill },
  sheetRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    maxHeight: '90%',
    paddingBottom: spacing.xxl,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  fabIcon: { color: '#fff', fontSize: 30, fontWeight: '300', marginTop: -2 },
  toggle: {
    width: 48,
    height: 26,
    borderRadius: radius.pill,
    padding: 2,
    justifyContent: 'center',
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
