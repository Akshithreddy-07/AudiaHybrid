import { configureStore } from '@reduxjs/toolkit';
import uiReducer, { applyThemeToDOM } from '../features/ui/uiSlice';
import authReducer from '../features/auth/authSlice';
import readingsReducer from '../features/readings/readingsSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    readings: readingsReducer,
  },
});

// Subscribe to store updates for UI preferences to ensure DOM is always synchronized
let previousUiState = store.getState().ui;
store.subscribe(() => {
  const currentUiState = store.getState().ui;
  if (
    currentUiState.theme !== previousUiState.theme ||
    currentUiState.highContrast !== previousUiState.highContrast ||
    currentUiState.largeText !== previousUiState.largeText
  ) {
    applyThemeToDOM(currentUiState);
    previousUiState = currentUiState;
  }
});

export default store;
