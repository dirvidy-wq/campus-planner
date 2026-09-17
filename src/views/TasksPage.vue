<template>
  <ion-page>
    <!-- Header ya Juu ya Tarehe -->
    <div class="date-header">
      <div class="day-subtitle">JUMANNE (TUE)</div>
      <div class="date-number">12</div>
      <div class="month-name">TUE</div>
    </div>

    <!-- Sub-navigation: Ratiba / Zingine -->
    <div class="sub-nav">
      <button class="nav-btn active">Ratiba</button>
      <button class="nav-btn">Zingine</button>
    </div>

    <ion-content class="ion-padding custom-content">
      <!-- Time-Slot Grid View -->
      <div class="timeline-container">
        
        <!-- Slot 1 -->
        <div class="time-row">
          <span class="time-label">08:00am</span>
          <div class="event-card red-card">
            <div class="event-time">08:00am - 10:00am</div>
            <div class="event-title">MAB701: Advanced Calculus</div>
          </div>
        </div>

        <!-- Slot 2 -->
        <div class="time-row">
          <span class="time-label">10:30am</span>
          <div class="event-card blue-card">
            <div class="event-time">10:30am - 12:30pm</div>
            <div class="event-title">Independent Study</div>
          </div>
        </div>

        <!-- Slot 3 -->
        <div class="time-row">
          <span class="time-label">12:30pm</span>
          <div class="event-card grey-card">
            <div class="event-time">12:30pm - 02:00pm</div>
            <div class="event-title">LUNCH & RELAX</div>
          </div>
        </div>

        <!-- Slot 4 -->
        <div class="time-row">
          <span class="time-label">02:00pm</span>
          <div class="event-card green-card">
            <div class="event-time">02:00pm - 03:30pm</div>
            <div class="event-title">COH201: World History</div>
          </div>
        </div>

      </div>

      <!-- Bottom Filter Bar (Leo / Kusoma / Kazi) -->
      <div class="filter-bottom-sheet">
        <div class="filter-header">
          <strong>Leo</strong>
          <span class="today-tag">Today</span>
        </div>
        <div class="filter-pills">
          <button class="pill active">Kusoma<br><small>Study</small></button>
          <button class="pill">Kazi<br><small>Work</small></button>
          <button class="pill">Zingine<br><small>Others</small></button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
</script>

<style scoped>
/* Red Top Date Header */
.date-header {
  background: #c8102e;
  color: #ffffff;
  padding: 16px 20px 8px 20px;
}

.day-subtitle {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.date-number {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  margin: 4px 0;
}

.month-name {
  font-size: 0.85rem;
  font-weight: 700;
}

/* Sub Nav Tabs */
.sub-nav {
  display: flex;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.nav-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  font-weight: 700;
  color: #6b7280;
  cursor: pointer;
}

.nav-btn.active {
  color: #c8102e;
  border-bottom: 2px solid #c8102e;
}

.custom-content {
  --background: #ffffff;
}

/* Timeline Cards */
.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 120px;
}

.time-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.time-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #374151;
  width: 55px;
  padding-top: 6px;
}

.event-card {
  flex: 1;
  border-radius: 12px;
  padding: 12px 14px;
  color: #ffffff;
}

.event-time {
  font-size: 0.75rem;
  opacity: 0.9;
  margin-bottom: 2px;
}

.event-title {
  font-size: 0.9rem;
  font-weight: 700;
}

/* Color Themes for Slots */
.red-card { background: #c8102e; }
.blue-card { background: #2563eb; }
.grey-card { background: #9ca3af; }
.green-card { background: #16a34a; }

/* Filter Bottom Sheet */
.filter-bottom-sheet {
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 14px 20px;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.08);
  z-index: 10;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.today-tag {
  color: #6b7280;
  font-size: 0.8rem;
}

.filter-pills {
  display: flex;
  gap: 10px;
}

.pill {
  flex: 1;
  background: #f3f4f6;
  border: none;
  border-radius: 12px;
  padding: 8px;
  font-weight: 700;
  font-size: 0.8rem;
  color: #374151;
  cursor: pointer;
}

.pill small {
  font-weight: 400;
  color: #6b7280;
}

.pill.active {
  background: #fef2f2;
  color: #c8102e;
  border: 1px solid #fecaca;
}
</style>