<template>
  <ion-page>
    <ion-content class="profile-content">
      <!-- Top Cover Banner & Profile Card -->
      <div class="profile-header">
        <div class="cover-bg" :style="{ background: activeThemeColor }"></div>
        <div class="header-actions">
          <button class="icon-circle-btn" @click="openThemeModal">
            <ion-icon :icon="colorPaletteOutline"></ion-icon>
          </button>
          <button class="icon-circle-btn" @click="openEditModal">
            <ion-icon :icon="createOutline"></ion-icon>
          </button>
        </div>

        <div class="user-avatar-wrapper">
          <div class="avatar-container" @click="openEditModal">
            <img v-if="profile.image" :src="profile.image" alt="Profile" class="avatar-img" />
            <div v-else class="avatar-placeholder" :style="{ color: activeThemeColor }">
              {{ getInitials(profile.name) }}
            </div>
            <div class="camera-badge">
              <ion-icon :icon="cameraOutline"></ion-icon>
            </div>
          </div>
        </div>

        <div class="user-info">
          <h2 class="user-name">{{ profile.name }}</h2>
          <p class="user-college">{{ profile.college }}</p>
          <span class="user-tag" :style="{ color: activeThemeColor, background: activeThemeColor + '1A' }">
            {{ profile.course || currentText.defaultStudentTag }}
          </span>
        </div>
      </div>

      <!-- Quick Action Grid -->
      <div class="action-grid-container">
        <div class="action-grid">
          <div class="action-card" @click="openEditModal">
            <div class="card-icon edit-bg">
              <ion-icon :icon="personOutline"></ion-icon>
            </div>
            <span>{{ currentText.editProfile }}</span>
          </div>

          <div class="action-card" @click="openThemeModal">
            <div class="card-icon theme-bg">
              <ion-icon :icon="colorPaletteOutline"></ion-icon>
            </div>
            <span>{{ currentText.appColor }}</span>
          </div>

          <div class="action-card" @click="downloadSchedulePDF">
            <div class="card-icon download-bg">
              <ion-icon :icon="downloadOutline"></ion-icon>
            </div>
            <span>{{ currentText.downloadSched }}</span>
          </div>

          <div class="action-card" @click="openNotifyModal">
            <div class="card-icon notify-bg">
              <ion-icon :icon="notificationsOutline"></ion-icon>
            </div>
            <span>{{ currentText.reminder }}</span>
          </div>
        </div>
      </div>

      <!-- Settings Menu Groups -->
      <div class="settings-container">
        <!-- Group 1: Mipangilio ya App & Theme -->
        <div class="settings-group">
          <h4 class="group-title">{{ currentText.appSettingsTitle }}</h4>
          
          <div class="setting-item" @click="openThemeModal">
            <div class="item-left">
              <div class="item-icon theme-ic">
                <ion-icon :icon="colorPaletteOutline"></ion-icon>
              </div>
              <div class="item-text">
                <span class="title">{{ currentText.themeTitle }}</span>
                <span class="sub">{{ currentText.themeSub }}</span>
              </div>
            </div>
            <div class="color-preview-dot" :style="{ backgroundColor: activeThemeColor }"></div>
          </div>

          <div class="setting-item" @click="openLangModal">
            <div class="item-left">
              <div class="item-icon lang-ic">
                <ion-icon :icon="languageOutline"></ion-icon>
              </div>
              <div class="item-text">
                <span class="title">{{ currentText.langTitle }}</span>
                <span class="sub">{{ profile.language === 'en' ? 'English' : 'Kiswahili' }}</span>
              </div>
            </div>
            <ion-icon :icon="chevronForwardOutline" class="arrow-ic"></ion-icon>
          </div>

          <div class="setting-item" @click="openNotifyModal">
            <div class="item-left">
              <div class="item-icon bell-ic">
                <ion-icon :icon="notificationsOutline"></ion-icon>
              </div>
              <div class="item-text">
                <span class="title">{{ currentText.reminderTime }}</span>
                <span class="sub">{{ profile.defaultNotifyMinutes }} {{ currentText.minutesBefore }}</span>
              </div>
            </div>
            <ion-icon :icon="chevronForwardOutline" class="arrow-ic"></ion-icon>
          </div>
        </div>

        <!-- Group 2: Data na Ripoti -->
        <div class="settings-group">
          <h4 class="group-title">{{ currentText.scheduleReportTitle }}</h4>
          
          <div class="setting-item" @click="downloadSchedulePDF">
            <div class="item-left">
              <div class="item-icon pdf-ic">
                <ion-icon :icon="documentTextOutline"></ion-icon>
              </div>
              <div class="item-text">
                <span class="title">{{ currentText.downloadPdf }}</span>
                <span class="sub">{{ currentText.printSave }}</span>
              </div>
            </div>
            <ion-icon :icon="downloadOutline" class="arrow-ic"></ion-icon>
          </div>

          <div class="setting-item" @click="clearAllData">
            <div class="item-left">
              <div class="item-icon danger-ic">
                <ion-icon :icon="trashOutline"></ion-icon>
              </div>
              <div class="item-text">
                <span class="title text-danger">{{ currentText.clearAll }}</span>
                <span class="sub">{{ currentText.startFresh }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal 1: Edit Profile -->
      <ion-modal :is-open="isEditModalOpen" @didDismiss="isEditModalOpen = false">
        <ion-header>
          <ion-toolbar :style="{ '--background': activeThemeColor }" color="primary">
            <ion-title>{{ currentText.editProfile }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="isEditModalOpen = false">{{ currentText.close }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="avatar-upload-section">
            <div class="avatar-preview">
              <img v-if="tempProfile.image" :src="tempProfile.image" />
              <div v-else class="avatar-placeholder-large" :style="{ color: activeThemeColor }">
                {{ getInitials(tempProfile.name) }}
              </div>
            </div>
            <label class="upload-btn" :style="{ color: activeThemeColor }">
              <ion-icon :icon="cameraOutline"></ion-icon> {{ currentText.changePhoto }}
              <input type="file" accept="image/*" @change="handleImageUpload" hidden />
            </label>
          </div>

          <div class="form-group">
            <label>{{ currentText.fullName }}</label>
            <input type="text" v-model="tempProfile.name" class="custom-input" placeholder="e.g. Alex Johnson" />
          </div>

          <div class="form-group">
            <label>{{ currentText.collegeName }}</label>
            <input type="text" v-model="tempProfile.college" class="custom-input" placeholder="e.g. UDSM" />
          </div>

          <div class="form-group">
            <label>{{ currentText.courseName }}</label>
            <input type="text" v-model="tempProfile.course" class="custom-input" placeholder="e.g. BSc in Computer Science" />
          </div>

          <button class="save-btn" :style="{ background: activeThemeColor }" @click="saveProfile">{{ currentText.saveProfile }}</button>
        </ion-content>
      </ion-modal>

      <!-- Modal 2: Custom Theme Color Picker -->
      <ion-modal :is-open="isThemeModalOpen" @didDismiss="isThemeModalOpen = false">
        <ion-header>
          <ion-toolbar :style="{ '--background': activeThemeColor }" color="primary">
            <ion-title>{{ currentText.chooseThemeTitle }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="isThemeModalOpen = false">{{ currentText.close }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <p class="modal-subtext">{{ currentText.chooseThemeSub }}</p>
          
          <div class="theme-palette-grid">
            <div 
              v-for="color in themeColors" 
              :key="color.hex" 
              :class="['theme-option-card', { active: activeThemeColor === color.hex }]"
              @click="applyThemeColor(color.hex)"
            >
              <div class="color-circle-preview" :style="{ backgroundColor: color.hex }">
                <ion-icon v-if="activeThemeColor === color.hex" :icon="checkmarkOutline"></ion-icon>
              </div>
              <span class="color-label">{{ color.name }}</span>
            </div>
          </div>

          <button class="save-btn" :style="{ background: activeThemeColor }" @click="isThemeModalOpen = false">{{ currentText.finish }}</button>
        </ion-content>
      </ion-modal>

      <!-- Modal 3: Language Selector -->
      <ion-modal :is-open="isLangModalOpen" @didDismiss="isLangModalOpen = false">
        <ion-header>
          <ion-toolbar :style="{ '--background': activeThemeColor }" color="primary">
            <ion-title>{{ currentText.chooseLangTitle }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="isLangModalOpen = false">{{ currentText.close }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="form-group">
            <label>{{ currentText.chooseLangSub }}</label>
            <select v-model="profile.language" class="custom-select" @change="saveLanguage">
              <option value="sw">Kiswahili</option>
              <option value="en">English</option>
            </select>
          </div>
          <button class="save-btn" :style="{ background: activeThemeColor }" @click="isLangModalOpen = false">{{ currentText.save }}</button>
        </ion-content>
      </ion-modal>

      <!-- Modal 4: Notification Timer -->
      <ion-modal :is-open="isNotifyModalOpen" @didDismiss="isNotifyModalOpen = false">
        <ion-header>
          <ion-toolbar :style="{ '--background': activeThemeColor }" color="primary">
            <ion-title>{{ currentText.reminderTime }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="isNotifyModalOpen = false">{{ currentText.close }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="form-group">
            <label>{{ currentText.reminderLabel }}</label>
            <select v-model="profile.defaultNotifyMinutes" class="custom-select" @change="saveProfile">
              <option :value="15">{{ currentText.opt15 }}</option>
              <option :value="30">{{ currentText.opt30 }}</option>
              <option :value="60">{{ currentText.opt60 }}</option>
              <option :value="0">{{ currentText.opt0 }}</option>
            </select>
          </div>
          <button class="save-btn" :style="{ background: activeThemeColor }" @click="isNotifyModalOpen = false">{{ currentText.save }}</button>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
  createOutline, 
  cameraOutline, 
  personOutline, 
  colorPaletteOutline, 
  notificationsOutline, 
  downloadOutline, 
  chevronForwardOutline, 
  documentTextOutline, 
  trashOutline,
  checkmarkOutline,
  languageOutline 
} from 'ionicons/icons';
import { getClassesFromStorage, saveClassesToStorage } from '../services/storageService';

const router = useRouter();
const isEditModalOpen = ref(false);
const isThemeModalOpen = ref(false);
const isLangModalOpen = ref(false);
const isNotifyModalOpen = ref(false);

const activeThemeColor = ref('#c8102e'); // Red Default

// Kamusi ya lugha (Translations Map)
const t = ref({
  sw: {
    defaultStudentTag: 'Mwanafunzi',
    editProfile: 'Edit Profile',
    appColor: 'Rangi ya App',
    downloadSched: 'Pakua Ratiba',
    reminder: 'Ukumbusho',
    appSettingsTitle: 'MIPANGILIO YA APP NA MUONEKANO',
    themeTitle: 'Rangi na Theme ya App',
    themeSub: 'Badilisha rangi ya muonekano wa app',
    langTitle: 'Lugha ya App (Language)',
    reminderTime: 'Muda wa Ukumbusho',
    minutesBefore: 'dakika kabla ya kipindi',
    scheduleReportTitle: 'RATIBA NA RIPOTI',
    downloadPdf: 'Pakua Ratiba Kama PDF',
    printSave: 'Print au hifadhi kwenye simu',
    clearAll: 'Futa Ratiba Zote',
    startFresh: 'Anza upya ratiba yako',
    close: 'Funga',
    saveProfile: 'Hifadhi Profile',
    changePhoto: 'Badilisha Picha',
    fullName: 'Jina Kamili',
    collegeName: 'Jina la Chuo/Shule',
    courseName: 'Kozi / Masomo',
    chooseThemeTitle: 'Chagua Rangi ya App',
    chooseThemeSub: 'Chagua rangi unayoipenda ili kubadilisha muonekano wa app yote:',
    finish: 'Maliza',
    chooseLangTitle: 'Chagua Lugha / Language',
    chooseLangSub: 'Chagua lugha unayotaka kutumia kwenye app:',
    save: 'Hifadhi',
    reminderLabel: 'Seta muda wa kukumbushwa kabla ya somo kuanza:',
    opt15: 'Dakika 15 Kabla',
    opt30: 'Dakika 30 Kabla',
    opt60: 'Saa 1 Kabla',
    opt0: 'Muda Kamili wa Somo'
  },
  en: {
    defaultStudentTag: 'Student',
    editProfile: 'Edit Profile',
    appColor: 'App Color',
    downloadSched: 'Download Schedule',
    reminder: 'Reminder',
    appSettingsTitle: 'APP SETTINGS & APPEARANCE',
    themeTitle: 'App Theme & Color',
    themeSub: 'Change app appearance color',
    langTitle: 'App Language',
    reminderTime: 'Reminder Time',
    minutesBefore: 'minutes before class',
    scheduleReportTitle: 'SCHEDULE & REPORTS',
    downloadPdf: 'Download Schedule as PDF',
    printSave: 'Print or save to phone',
    clearAll: 'Clear All Schedules',
    startFresh: 'Start your schedule fresh',
    close: 'Close',
    saveProfile: 'Save Profile',
    changePhoto: 'Change Photo',
    fullName: 'Full Name',
    collegeName: 'College / School Name',
    courseName: 'Course / Subjects',
    chooseThemeTitle: 'Choose App Color',
    chooseThemeSub: 'Choose your favorite color to change the entire app appearance:',
    finish: 'Finish',
    chooseLangTitle: 'Choose Language',
    chooseLangSub: 'Select the language you want to use in the app:',
    save: 'Save',
    reminderLabel: 'Set reminder time before class starts:',
    opt15: '15 Minutes Before',
    opt30: '30 Minutes Before',
    opt60: '1 Hour Before',
    opt0: 'Exact Class Time'
  }
});

const themeColors = [
  { name: 'Chuo Red', hex: '#c8102e' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Deep Purple', hex: '#7c3aed' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Sunset Orange', hex: '#ea580c' },
  { name: 'Midnight Dark', hex: '#1e293b' }
];

const profile = ref({
  name: 'Alex Johnson',
  college: 'Chuo Kikuu Cha Mlimani (UDSM)',
  course: 'BSc. in Computer Science',
  image: '',
  defaultNotifyMinutes: 15,
  language: 'sw'
});

const tempProfile = ref({ ...profile.value });

// Inachagua maneno ya sasa kulingana na lugha iliyochaguliwa (Swahili / English)
const currentText = computed(() => {
  const lang = profile.value.language === 'en' ? 'en' : 'sw';
  return t.value[lang];
});

onMounted(() => {
  const saved = localStorage.getItem('user_profile');
  if (saved) {
    try {
      profile.value = { ...profile.value, ...JSON.parse(saved) };
    } catch (e) {
      console.log('Profile loading error');
    }
  }

  const savedColor = localStorage.getItem('app_theme_color');
  if (savedColor) {
    activeThemeColor.value = savedColor;
    document.documentElement.style.setProperty('--app-primary-color', savedColor);
  }

  const savedLang = localStorage.getItem('app_language');
  if (savedLang) {
    profile.value.language = savedLang;
  }

  // Kusikiliza mabadiliko ya lugha toka sehemu nyingine za app
  window.addEventListener('language-changed', () => {
    const updatedLang = localStorage.getItem('app_language');
    if (updatedLang) {
      profile.value.language = updatedLang;
    }
  });
});

const getInitials = (name: string) => {
  if (!name) return 'AJ';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const openEditModal = () => {
  tempProfile.value = { ...profile.value };
  isEditModalOpen.value = true;
};

const openThemeModal = () => {
  isThemeModalOpen.value = true;
};

const openLangModal = () => {
  isLangModalOpen.value = true;
};

const openNotifyModal = () => {
  isNotifyModalOpen.value = true;
};

const applyThemeColor = (colorHex: string) => {
  activeThemeColor.value = colorHex;
  localStorage.setItem('app_theme_color', colorHex);
  document.documentElement.style.setProperty('--app-primary-color', colorHex);
  
  window.dispatchEvent(new Event('theme-changed'));
};

const saveLanguage = () => {
  localStorage.setItem('app_language', profile.value.language);
  localStorage.setItem('user_profile', JSON.stringify(profile.value));
  
  window.dispatchEvent(new Event('language-changed'));
};

const handleImageUpload = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      tempProfile.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const saveProfile = () => {
  profile.value = { ...tempProfile.value };
  localStorage.setItem('user_profile', JSON.stringify(profile.value));
  
  window.dispatchEvent(new Event('profile-updated'));
  
  isEditModalOpen.value = false;
};

const downloadSchedulePDF = async () => {
  const classes = await getClassesFromStorage();
  if (!classes || classes.length === 0) {
    alert(profile.value.language === 'en' ? 'No classes to download. Add schedules first!' : 'Hakuna vipindi vya ku-download. Ongeza ratiba kwanza!');
    return;
  }

  let textContent = `RATIBA YA MASOMO / VIPINDI\nMWANAFUNZI: ${profile.value.name}\nCHUO: ${profile.value.college}\n-----------------------------------\n\n`;
  classes.forEach((item: any, idx: number) => {
    textContent += `${idx + 1}. ${item.code ? item.code + ' - ' : ''}${item.title}\n   Muda: ${item.time}\n   Eneo: ${item.venue || 'N/A'}\n\n`;
  });

  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ratiba_${profile.value.name.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const clearAllData = async () => {
  const msg = profile.value.language === 'en' ? 'Are you sure you want to clear all your schedules?' : 'Je, una uhakika unataka kufuta ratiba zako zote?';
  const successMsg = profile.value.language === 'en' ? 'All schedules cleared successfully!' : 'Ratiba zote zimefutwa kikamilifu!';
  
  if (confirm(msg)) {
    await saveClassesToStorage([]);
    alert(successMsg);
  }
};
</script>

<style scoped>
.profile-content { --background: #f8fafc; }

.profile-header {
  position: relative;
  background: #ffffff;
  padding-bottom: 16px;
  text-align: center;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.cover-bg { height: 110px; transition: background 0.3s ease; }

.header-actions {
  position: absolute; top: 14px; right: 14px; display: flex; gap: 8px;
}

.icon-circle-btn {
  width: 34px; height: 34px; border-radius: 50%; border: none;
  background: rgba(255, 255, 255, 0.25); color: #ffffff;
  backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; cursor: pointer;
}

.user-avatar-wrapper { margin-top: -45px; display: flex; justify-content: center; }

.avatar-container {
  position: relative; width: 86px; height: 86px; border-radius: 50%;
  border: 4px solid #ffffff; background: #f1f5f9; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer;
}

.avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.avatar-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 700; }

.camera-badge {
  position: absolute; bottom: 0; right: 0; background: #1e293b; color: #ffffff;
  width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; border: 2px solid #ffffff;
}

.user-info { margin-top: 8px; }
.user-name { margin: 0; font-size: 1.15rem; font-weight: 700; color: #0f172a; }
.user-college { margin: 2px 0 6px 0; font-size: 0.78rem; color: #64748b; }
.user-tag { font-size: 0.68rem; font-weight: 600; padding: 3px 10px; border-radius: 12px; }

.action-grid-container { padding: 16px; }
.action-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

.action-card {
  background: #ffffff; border-radius: 14px; padding: 10px 4px; display: flex;
  flex-direction: column; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); cursor: pointer;
}
.action-card span { font-size: 0.65rem; font-weight: 600; color: #334155; text-align: center; }

.card-icon { width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
.edit-bg { background: #eff6ff; color: #2563eb; }
.theme-bg { background: #f3e8ff; color: #9333ea; }
.download-bg { background: #ecfdf5; color: #10b981; }
.notify-bg { background: #fff7ed; color: #f97316; }

.settings-container { padding: 0 16px 24px 16px; display: flex; flex-direction: column; gap: 16px; }
.settings-group { background: #ffffff; border-radius: 16px; padding: 12px 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
.group-title { margin: 0 0 10px 0; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.8px; color: #94a3b8; }

.setting-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
.setting-item:last-child { border-bottom: none; }
.item-left { display: flex; align-items: center; gap: 12px; }
.item-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
.theme-ic { background: #f3e8ff; color: #9333ea; }
.lang-ic { background: #e0f2fe; color: #0284c7; }
.bell-ic { background: #fff7ed; color: #ea580c; }
.pdf-ic { background: #eff6ff; color: #1d4ed8; }
.danger-ic { background: #fef2f2; color: #ef4444; }

.item-text { display: flex; flex-direction: column; }
.item-text .title { font-size: 0.82rem; font-weight: 600; color: #1e293b; }
.item-text .sub { font-size: 0.68rem; color: #64748b; }

.color-preview-dot { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 4px rgba(0,0,0,0.2); }
.arrow-ic { font-size: 0.9rem; color: #94a3b8; }
.text-danger { color: #ef4444 !important; }

/* Theme Palette Grid Modal */
.modal-subtext { font-size: 0.78rem; color: #64748b; margin-bottom: 16px; }
.theme-palette-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
.theme-option-card {
  background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 10px;
  display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s ease;
}
.theme-option-card.active { border-color: #0f172a; background: #ffffff; }
.color-circle-preview { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 1rem; }
.color-label { font-size: 0.78rem; font-weight: 600; color: #1e293b; }

.avatar-upload-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 16px; }
.avatar-preview {wood: 80px; width: 80px; height: 80px; border-radius: 50%; background: #f1f5f9; margin-bottom: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.avatar-preview img { width: 100%; height: 100%; object-fit: cover; }
.avatar-placeholder-large { font-size: 1.8rem; font-weight: 700; }
.upload-btn { font-size: 0.75rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; }

.form-group { margin-bottom: 12px; }
.form-group label { display: block; font-size: 0.75rem; font-weight: 600; color: #374151; margin-bottom: 4px; }
.custom-input, .custom-select { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.85rem; outline: none; background: #fff; }
.save-btn { width: 100%; color: #ffffff; border: none; padding: 12px; border-radius: 10px; font-weight: 600; cursor: pointer; margin-top: 8px; }
</style>