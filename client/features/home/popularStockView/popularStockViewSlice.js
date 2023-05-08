import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSinglePopularStockName = createAsyncThunk(
  "fetchPopStockNameByTicker",
  async (ticker) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/proxy/rde/ticker-details?ticker=${ticker}`
      );
      return { ticker, results: response.data.results };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

export const fetchSinglePopularStockTickerPrice = createAsyncThunk(
  "fetchPopStockTickerPrice",
  async ({ ticker, marketOpen, from, to }) => {
    try {
      if (marketOpen) {
        const response = await axios.get(
          `http://localhost:8080/proxy/mde/aggregates?ticker=${ticker}&from=${from}&to=${to}`
        );
        return { ticker, close: response.data.results[0].c };
      } else if (!marketOpen) {
        const response = await axios.get(
          `http://localhost:8080/proxy/mde/open-close?ticker=${ticker}&date=${to}`
        );
        return { ticker, close: response.data.close };
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

export const popularStocksViewSlice = createSlice({
  name: "popularStocksView",
  initialState: {
    stocks: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSinglePopularStockName.fulfilled, (state, action) => {
      const ticker = action.payload.ticker;
      if (!state.stocks[ticker]) {
        state.stocks[ticker] = {};
      }
      //make sure its loaded or things can look wonky
      state.stocks[ticker].name = action.payload.results.name;
      if (state.stocks[ticker].close !== undefined) {
        state.stocks[ticker].isLoaded = true;
      }
    });
    builder.addCase(
      fetchSinglePopularStockTickerPrice.fulfilled,
      (state, action) => {
        const ticker = action.payload.ticker;
        if (!state.stocks[ticker]) {
          state.stocks[ticker] = {};
        }
        state.stocks[ticker].close = action.payload.close;
        if (state.stocks[ticker].name !== undefined) {
          state.stocks[ticker].isLoaded = true;
        }
      }
    );
  },
});

export const selectSinglePopularStock = (state) =>
  state.popularStocksView.stocks;

export default popularStocksViewSlice.reducer;
