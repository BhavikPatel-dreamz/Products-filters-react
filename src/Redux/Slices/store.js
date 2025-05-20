// store.js
import { configureStore } from '@reduxjs/toolkit';
import priceRangeReducer from './PriceRange';

export const store = configureStore({
  reducer: {
    priceRange: priceRangeReducer,
  },
});

export default store;