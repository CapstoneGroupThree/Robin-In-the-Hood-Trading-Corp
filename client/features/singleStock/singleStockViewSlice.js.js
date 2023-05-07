import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//works without date check
export const fetchSingleStockInfo = createAsyncThunk(
  "fetchSingleStockInfoByTicker",
  async ({ ticker }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/proxy/rde/ticker-details?ticker=${ticker}`
      );
      console.log(response);
      return response.data.results;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

// works without date check
export const fetchSingleStockNews = createAsyncThunk(
  "fetchSingleStockNews",
  async ({ ticker }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/proxy/rde//ticker-news?ticker=${ticker}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

//todo this needs date check
export const fetchSingleStockTickerPriceInfo = createAsyncThunk(
  "fetchSingleStockTickerPriceInfo",
  async ({ ticker, marketOpen, from, to }) => {
    // console.log(ticker, marketOpen, from, to);
    // console.log(typeof marketOpen);
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
    builder.addCase(fetchSingleStockInfo.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(
      fetchSingleStockTickerPriceInfo.fulfilled,
      (state, action) => {
        return action.payload;
      }
    );
    builder.addCase(fetchSingleStockNews.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectSingleStock = (state) => state.singleStock;

export default singleStockViewSlice.reducer;