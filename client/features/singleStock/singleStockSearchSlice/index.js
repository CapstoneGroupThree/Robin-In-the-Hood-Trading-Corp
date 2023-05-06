import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSingleStockName = createAsyncThunk(
  "fetchStockNameByTicker",
  async (ticker) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/proxy/rde/ticker-details?ticker=${ticker}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

export const fetchSingleStockTickerInfo = createAsyncThunk(
  "fetchStockTickerInfo",
  async ({ ticker, marketOpen, from, to }) => {
    console.log(ticker, marketOpen, from, to);
    console.log(typeof marketOpen);
    try {
      if (marketOpen) {
        const response = await axios.get(
          `http://localhost:8080/proxy/mde/aggregates?ticker=${ticker}&from=${from}&to=${to}`
        );
        return response.data;
      } else if (!marketOpen) {
        const response = await axios.get(
          `http://localhost:8080/proxy/mde/open-close?ticker=${ticker}&date=${to}`
        );
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

export const singleStockViewSlice = createSlice({
  name: "singleStock",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSingleStockName.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(fetchSingleStockTickerInfo.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectSingleStock = (state) => state.stock;

export default singleStockViewSlice.reducer;
