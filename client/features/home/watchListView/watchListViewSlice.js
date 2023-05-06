import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchEntireWatchList = createAsyncThunk(
  "fetchEntireWatchList",
  async (id) => {
    try {
      const watchlist = await axios.get(
        `http://localhost:8080/proxy/watchlist/${id}`
      );
      return watchlist.data;
    } catch (error) {
      console.log(error);
    }
  }
);

//todo post and put routes for add delete feature

export const fetchWLSingleStockName = createAsyncThunk(
  "fetchWLStockNameByTicker",
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

export const fetchWLSingleStockTickerPrice = createAsyncThunk(
  "fetchWLStockTickerPrice",
  async ({ ticker, marketOpen, from, to }) => {
    try {
      if (marketOpen) {
        const response = await axios.get(
          `http://localhost:8080/proxy/mde/aggregates?ticker=${ticker}&from=${from}&to=${to}`
        );
        return { ticker, close: response.data.close };
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

export const watchlistStocksViewSlice = createSlice({
  name: "watchlist",
  initialState: {
    watchlist: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWLSingleStockName.fulfilled, (state, action) => {
      const ticker = action.payload.ticker;
      if (!state.watchlist[ticker]) {
        state.watchlist[ticker] = {};
      }
      //make sure its loaded or things can look wonky
      state.watchlist[ticker].name = action.payload.results.name;
      if (state.watchlist[ticker].close !== undefined) {
        state.watchlist[ticker].isLoaded = true;
      }
    });
    builder.addCase(
      fetchWLSingleStockTickerPrice.fulfilled,
      (state, action) => {
        const ticker = action.payload.ticker;
        if (!state.watchlist[ticker]) {
          state.watchlist[ticker] = {};
        }
        state.watchlist[ticker].close = action.payload.close;
        if (state.watchlist[ticker].name !== undefined) {
          state.watchlist[ticker].isLoaded = true;
        }
      }
    );
  },
});

export const selectWatchList = (state) => state.watchlistStocksView.watchlist;

export default watchlistStocksViewSlice.reducer;
