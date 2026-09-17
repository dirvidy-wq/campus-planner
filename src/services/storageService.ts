import { Storage } from '@ionic/storage';

const store = new Storage();
let isInitialized = false;

export const initStorage = async () => {
  if (!isInitialized) {
    await store.create();
    isInitialized = true;
  }
};

// Hifadhi vipindi
export const saveClassesToStorage = async (classes: any[]) => {
  await initStorage();
  await store.set('user_classes', JSON.stringify(classes));
};

// Soma vipindi
export const getClassesFromStorage = async (): Promise<any[]> => {
  await initStorage();
  const data = await store.get('user_classes');
  return data ? JSON.parse(data) : [];
};