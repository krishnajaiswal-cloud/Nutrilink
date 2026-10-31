const STORAGE_KEY = 'nutrilink-demo-state-v1';

export const loadDemoState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Unable to read saved demo state.', error);
    return {};
  }
};

export const saveDemoState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Unable to save demo state.', error);
  }
};
