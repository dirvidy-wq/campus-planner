<template>
  <ion-page>
    <ion-content class="splash-content" :style="{ background: themeColor }">
      <div class="splash-box">
        <div class="spinner-logo">
          <ion-icon :icon="schoolOutline"></ion-icon>
        </div>
        <h2>Campus Planner</h2>
        <p>Karibu tena, {{ userName }}</p>
        <div class="loader-bar">
          <div class="loader-progress"></div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonIcon } from '@ionic/vue';
import { schoolOutline } from 'ionicons/icons';

const router = useRouter();
const themeColor = ref('#c8102e');
const userName = ref('Mwanafunzi');

onMounted(() => {
  const savedColor = localStorage.getItem('app_theme_color');
  if (savedColor) themeColor.value = savedColor;

  const profile = localStorage.getItem('user_profile');
  if (profile) {
    try {
      const parsed = JSON.parse(profile);
      if (parsed.name) userName.value = parsed.name.split(' ')[0]; // Chukua jina la kwanza
    } catch (e) {}
  }

  // Subiri sekunde 2 kisha nenda Home
  setTimeout(() => {
    router.replace('/tabs/home');
  }, 2000);
});
</script>

<style scoped>
.splash-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.splash-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  text-align: center;
  padding: 20px;
  width: 100%;
  height: 100vh;
}

.spinner-logo {
  width: 75px;
  height: 75px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
  animation: pulse 1.5s infinite;
}

.splash-box h2 {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 0.5px;
}

.splash-box p {
  font-size: 0.85rem;
  opacity: 0.85;
  margin: 6px 0 24px 0;
}

.loader-bar {
  width: 120px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.loader-progress {
  width: 100%;
  height: 100%;
  background: #ffffff;
  animation: loading 2s linear infinite;
  transform-origin: left;
}

@keyframes loading {
  0% { transform: scaleX(0); }
  50% { transform: scaleX(0.7); }
  100% { transform: scaleX(1); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
</style>