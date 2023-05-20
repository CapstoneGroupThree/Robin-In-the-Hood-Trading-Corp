import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllStocks = createAsyncThunk(
  "allStocks/fetchAll",
  async ({ date, page }) => {
    try {
      date = "2023-05-16";
      console.log("Thunk Date:", date, "Thunk Page:", page);
      // todo currently hardcoded to the close on the FE, need to make a seperate thunk for price update functionality, getstockpricethunk
      const response = await axios.get("http://localhost:8080/proxy/mde/all", {
        params: {
          date: date,
          page: page,
        },
      });

      return { results: response.data };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

// Thunk for finding tickers name and market cap
export const fetchAllStockDetails = createAsyncThunk(
  "allStockDetails/fetchAllStockDetails",
  async ({ ticker }) => {
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

export const fetchAllStockTickerPriceSingle = createAsyncThunk(
  "fetchAllStockTickerPriceSingle",
  async ({ ticker, marketOpen, from, to }) => {
    try {
      console.log("sent");
      if (marketOpen) {
        console.log("me?");
        const response = await axios.get(
          `http://localhost:8080/proxy/mde/aggregates?ticker=${ticker}&from=${from}&to=${to}`
        );
        // console.log(response.data);
        return { ticker, close: response.data.results[0].c };
      } else {
        console.log("got");
        const response = await axios.get(
          `http://localhost:8080/proxy/mde/open-close?ticker=${ticker}&date=${to}`
        );
        // console.log(response.data);
        return {
          ticker,
          close: response.data.close,
          preMarket: response.data.preMarket,
        };
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

const allStocksSlice = createSlice({
  name: "allStocks",
  initialState: {
    stocks: [],
    stockDetails: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllStocks.fulfilled, (state, action) => {
      // currently not using this feature state
      state.stocks = action.payload;
    });
    builder.addCase(fetchAllStockDetails.fulfilled, (state, action) => {
      console.log("fetch all stock details fulfilled action:", action);
      // if (!action.payload) return;

      const { ticker, name, marketCapitalization } = action.payload;
      if (!state.stockDetails[ticker]) {
        state.stockDetails[ticker] = {};
      }
      state.stockDetails[ticker].name = name;
      state.stockDetails[ticker].marketCap = marketCapitalization;

      state.stockDetails[ticker].isLoaded = true;
    });
    builder.addCase(
      fetchAllStockTickerPriceSingle.fulfilled,
      (state, action) => {}
    );
  },
});

export const selectAllStocks = (state) => state.allStocks.stocks;

export default allStocksSlice.reducer;
