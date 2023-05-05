import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSingleStockName = createAsyncThunk(
  "fetchStockNameByTicker",
  async (ticker) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/proxy/ticker-details?ticker=${ticker}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

export const fetchSingleStockTickerPrice = createAsyncThunk(
  "fetchStockTickerPrice",
  async (ticker) => {}
);

export const singleStockViewSlice = createSlice({
  name: "singleStock",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSingleStockName.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectSingleStock = (state) => state.stock;

export default singleStockViewSlice.reducer;
