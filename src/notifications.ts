import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { combineDateTime } from './utils/date';
import { Language, ReminderOffset, Task } from './types';
import { t } from './i18n';

// Show notifications while app is foregrounded too.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const OFFSET_MS: Record<ReminderOffset, number> = {
  none: 0,
  at_time: 0,
  '5m': 5 * 60 * 1000,
  '15m': 15 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '3h': 3 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '2d': 2 * 24 * 60 * 60 * 1000,
  '3d': 3 * 24 * 60 * 60 * 1000,
  '1w': 7 * 24 * 60 * 60 * 1000,
};

export async function registerForNotifications(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Todoku',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6C5CE7',
    });
  }

  if (!Device.isDevice) {
    // Notifications only work on physical devices; treat simulators gracefully.
    return false;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  return status === 'granted';
}

/**
 * Schedule all reminders for a task. Returns the created notification ids.
 * Past-due trigger times are skipped automatically.
 */
export async function scheduleTaskReminders(
  task: Task,
  lang: Language,
): Promise<string[]> {
  const ids: string[] = [];
  const base = combineDateTime(task.date, task.time).getTime();

  for (const offset of task.reminders) {
    if (offset === 'none') continue;
    const triggerMs = base - OFFSET_MS[offset];
    if (triggerMs <= Date.now() + 1000) continue; // skip past triggers

    const isDeadline = offset !== 'at_time';
    const title = isDeadline ? t(lang, 'notifDeadline') : t(lang, 'notifTime');

    try {
      const nid = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${title} ⏰`,
          body: task.title,
          data: { taskId: task.id },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(triggerMs),
        },
      });
      ids.push(nid);
    } catch (e) {
      console.warn('failed to schedule notification', e);
    }
  }
  return ids;
}

export async function cancelTaskReminders(notificationIds?: string[]): Promise<void> {
  if (!notificationIds?.length) return;
  await Promise.all(
    notificationIds.map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined),
    ),
  );
}
