<template>
  <ion-page>
    <ion-content class="ion-padding login-content" :style="{ '--ion-background-color': themeColor }">
      <div class="login-container">
        
        <!-- Logo au Kichwa cha App -->
        <div class="app-brand">
          <div class="brand-icon-box">
            <ion-icon :icon="schoolOutline" class="brand-icon"></ion-icon>
          </div>
          <h1>Campus Planner</h1>
          <p>Weka taarifa zako ili tuanze safari ya ratiba yako</p>
        </div>

        <!-- Fomu ya Taarifa za Awali -->
        <div class="form-card">
          <form @submit.prevent="saveProfile">
            
            <div class="input-group">
              <label>Jina Kamili</label>
              <div class="input-field">
                <ion-icon :icon="personOutline"></ion-icon>
                <input type="text" v-model="formData.name" placeholder="Mf. David Baruti" required />
              </div>
            </div>

            <div class="input-group">
              <label>Chuo Unachosoma</label>
              <div class="input-field">
                <ion-icon :icon="businessOutline"></ion-icon>
                <input type="text" v-model="formData.university" placeholder="Mf. UDSM / IFM / IAA" required />
              </div>
            </div>

            <div class="input-group">
              <label>Course / Programu Unayosoma</label>
              <div class="input-field">
                <ion-icon :icon="bookOutline"></ion-icon>
                <input type="text" v-model="formData.course" placeholder="Mf. Computer Science" required />
              </div>
            </div>

            <div class="input-group">
              <label>Namba ya Simu</label>
              <div class="input-field">
                <ion-icon :icon="callOutline"></ion-icon>
                <input type="tel" v-model="formData.phone" placeholder="Mf. 0712345678" required />
              </div>
            </div>

            <button type="submit" class="submit-btn" :style="{ background: themeColor }">
              Anza Kutumia App
            </button>
          </form>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonIcon } from '@ionic/vue';
import { schoolOutline, personOutline, businessOutline, bookOutline, callOutline } from 'ionicons/icons';

const router = useRouter();
const themeColor = ref('#c8102e');

const formData = ref({
  name: '',
  university: '',
  course: '',
  phone: ''
});

onMounted(() => {
  const savedColor = localStorage.getItem('app_theme_color');
  if (savedColor) themeColor.value = savedColor;

  // Kama tayari ana profile, ruka fomu hii mpeleke moja kwa moja Home
  const existingProfile = localStorage.getItem('user_profile');
  if (existingProfile) {
    router.replace('/home');
  }
});

const saveProfile = () => {
  if (!formData.value.name || !formData.value.university) {
    alert('Tafadhali jaza taarifa zako muhimu.');
    return;
  }

  try {
    // Hifadhi taarifa kwenye LocalStorage
    localStorage.setItem('user_profile', JSON.stringify(formData.value));
    
    // Nenda moja kwa moja kwenye ukurasa wa Home
    router.replace('/home');
  } catch (error) {
    console.error('Hitilafu:', error);
    alert('Imeshindwa kuhifadhi taarifa.');
  }
};
</script>

<style scoped>
.login-content {
  --background: #c8102e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 10px;
}

.app-brand {
  text-align: center;
  color: #ffffff;
  margin-bottom: 24px;
}

.brand-icon-box {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px auto;
  backdrop-filter: blur(10px);
}

.brand-icon {
  font-size: 2rem;
  color: #ffffff;
}

.app-brand h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.app-brand p {
  font-size: 0.8rem;
  opacity: 0.9;
  margin: 4px 0 0 0;
}

.form-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.input-group {
  margin-bottom: 14px;
}

.input-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 5px;
}

.input-field {
  data-input: true;
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  gap: 10px;
}

.input-field ion-icon {
  color: #9ca3af;
  font-size: 1.1rem;
}

.input-field input {
  width: 100%;
  background: transparent;
  border: none;
  padding: 11px 0;
  font-size: 0.88rem;
  color: #1f2937;
  outline: none;
}

.submit-btn {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>