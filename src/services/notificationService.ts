import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// Angalia kama app ina-run kwenye Simu (Native) au kwenye Browser (Web)
const isNative = Capacitor.isNativePlatform();

export const requestNotificationPermission = async () => {
  if (!isNative) {
    console.log('Web environment detected: LocalNotifications permissions skipped.');
    return false;
  }

  try {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch (e) {
    console.log('Notification permission error:', e);
    return false;
  }
};

// Notification ya Kipindi (Custom Time)
export const scheduleClassNotification = async (classItem: {
  id: number;
  code: string;
  title: string;
  startTime: string;
  notifyBeforeMinutes: number;
}) => {
  if (!isNative) {
    console.log('Web environment detected: Skipping scheduleClassNotification');
    return;
  }

  try {
    const isGranted = await requestNotificationPermission();
    if (!isGranted || classItem.notifyBeforeMinutes === -1) return;

    // Badilisha muda wa saa kuwa Date Object ya leo
    const [time, modifier] = classItem.startTime.split(/(?=[AP]M)/i);
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier && modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier && modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

    const scheduledDate = new Date();
    scheduledDate.setHours(hours, minutes || 0, 0, 0);

    const notificationTime = new Date(scheduledDate.getTime() - classItem.notifyBeforeMinutes * 60 * 1000);

    if (notificationTime.getTime() > Date.now()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `Ukumbusho wa Kipindi: ${classItem.code || ''}`,
            body: `${classItem.title} inaanza hivi karibuni!`,
            id: Number(classItem.id.toString().slice(-8)),
            schedule: { at: notificationTime }
          }
        ]
      });
    }
  } catch (error) {
    console.log('Class Notification Error:', error);
  }
};

// Notification ya Sikukuu
export const scheduleHolidayNotification = async (holiday: { id: number; date: string; title: string; type: string; description: string }) => {
  if (!isNative) {
    console.log('Web environment detected: Skipping scheduleHolidayNotification');
    return;
  }

  try {
    const isGranted = await requestNotificationPermission();
    if (!isGranted) return;

    const holidayDate = new Date(`${holiday.date}T07:00:00`);
    if (holidayDate.getTime() > Date.now()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `Sikukuu ya ${holiday.type}: ${holiday.title}`,
            body: `${holiday.description}. Leo ni siku ya mapumziko/tukio.`,
            id: holiday.id,
            schedule: { at: holidayDate }
          }
        ]
      });
    }
  } catch (error) {
    console.log('Holiday Notification Error:', error);
  }
};