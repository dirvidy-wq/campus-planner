<template>
  <ion-page>
    <!-- Header ya Kalenda yenye Dynamic Theme Color -->
    <div class="calendar-header" :style="{ background: themeColor }">
      <div class="header-overlay"></div>
      
      <!-- Top Row: Jina na Profile Avatar -->
      <div class="header-top">
        <div class="student-info">
          <span class="welcome-label">{{ t.calendarLabel }}</span>
          <h3 class="student-name">{{ studentName }}</h3>
        </div>
        
        <div class="user-avatar-badge" @click="goToProfile">
          <img v-if="userProfilePic" :src="userProfilePic" alt="Profile" class="avatar-img" />
          <ion-icon v-else :icon="personCircleOutline" class="avatar-icon"></ion-icon>
        </div>
      </div>

      <!-- Bottom Row: Title ya Page na Kitufe cha Kuongeza Tukio -->
      <div class="header-bottom">
        <div class="header-text">
          <h2 class="main-title" v-html="t.calendarMainTitle"></h2>
        </div>
        <div class="header-actions">
          <button class="add-event-header-btn" @click="openAddEventModal">
            <ion-icon :icon="addOutline"></ion-icon> {{ t.addEventBtn }}
          </button>
          <div class="month-badge">
            <span>{{ currentMonthYearName }}</span>
          </div>
        </div>
      </div>
    </div>

    <ion-content class="ion-padding custom-content">
      
      <!-- Sehemu ya Kalenda ya Mwezi (Grid View) -->
      <div class="calendar-card-container">
        <div class="calendar-nav">
          <button class="nav-btn" @click="prevMonth">&lt;</button>
          <h3 class="month-title">{{ currentMonthYearName }}</h3>
          <button class="nav-btn" @click="nextMonth">&gt;</button>
        </div>

        <!-- Siku za Wiki -->
        <div class="weekdays-grid">
          <span v-for="day in translatedWeekdays" :key="day" class="weekday-lbl">
            {{ day }}
          </span>
        </div>

        <!-- Siku za Mwezi -->
        <div class="days-grid">
          <div 
            v-for="(dayObj, index) in calendarDays" 
            :key="index"
            :class="[
              'day-cell', 
              { 
                'empty': !dayObj.day, 
                'selected': selectedDate === dayObj.dateString,
                'today': dayObj.isToday,
                'has-event': dayObj.hasEvent 
              }
            ]"
            :style="selectedDate === dayObj.dateString ? { background: themeColor } : (dayObj.isToday ? { borderColor: themeColor } : {})"
            @click="selectDate(dayObj)"
          >
            <span v-if="dayObj.day" :style="dayObj.isToday && selectedDate !== dayObj.dateString ? { color: themeColor, fontWeight: '800' } : {}" class="day-number">{{ dayObj.day }}</span>
            
            <!-- Dots / Badges za kuonyesha aina ya tukio -->
            <div v-if="dayObj.day" class="dots-container">
              <span v-if="dayObj.hasPersonal" class="event-dot personal-dot"></span>
              <span v-if="dayObj.hasHoliday" class="event-dot holiday-dot"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Matukio au Sikukuu za Tarehe Iliyochaguliwa -->
      <div class="events-section">
        <div class="section-title">
          <h3>{{ t.eventsDateTitle }}: {{ selectedDate || t.todayText }}</h3>
        </div>

        <div class="timeline-container" v-if="filteredEvents.length > 0">
          <div v-for="ev in filteredEvents" :key="ev.id || ev.title" class="timeline-row">
            <div class="timeline-card" :style="{ borderLeft: `4px solid ${ev.isPersonal ? '#9333ea' : themeColor}` }">
              <div class="card-content">
                <div class="card-header-row">
                  <span class="card-time" v-if="ev.time">{{ ev.time }}</span>
                  <span :class="['badge-type', ev.isPersonal ? 'badge-personal' : 'badge-holiday']">
                    {{ ev.type || t.defaultEventType }}
                  </span>
                </div>
                <h4 class="card-title">{{ ev.title }}</h4>
              </div>
              <div class="card-actions" v-if="ev.isPersonal">
                <button class="delete-personal-btn" @click="deletePersonalEvent(ev.id)">
                  <ion-icon :icon="trashOutline"></ion-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-card">
          <ion-icon :icon="calendarOutline" class="empty-icon"></ion-icon>
          <p class="empty-title">{{ t.emptyEventsTitle }}</p>
          <p class="empty-sub">{{ t.emptyEventsSub }}</p>
        </div>
      </div>

      <!-- Modal ya Kuongeza Tukio Binafsi (Personal Event) -->
      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar :style="{ '--background': themeColor }" color="primary">
            <ion-title>{{ t.modalAddTitle }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">{{ t.closeBtn }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="form-group">
            <label>{{ t.labelTitle }}</label>
            <input type="text" v-model="form.title" class="custom-input" placeholder="e.g. Birthday ya Mdogo Wangu" />
          </div>

          <div class="form-group">
            <label>{{ t.labelDate }}</label>
            <input type="date" v-model="form.date" class="custom-input" />
          </div>

          <div class="form-group">
            <label>{{ t.labelNotify }}</label>
            <select v-model="form.notifyBeforeMinutes" class="custom-select">
              <option :value="1440">{{ t.opt1Day }}</option>
              <option :value="60">{{ t.opt1Hour }}</option>
              <option :value="0">{{ t.optOnTime }}</option>
            </select>
          </div>

          <button class="save-btn" :style="{ background: themeColor }" @click="savePersonalEvent">
            {{ t.saveBtn }}
          </button>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, 
  IonContent, 
  IonIcon, 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton 
} from '@ionic/vue';
import { personCircleOutline, calendarOutline, addOutline, trashOutline } from 'ionicons/icons';
import { getClassesFromStorage } from '../services/storageService';

const router = useRouter();
const studentName = ref('ALEX JOSEPH');
const userProfilePic = ref<string | null>(null);
const themeColor = ref('#c8102e');
const currentLanguage = ref('sw');

const isModalOpen = ref(false);
const personalEvents = ref<any[]>([]);

const form = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  notifyBeforeMinutes: 1440
});

// Kamusi ya Lugha (Translations)
const translations: any = {
  sw: {
    calendarLabel: 'KALENDA YAKO',
    calendarMainTitle: 'Kalenda &<br />Matukio',
    weekdays: ['Juma', 'Tatu', 'Nne', 'Tano', 'Sita', 'Saba', 'Pili'],
    eventsDateTitle: 'Matukio ya Tarehe',
    todayText: 'Leo',
    defaultEventType: 'Kipindi/Tukio',
    emptyEventsTitle: 'Hakuna tukio tarehe hii',
    emptyEventsSub: 'Chagua tarehe nyingine kuona kama kuna ratiba au ongeza tukio lako.',
    addEventBtn: 'Tukio Jipya',
    modalAddTitle: 'Ongeza Tukio Binafsi',
    closeBtn: 'Funga',
    labelTitle: 'Jina la Tukio (mf. Birthday)',
    labelDate: 'Tarehe ya Tukio',
    labelNotify: 'Ukumbusho (Calendar Notification)',
    opt1Day: 'Siku 1 kabla',
    opt1Hour: 'Saa 1 kabla',
    optOnTime: 'Siku yenyewe inapofika',
    saveBtn: 'Hifadhi Tukio'
  },
  en: {
    calendarLabel: 'YOUR CALENDAR',
    calendarMainTitle: 'Calendar &<br />Events',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    eventsDateTitle: 'Events for Date',
    todayText: 'Today',
    defaultEventType: 'Class/Event',
    emptyEventsTitle: 'No events on this date',
    emptyEventsSub: 'Select another date or add your personal event.',
    addEventBtn: 'New Event',
    modalAddTitle: 'Add Personal Event',
    closeBtn: 'Close',
    labelTitle: 'Event Name (e.g. Birthday)',
    labelDate: 'Event Date',
    labelNotify: 'Calendar Reminder',
    opt1Day: '1 day before',
    opt1Hour: '1 hour before',
    optOnTime: 'On the day',
    saveBtn: 'Save Event'
  }
};

const t = computed(() => translations[currentLanguage.value] || translations['sw']);
const translatedWeekdays = computed(() => t.value.weekdays);

const currentDate = ref(new Date());
const selectedDate = ref('');
const savedClasses = ref<any[]>([]);

// Sikukuu rasmi za kitaifa/kidini
const publicHolidays = ref([
  { date: '2026-01-01', title: 'Mwaka Mpya', type: 'Sikukuu ya Kitaifa', isHoliday: true },
  { date: '2026-01-12', title: 'Sikukuu ya Mapinduzi Zanzibar', type: 'Sikukuu ya Kitaifa', isHoliday: true },
  { date: '2026-04-07', title: 'Sikukuu ya Karume', type: 'Sikukuu ya Kitaifa', isHoliday: true },
  { date: '2026-05-01', title: 'Siku ya Wafanyakazi', type: 'Sikukuu ya Kitaifa', isHoliday: true },
  { date: '2026-07-07', title: 'Sikukuu ya Saba Saba', type: 'Maadhimisho', isHoliday: true },
  { date: '2026-08-08', title: 'Sikukuu ya Nane Nane', type: 'Maadhimisho', isHoliday: true },
  { date: '2026-10-14', title: 'Sikukuu ya Nyerere', type: 'Sikukuu ya Kitaifa', isHoliday: true },
  { date: '2026-12-09', title: 'Siku ya Uhuru', type: 'Sikukuu ya Kitaifa', isHoliday: true },
  { date: '2026-12-25', title: 'Krismasi', type: 'Sikukuu ya Kidini', isHoliday: true },
  { date: '2026-12-26', title: 'Boxing Day', type: 'Sikukuu ya Kitaifa', isHoliday: true }
]);

const currentMonthYearName = computed(() => {
  const locale = currentLanguage.value === 'en' ? 'en-US' : 'sw-TZ';
  return currentDate.value.toLocaleDateString(locale, { month: 'long', year: 'numeric' }).toUpperCase();
});

// Kutengeneza siku za mwezi kwenye Grid pamoja na kutambua matukio binafsi na sikukuu
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const days = [];
  
  for (let i = 0; i < firstDayIndex; i++) {
    days.push({ day: null, dateString: '', isToday: false, hasEvent: false, hasPersonal: false, hasHoliday: false });
  }
  
  for (let d = 1; d <= totalDays; d++) {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(d).padStart(2, '0');
    const dateString = `${year}-${formattedMonth}-${formattedDay}`;
    
    const isToday = (dateString === todayString);
    const hasHoliday = publicHolidays.value.some(h => h.date === dateString);
    const hasPersonal = personalEvents.value.some(p => p.date === dateString);
    
    days.push({
      day: d,
      dateString,
      isToday,
      hasEvent: hasHoliday || hasPersonal,
      hasHoliday,
      hasPersonal
    });
  }
  
  return days;
});

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};

const selectDate = (dayObj: any) => {
  if (!dayObj.day) return;
  selectedDate.value = dayObj.dateString;
};

// Kuchuja matukio ya tarehe iliyochaguliwa (Sikukuu + Matukio Binafsi)
const filteredEvents = computed(() => {
  const targetDate = selectedDate.value || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  
  const holidays = publicHolidays.value.filter(h => h.date === targetDate);
  const personal = personalEvents.value.filter(p => p.date === targetDate);
  
  return [...holidays, ...personal];
});

// Kazi za kuhifadhi na kufuta matukio binafsi
const loadPersonalEvents = () => {
  const saved = localStorage.getItem('user_calendar_personal_events');
  if (saved) {
    try {
      personalEvents.value = JSON.parse(saved);
    } catch (e) {}
  }
};

const openAddEventModal = () => {
  form.value = {
    title: '',
    date: selectedDate.value || new Date().toISOString().split('T')[0],
    notifyBeforeMinutes: 1440
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const savePersonalEvent = () => {
  if (!form.value.title || !form.value.date) return;

  const newEvent = {
    id: Date.now(),
    title: form.value.title,
    date: form.value.date,
    type: currentLanguage.value === 'en' ? 'Personal Event' : 'Tukio Binafsi',
    isPersonal: true,
    notifyBeforeMinutes: form.value.notifyBeforeMinutes
  };

  personalEvents.value.push(newEvent);
  localStorage.setItem('user_calendar_personal_events', JSON.stringify(personalEvents.value));
  
  // Trigger notification maalum ya kalenda
  scheduleCalendarNotification(newEvent);

  closeModal();
};

const deletePersonalEvent = (id: number) => {
  personalEvents.value = personalEvents.value.filter(e => e.id !== id);
  localStorage.setItem('user_calendar_personal_events', JSON.stringify(personalEvents.value));
};

// Mfumo wa Tofauti wa Notifications kwa Kalenda (Sikukuu & Matukio Binafsi)
const scheduleCalendarNotification = (eventObj: any) => {
  // Hapa unaweza kuunganisha na Capacitor LocalNotifications plugin ikihitajika
  // Mfumo huu unatambua tofauti ya ujumbe kati ya Sikukuu na Tukio Binafsi
  console.log(`Calendar Notification scheduled for "${eventObj.title}" on date ${eventObj.date}`);
};

// Kusoma profile, theme color na lugha
const loadUserProfileAndTheme = () => {
  const savedProfile = localStorage.getItem('user_profile');
  if (savedProfile) {
    try {
      const parsed = JSON.parse(savedProfile);
      if (parsed.name) studentName.value = parsed.name.toUpperCase();
      if (parsed.image) userProfilePic.value = parsed.image;
    } catch (e) {}
  }

  const savedColor = localStorage.getItem('app_theme_color');
  if (savedColor) {
    themeColor.value = savedColor;
  }

  const savedLang = localStorage.getItem('app_language');
  if (savedLang) {
    currentLanguage.value = savedLang;
  }
};

onMounted(async () => {
  savedClasses.value = await getClassesFromStorage() || [];
  loadPersonalEvents();
  loadUserProfileAndTheme();

  window.addEventListener('profile-updated', loadUserProfileAndTheme);
  window.addEventListener('theme-changed', loadUserProfileAndTheme);
  window.addEventListener('language-changed', loadUserProfileAndTheme);
});

onUnmounted(() => {
  window.removeEventListener('profile-updated', loadUserProfileAndTheme);
  window.removeEventListener('theme-changed', loadUserProfileAndTheme);
  window.removeEventListener('language-changed', loadUserProfileAndTheme);
});

const goToProfile = () => {
  router.push('/profile');
};
</script>

<style scoped>
.calendar-header {
  position: relative;
  color: #ffffff;
  padding: 22px 18px 24px 18px;
  overflow: hidden;
  transition: background 0.3s ease;
}

.header-overlay {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background: radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.18) 0%, transparent 60%);
  pointer-events: none;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.welcome-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  opacity: 0.85;
}

.student-name {
  margin: 2px 0 0 0;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.user-avatar-badge {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.15);
}

.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-icon { font-size: 1.8rem; color: #ffffff; }

.header-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 16px;
  position: relative;
  z-index: 2;
}

.main-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.15;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-event-header-btn {
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #ffffff;
  padding: 7px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  backdrop-filter: blur(6px);
}

.month-badge {
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
}

.custom-content { --background: #ffffff; }

/* Kalenda Grid Styling */
.calendar-card-container {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 20px;
}

.calendar-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.month-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.nav-btn {
  background: #e5e7eb;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-weight: bold;
  cursor: pointer;
}

.weekdays-grid, .days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
}

.weekday-lbl {
  font-size: 0.68rem;
  font-weight: 700;
  color: #6b7280;
  padding-bottom: 6px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  position: relative;
  background: #ffffff;
  border: 1px solid #f3f4f6;
}

.day-cell.empty { background: transparent; border: none; cursor: default; }

/* Mtindo wa Siku ya Leo (Today) */
.day-cell.today {
  border: 2px solid #111827; 
}

.day-cell.selected { color: #ffffff; }

.dots-container {
  display: flex;
  gap: 3px;
  margin-top: 2px;
}

.event-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

.personal-dot { background-color: #9333ea; }
.holiday-dot { background-color: #f59e0b; }

/* Events Section */
.events-section { display: flex; flex-direction: column; gap: 10px; }
.section-title h3 { font-size: 0.9rem; font-weight: 700; color: #1f2937; margin: 0; }

.timeline-container { display: flex; flex-direction: column; gap: 8px; }
.timeline-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.card-header-row { display: flex; justify-content: space-between; align-items: center; }
.card-time { font-size: 0.68rem; color: #6b7280; font-weight: 600; }
.card-title { font-size: 0.85rem; font-weight: 700; color: #1f2937; margin: 2px 0 0 0; }

.badge-type {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;
}
.badge-personal { background: #f3e8ff; color: #9333ea; }
.badge-holiday { background: #fef3c7; color: #d97706; }

.delete-personal-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px;
}

.empty-card { text-align: center; background: #f9fafb; border-radius: 12px; padding: 20px; border: 1px dashed #e5e7eb; }
.empty-icon { font-size: 1.6rem; color: #9ca3af; margin-bottom: 4px; }
.empty-title { font-size: 0.82rem; font-weight: 600; margin: 0; color: #374151; }
.empty-sub { font-size: 0.7rem; color: #6b7280; margin: 2px 0 0 0; }

/* Modal Form Styles */
.form-group { margin-bottom: 12px; }
.form-group label { display: block; font-size: 0.75rem; font-weight: 600; color: #334155; margin-bottom: 4px; }
.custom-input, .custom-select {
  width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem; outline: none; background: #fff; color: #0f172a;
}
.save-btn { width: 100%; color: #ffffff; border: none; padding: 12px; border-radius: 10px; font-weight: 600; cursor: pointer; margin-top: 8px; }
</style>