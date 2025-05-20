import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  min: null,
  max: null,
  displayMin: null,
  displayMax: null
};

export const priceRangeSlice = createSlice({
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
      state.min = initialState.min;
      state.max = initialState.max;
      state.displayMin = initialState.displayMin;
      state.displayMax = initialState.displayMax;
    }
  }
});

export const { setRange, setDisplayRange, resetRange } = priceRangeSlice.actions;

export const selectPriceRange = (state) => ({
  min: state.priceRange.min,
  max: state.priceRange.max
});

export const selectDisplayRange = (state) => ({
  min: state.priceRange.displayMin,
  max: state.priceRange.displayMax
});

export default priceRangeSlice.reducer;