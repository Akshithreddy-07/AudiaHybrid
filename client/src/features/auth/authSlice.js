import { createSlice } from '@reduxjs/toolkit';

// Load stored session if present
const getInitialAuth = () => {
  if (typeof window === 'undefined') return { user: null, token: null };
  try {
    const savedUser = localStorage.getItem('audia_user');
    const savedToken = localStorage.getItem('audia_token');
    if (savedUser && savedToken) {
      return { user: JSON.parse(savedUser), token: savedToken };
    }
  } catch {
    // Ignore JSON parse errors
  }
  return { user: null, token: null };
};

const initialAuth = getInitialAuth();

const initialState = {
  user: initialAuth.user,
  token: initialAuth.token,
  status: 'idle',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.status = 'succeeded';
      if (typeof window !== 'undefined') {
        localStorage.setItem('audia_user', JSON.stringify(user));
        localStorage.setItem('audia_token', token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      if (typeof window !== 'undefined') {
        localStorage.removeItem('audia_user');
        localStorage.removeItem('audia_token');
      }
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token && state.auth.user);
export const selectRole = (state) => state.auth.user?.role || null;
export const selectAuthStatus = (state) => state.auth.status;

export default authSlice.reducer;
