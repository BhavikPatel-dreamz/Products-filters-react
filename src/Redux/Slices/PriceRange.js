import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  min: null,
  max: null,
  displayMin: null,
  displayMax: null,
};

const priceRangeSlice = createSlice({
  name: 'priceRange',
  initialState,
  reducers: {
    setRange: (state, action) => {
      state.min = action.payload.min;
      state.max = action.payload.max;
    },
    setDisplayRange: (state, action) => {
      state.displayMin = action.payload.min;
      state.displayMax = action.payload.max;
    },
    resetRange: (state) => {
      state.min = null;
      state.max = null;
      state.displayMin = null;
      state.displayMax = null;
    },
  },
});

export const { setRange, setDisplayRange, resetRange } = priceRangeSlice.actions;

export const selectPriceRange = (state) => ({
  min: state.priceRange.min,
  max: state.priceRange.max,
});

export const selectDisplayRange = (state) => ({
  min: state.priceRange.displayMin,
  max: state.priceRange.displayMax,
});

export default priceRangeSlice.reducer;
