<template>
  <ion-app>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

     <ion-tab-bar slot="bottom" class="custom-tab-bar">
  <ion-tab-button tab="home" href="/home" :style="{ '--color-selected': themeColor }">
    <ion-icon :icon="homeOutline" />
    <ion-label>Home</ion-label>
  </ion-tab-button>

  <ion-tab-button tab="calendar" href="/calendar" :style="{ '--color-selected': themeColor }">
    <ion-icon :icon="calendarOutline" />
    <ion-label>Calender</ion-label>
  </ion-tab-button>

  <ion-tab-button tab="profile" href="/profile" :style="{ '--color-selected': themeColor }">
    <ion-icon :icon="personOutline" />
    <ion-label>Profile</ion-label>
  </ion-tab-button>
</ion-tab-bar>
    </ion-tabs>
  </ion-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  IonApp, 
  IonTabs, 
  IonTabBar, 
  IonTabButton, 
  IonIcon, 
  IonLabel, 
  IonRouterOutlet 
} from '@ionic/vue';
import { homeOutline, calendarOutline, personOutline } from 'ionicons/icons';

const themeColor = ref('#c8102e'); // Default color

const loadTheme = () => {
  const savedColor = localStorage.getItem('app_theme_color');
  if (savedColor) {
    themeColor.value = savedColor;
  }
};

onMounted(() => {
  loadTheme();
  window.addEventListener('theme-changed', loadTheme);
});

onUnmounted(() => {
  window.removeEventListener('theme-changed', loadTheme);
});
</script>

<style scoped>
.custom-tab-bar {
  --background: #ffffff;
  --border-color: #e5e7eb;
  height: 60px;
}

ion-tab-button {
  --color: #6b7280;
}
</style>