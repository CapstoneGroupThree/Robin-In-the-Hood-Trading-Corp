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
  async (ticker) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const to = `${year}-${month}-${day}`;

    // Adjust the date object to Eastern Time
    const estOffset = -5 * 60; // Eastern Time is UTC-5
    const utcOffset = -now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() + estOffset - utcOffset);

    const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Market is open on weekdays between 9:30 AM and 4:00 PM Eastern Time
    const marketOpen =
      dayOfWeek >= 1 &&
      dayOfWeek <= 5 &&
      (hour > 9 || (hour === 9 && minute >= 30)) &&
      hour < 16;

    const from = to;
    try {
      if (marketOpen) {
        const response = await axios.get(
          `http://localhost:8080/proxy/mde/aggregates?ticker=${ticker}&from=${from}&to=${to}`
        );
        return response.data;
      } else {
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
