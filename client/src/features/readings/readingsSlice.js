import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  latest: {
    rf_level: null,
    rf_rssi: null,
    optical_level: null,
    audio_level: null,
  },
  activeLink: 'NONE', // 'RF' | 'OPTICAL' | 'HYBRID' | 'NONE'
  connected: false,
};

export const readingsSlice = createSlice({
  name: 'readings',
  initialState,
  reducers: {
    setReading: (state, action) => {
      const { channel, value } = action.payload;
      if (channel in state.latest) {
        state.latest[channel] = value;
      }
    },
    setAllReadings: (state, action) => {
      state.latest = { ...state.latest, ...action.payload };
    },
    setActiveLink: (state, action) => {
      state.activeLink = action.payload;
    },
    setConnected: (state, action) => {
      state.connected = Boolean(action.payload);
    },
  },
});

export const { setReading, setAllReadings, setActiveLink, setConnected } = readingsSlice.actions;

export const selectLatestReadings = (state) => state.readings.latest;
export const selectActiveLink = (state) => state.readings.activeLink;
export const selectIsConnected = (state) => state.readings.connected;

export default readingsSlice.reducer;
