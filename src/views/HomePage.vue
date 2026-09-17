<template>
  <ion-page>
    <!-- Top Header Yenye Dynamic Theme Color -->
    <div class="home-header" :style="{ background: themeColor }">
      <div class="header-overlay"></div>
      
      <!-- Top Row: Jina la Mwanafunzi na Profile Picture -->
      <div class="header-top">
        <div class="student-info">
          <span class="welcome-label">{{ t.studentLabel }}</span>
          <h3 class="student-name">{{ studentName }}</h3>
        </div>
        
        <div class="user-avatar-badge" @click="goToProfile">
          <img v-if="userProfilePic" :src="userProfilePic" alt="Profile" class="avatar-img" />
          <ion-icon v-else :icon="personCircleOutline" class="avatar-icon"></ion-icon>
        </div>
      </div>

      <!-- Bottom Row: Title na Current Date Badge -->
      <div class="header-bottom">
        <div class="header-text">
          <h2 class="main-title" v-html="t.mainTitle"></h2>
        </div>
        
        <div class="date-glass-badge">
          <div class="date-content">
            <span class="day-str">{{ currentDayName }}</span>
            <span class="day-num">{{ currentDateNumber }}</span>
            <span class="month-str">{{ currentMonthYear }}</span>
          </div>
        </div>
      </div>
    </div>

    <ion-content class="ion-padding custom-content">
      
      <!-- Sehemu Mpya: Quick Daily Banner (Inaongeza Urembo hata kama hakuna ratiba) -->
      <div class="welcome-banner" :style="{ borderColor: themeColor }">
        <div class="banner-icon-box" :style="{ background: themeColor + '20', color: themeColor }">
          <ion-icon :icon="sparklesOutline"></ion-icon>
        </div>
        <div class="banner-text">
          <h4>{{ t.bannerTitle }}</h4>
          <p>{{ t.bannerSub }}</p>
        </div>
      </div>

      <!-- Filter Segment Buttons -->
      <div class="segment-container">
        <button 
          v-for="cat in translatedCategories" 
          :key="cat.id" 
          :class="['segment-btn', { active: selectedCategory === cat.id }]"
          @click="selectedCategory = cat.id"
        >
          {{ cat.title }}
        </button>
      </div>

      <!-- Action Bar -->
      <div class="action-bar">
        <div class="section-title">
          <h3>{{ t.existingClassesTitle }}</h3>
          <span class="count-badge">{{ filteredClasses.length }}</span>
        </div>
        <button class="add-class-btn" :style="{ background: themeColor }" @click="openAddModal">
          <ion-icon :icon="addOutline"></ion-icon>
          <span>{{ t.addClassBtn }}</span>
        </button>
      </div>

      <!-- Timeline List -->
      <div class="timeline-container">
        <div 
          v-for="item in filteredClasses" 
          :key="item.id" 
          class="timeline-row"
        >
          <div class="timeline-time">
            <span>{{ getStartTimeOnly(item.time) }}</span>
          </div>

          <div class="timeline-card" :style="{ backgroundColor: item.color || themeColor }">
            <div class="card-content">
              <span class="card-period">{{ item.date ? item.date + ' | ' : '' }}{{ item.time }}</span>
              <h4 class="card-title">{{ item.code ? item.code + ': ' : '' }}{{ item.title }}</h4>
              <span v-if="item.venue" class="card-venue">
                <ion-icon :icon="locationOutline"></ion-icon> {{ item.venue }}
              </span>
            </div>

            <div class="card-actions">
              <button class="action-btn edit-btn" @click="openEditModal(item)">
                <ion-icon :icon="createOutline"></ion-icon>
              </button>
              <button class="action-btn delete-btn" @click="deleteClass(item.id)">
                <ion-icon :icon="trashOutline"></ion-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State Iliyoboreshwa na Kuvutia Zaidi -->
        <div v-if="filteredClasses.length === 0" class="empty-card-modern">
          <div class="empty-icon-circle" :style="{ background: themeColor + '15', color: themeColor }">
            <ion-icon :icon="calendarOutline"></ion-icon>
          </div>
          <h3>{{ t.emptyTitle }}</h3>
          <p>{{ t.emptySub }}</p>
          <button class="empty-action-btn" :style="{ background: themeColor }" @click="openAddModal">
            <ion-icon :icon="addOutline"></ion-icon> {{ t.addClassBtn }}
          </button>
        </div>
      </div>

      <!-- Modal ya Kuongeza/Kuedit -->
      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar :style="{ '--background': themeColor }" color="primary">
            <ion-title>{{ isEditing ? t.modalEditTitle : t.modalAddTitle }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">{{ t.closeBtn }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="form-group">
            <label>{{ t.labelCode }}</label>
            <input type="text" v-model="form.code" class="custom-input" placeholder="e.g. MAB701" />
          </div>

          <div class="form-group">
            <label>{{ t.labelTitle }}</label>
            <input type="text" v-model="form.title" class="custom-input" placeholder="e.g. Advanced Calculus" />
          </div>

          <div class="form-group">
            <label>{{ t.labelDate }}</label>
            <input type="date" v-model="form.date" class="custom-input" />
          </div>

          <div class="form-row-group" style="display: flex; gap: 10px;">
            <div class="form-group" style="flex: 1;">
              <label>{{ t.labelStartTime }}</label>
              <input type="time" v-model="form.startTimeInput" class="custom-input" />
            </div>
            <div class="form-group" style="flex: 1;">
              <label>{{ t.labelEndTime }}</label>
              <input type="time" v-model="form.endTimeInput" class="custom-input" />
            </div>
          </div>

          <div class="form-group">
            <label>{{ t.labelVenue }}</label>
            <input type="text" v-model="form.venue" class="custom-input" placeholder="e.g. Room 204" />
          </div>

          <div class="form-group">
            <label>{{ t.labelNotify }}</label>
            <select v-model="form.notifyBeforeMinutes" class="custom-select">
              <option :value="15">{{ t.opt15Min }}</option>
              <option :value="30">{{ t.opt30Min }}</option>
              <option :value="60">{{ t.opt1Hour }}</option>
              <option :value="0">{{ t.optOnTime }}</option>
              <option :value="-1">{{ t.optNone }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>{{ t.labelCategory }}</label>
            <select v-model="form.category" class="custom-select">
              <option value="Kusoma">{{ t.catStudy }}</option>
              <option value="Kazi">{{ t.catWork }}</option>
              <option value="Zingine">{{ t.catOther }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>{{ t.labelColor }}</label>
            <div class="color-options">
              <button 
                v-for="color in colorPalette" 
                :key="color"
                type="button"
                :class="['color-circle', { active: form.color === color }]"
                :style="{ backgroundColor: color }"
                @click="form.color = color"
              ></button>
            </div>
          </div>

          <button class="save-btn" :style="{ background: themeColor }" @click="saveClass">
            {{ isEditing ? t.saveEditBtn : t.saveNewBtn }}
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
import { 
  addOutline, 
  locationOutline, 
  createOutline, 
  trashOutline,
  calendarOutline,
  personCircleOutline,
  sparklesOutline 
} from 'ionicons/icons';
import { getClassesFromStorage, saveClassesToStorage } from '../services/storageService';
import { scheduleClassNotification } from '../services/notificationService';

const router = useRouter();
const allClasses = ref<any[]>([]);
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const studentName = ref('ALEX JOSEPH');
const userProfilePic = ref<string | null>(null);
const themeColor = ref('#c8102e');
const currentLanguage = ref('sw');

const translations: any = {
  sw: {
    studentLabel: 'MWANAFUNZI',
    mainTitle: 'Ratiba<br />Zangu',
    bannerTitle: 'Karibu tena!',
    bannerSub: 'Panga siku yako vizuri, ongeza vipindi au kazi zako hapa chini.',
    existingClassesTitle: 'Vipindi Vilivyopo',
    addClassBtn: 'Ongeza Kipindi',
    emptyTitle: 'Hakuna Ratiba kwa Sasa',
    emptySub: 'Anza kupanga siku yako kwa kuongeza kipindi au tukio jipya hapa.',
    modalAddTitle: 'Ongeza Kipindi',
    modalEditTitle: 'Edit Kipindi',
    closeBtn: 'Funga',
    labelCode: 'Kodi ya Somo (Si lazima)',
    labelTitle: 'Jina la Somo/Tukio',
    labelDate: 'Tarehe ya Tukio / Somo',
    labelStartTime: 'Muda wa Kuanza',
    labelEndTime: 'Muda wa Kuisha',
    labelVenue: 'Eneo (Venue)',
    labelNotify: 'Ukumbusho (Notification)',
    opt15Min: 'Dakika 15 kabla',
    opt30Min: 'Dakika 30 kabla',
    opt1Hour: 'Saa 1 kabla',
    optOnTime: 'Muda unapoingia',
    optNone: 'Bila Ukumbusho',
    labelCategory: 'Kundi',
    catStudy: 'Kusoma',
    catWork: 'Kazi',
    catOther: 'Zingine',
    labelColor: 'Chagua Rangi ya Kadi',
    saveNewBtn: 'Hifadhi Kipindi',
    saveEditBtn: 'Hifadhi Mabadiliko',
    categories: [
      { id: 'zote', title: 'Zote' },
      { id: 'Kusoma', title: 'Kusoma' },
      { id: 'Kazi', title: 'Kazi' },
      { id: 'Zingine', title: 'Zingine' }
    ]
  },
  en: {
    studentLabel: 'STUDENT',
    mainTitle: 'My<br />Schedule',
    bannerTitle: 'Welcome back!',
    bannerSub: 'Organize your day efficiently by adding your classes or tasks below.',
    existingClassesTitle: 'Existing Classes',
    addClassBtn: 'Add Class',
    emptyTitle: 'No Schedule Yet',
    emptySub: 'Start organizing your day by adding a new class or event here.',
    modalAddTitle: 'Add Class',
    modalEditTitle: 'Edit Class',
    closeBtn: 'Close',
    labelCode: 'Subject Code (Optional)',
    labelTitle: 'Subject/Event Name',
    labelDate: 'Event / Class Date',
    labelStartTime: 'Start Time',
    labelEndTime: 'End Time',
    labelVenue: 'Venue',
    labelNotify: 'Reminder (Notification)',
    opt15Min: '15 mins before',
    opt30Min: '30 mins before',
    opt1Hour: '1 hour before',
    optOnTime: 'At start time',
    optNone: 'No Reminder',
    labelCategory: 'Category',
    catStudy: 'Study',
    catWork: 'Work',
    catOther: 'Other',
    labelColor: 'Choose Card Color',
    saveNewBtn: 'Save Class',
    saveEditBtn: 'Save Changes',
    categories: [
      { id: 'zote', title: 'All' },
      { id: 'Kusoma', title: 'Study' },
      { id: 'Kazi', title: 'Work' },
      { id: 'Zingine', title: 'Other' }
    ]
  }
};

const t = computed(() => translations[currentLanguage.value] || translations['sw']);
const translatedCategories = computed(() => t.value.categories);
const selectedCategory = ref('zote');
const colorPalette = ['#f59e0b', '#c8102e', '#2563eb', '#8492a6', '#10b981', '#374151'];

const form = ref({
  code: '',
  title: '',
  date: new Date().toISOString().split('T')[0],
  startTimeInput: '08:00',
  endTimeInput: '10:00',
  venue: '',
  category: 'Kusoma',
  color: '#f59e0b',
  notifyBeforeMinutes: 15
});

const now = new Date();
const currentDayName = computed(() => {
  const locale = currentLanguage.value === 'en' ? 'en-US' : 'sw-TZ';
  return now.toLocaleDateString(locale, { weekday: 'short' }).toUpperCase();
});
const currentDateNumber = computed(() => now.getDate());
const currentMonthYear = computed(() => {
  const locale = currentLanguage.value === 'en' ? 'en-US' : 'sw-TZ';
  return now.toLocaleDateString(locale, { month: 'short' }).toUpperCase();
});

// MPANGILIO MPYA: Hapa tunahakikisha ratiba mpya/iliyoongezwa mwisho au ya karibu inakaa JUU KABISA (Descending Order kulingana na ID au Wakati)
const filteredClasses = computed(() => {
  let list = [...allClasses.value];
  
  // Kuchuja kwa kategoria kama imechaguliwa
  if (selectedCategory.value !== 'zote') {
    list = list.filter(c => c.category === selectedCategory.value);
  }

  // Kupanga ili mpya ziwe juu (Zilizotengenezwa karibu au ID kubwa zaidi zinakaa mbele)
  return list.sort((a, b) => b.id - a.id);
});

const getStartTimeOnly = (fullTime: string) => {
  if (!fullTime) return '08:00am';
  return fullTime.split('-')[0]?.trim().toLowerCase() || fullTime;
};

const formatTime12Hour = (time24: string) => {
  if (!time24) return '08:00 AM';
  const [hours, minutes] = time24.split(':');
  let h = parseInt(hours, 10);
  const m = minutes || '00';
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${m}${ampm}`;
};

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
  if (savedColor) themeColor.value = savedColor;
  const savedLang = localStorage.getItem('app_language');
  if (savedLang) currentLanguage.value = savedLang;
};

onMounted(async () => {
  const data = await getClassesFromStorage();
  allClasses.value = data || [];
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

const goToProfile = () => router.push('/profile');

const openAddModal = () => {
  isEditing.value = false;
  form.value = {
    code: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTimeInput: '08:00',
    endTimeInput: '10:00',
    venue: '',
    category: 'Kusoma',
    color: themeColor.value,
    notifyBeforeMinutes: 15
  };
  isModalOpen.value = true;
};

const openEditModal = (item: any) => {
  isEditing.value = true;
  editingId.value = item.id;
  form.value = {
    code: item.code || '',
    title: item.title,
    date: item.date || new Date().toISOString().split('T')[0],
    startTimeInput: item.startTimeRaw || '08:00',
    endTimeInput: item.endTimeRaw || '10:00',
    venue: item.venue || '',
    category: item.category || 'Kusoma',
    color: item.color || themeColor.value,
    notifyBeforeMinutes: item.notifyBeforeMinutes ?? 15
  };
  isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

const saveClass = async () => {
  if (!form.value.title) return;

  const formattedStart = formatTime12Hour(form.value.startTimeInput);
  const formattedEnd = formatTime12Hour(form.value.endTimeInput);
  const combinedTime = `${formattedStart} - ${formattedEnd}`;

  const classData = {
    code: form.value.code,
    title: form.value.title,
    date: form.value.date,
    time: combinedTime,
    startTimeRaw: form.value.startTimeInput,
    endTimeRaw: form.value.endTimeInput,
    startTime: formattedStart,
    venue: form.value.venue,
    category: form.value.category,
    color: form.value.color,
    notifyBeforeMinutes: form.value.notifyBeforeMinutes
  };

  if (isEditing.value && editingId.value !== null) {
    const idx = allClasses.value.findIndex(c => c.id === editingId.value);
    if (idx !== -1) {
      allClasses.value[idx] = { ...allClasses.value[idx], ...classData };
      await scheduleClassNotification(allClasses.value[idx]);
    }
  } else {
    const newItem = {
      id: Date.now(),
      createdAt: Date.now(),
      ...classData
    };
    allClasses.value.push(newItem);
    await scheduleClassNotification(newItem);
  }

  await saveClassesToStorage(allClasses.value);
  closeModal();
};

const deleteClass = async (id: number) => {
  allClasses.value = allClasses.value.filter(c => c.id !== id);
  await saveClassesToStorage(allClasses.value);
};
</script>

<style scoped>
.home-header {
  position: relative;
  color: #ffffff;
  padding: 22px 18px 24px 18px;
  overflow: hidden;
  transition: background 0.3s ease;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.header-overlay {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background: radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.22) 0%, transparent 65%);
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
  letter-spacing: -0.3px;
}

.date-glass-badge {
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
  padding: 6px 12px;
  border-radius: 12px;
  text-align: center;
  min-width: 65px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.date-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-str { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.5px; opacity: 0.9; }
.day-num { font-size: 1.25rem; font-weight: 800; line-height: 1; margin: 1px 0; }
.month-str { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.5px; opacity: 0.9; }

.custom-content { --background: #f8fafc; }

/* Welcome Banner Mpya ya Kuvutia */
.welcome-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-left-width: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  margin-top: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
}

.banner-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.banner-text h4 {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
}

.banner-text p {
  margin: 2px 0 0 0;
  font-size: 0.72rem;
  color: #64748b;
  line-height: 1.3;
}

.segment-container {
  display: flex;
  background: #e2e8f0;
  border-radius: 20px;
  padding: 3px;
  margin-bottom: 16px;
}

.segment-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 8px 0;
  border-radius: 16px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.segment-btn.active {
  background: #0f172a;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.section-title { display: flex; align-items: center; gap: 6px; }
.section-title h3 { font-size: 0.9rem; font-weight: 700; color: #1e293b; margin: 0; }
.count-badge { background: #cbd5e1; font-size: 0.68rem; font-weight: 700; padding: 2px 7px; border-radius: 8px; color: #0f172a; }

.add-class-btn {
  color: #ffffff;
  border: none;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
}

.timeline-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.timeline-time {
  width: 65px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  text-align: right;
  white-space: nowrap;
}

.timeline-card {
  flex: 1;
  border-radius: 14px;
  padding: 12px 14px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.card-content { display: flex; flex-direction: column; gap: 2px; }
.card-period { font-size: 0.68rem; font-weight: 500; opacity: 0.92; }
.card-title { margin: 2px 0; font-size: 0.88rem; font-weight: 700; line-height: 1.2; }
.card-venue { font-size: 0.68rem; opacity: 0.92; display: flex; align-items: center; gap: 3px; }

.card-actions { display: flex; gap: 6px; margin-left: 8px; }
.action-btn {
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.28);
  color: #ffffff;
  backdrop-filter: blur(4px);
}
.action-btn:active { transform: scale(0.92); }

/* Empty State ya Kisasa na ya Kuvutia (Modern) */
.empty-card-modern {
  text-align: center;
  background: #ffffff;
  border-radius: 16px;
  padding: 30px 20px;
  width: 100%;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.empty-icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 12px;
}

.empty-card-modern h3 {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.empty-card-modern p {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0 0 16px 0;
  max-width: 240px;
  line-height: 1.4;
}

.empty-action-btn {
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}

.form-group { margin-bottom: 12px; }
.form-group label { display: block; font-size: 0.75rem; font-weight: 600; color: #334155; margin-bottom: 4px; }
.custom-input, .custom-select {
  width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem; outline: none; background: #fff; color: #0f172a;
}
.color-options { display: flex; gap: 8px; }
.color-circle { width: 30px; height: 30px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; }
.color-circle.active { border-color: #0f172a; transform: scale(1.08); }
.save-btn { width: 100%; color: #ffffff; border: none; padding: 12px; border-radius: 10px; font-weight: 600; cursor: pointer; margin-top: 8px; }
</style>