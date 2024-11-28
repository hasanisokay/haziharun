import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import themeSlice from './slices/themeSlice';

export const makeStore = (preloadedState={}) =>
  configureStore({
    reducer: {
      user: authSlice,
      theme: themeSlice
    },
    preloadedState, // Optional initial state
  });

export const store = makeStore(); // Default store for the client

export default store;
