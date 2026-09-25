import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../../src/components/AppHeader';
import { useStore } from '../../src/store';

function TabIcon({ emoji, focused, color }: { emoji: string; focused: boolean; color: string }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
  );
}

export default function TabsLayout() {
  const { tr, colors, isDark } = useStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <AppHeader />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textFaint,
          sceneStyle: { backgroundColor: colors.background },
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 58 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
            paddingTop: 6,
          },
          tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: tr('home'),
            tabBarIcon: ({ focused, color }) => <TabIcon emoji="🏠" focused={focused} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: tr('tasks'),
            tabBarIcon: ({ focused, color }) => <TabIcon emoji="✅" focused={focused} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: tr('settings'),
            tabBarIcon: ({ focused, color }) => <TabIcon emoji="⚙️" focused={focused} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
