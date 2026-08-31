import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleRecurringReminder(
  id: string,
  title: string,
  body: string,
  dueDate: Date,
  daysBefore: number
) {
  const triggerDate = new Date(dueDate);
  triggerDate.setDate(triggerDate.getDate() - daysBefore);
  triggerDate.setHours(9, 0, 0, 0);

  if (triggerDate.getTime() <= Date.now()) {
    triggerDate.setTime(Date.now() + 60000);
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
  });

  return notificationId;
}

export async function cancelNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function sendBudgetExceededAlert(categoryName: string, overAmount: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⚠️ Budget Exceeded',
      body: `You've gone ${overAmount} TND over budget in ${categoryName}`,
    },
    trigger: null,
  });
}