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

export const fetchSingleStockOpenCloseInfo = createAsyncThunk(
  "fetchSingleStockOpenCloseInfo",
  async ({ ticker, to }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/proxy/mde/open-close?ticker=${ticker}&date=${to}`
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
      console.log(marketOpen);
      console.log(from, to);
      if (marketOpen) {
        const response = await axios.get(
          `http://localhost:8080/proxy/mde/aggregates?ticker=${ticker}&from=${from}&to=${to}`
        );
        console.log(response.data);
        return response.data;
      } else if (!marketOpen) {
        const response = await axios.get(
          `http://localhost:8080/proxy/mde/open-close?ticker=${ticker}&date=${to}`
        );
        console.log(response.data);
        return response.data;
        // {
        //   status: 'OK',
        //   from: '2023-05-09',
        //   symbol: 'ZSL',
        //   open: 16.53,
        //   high: 16.5464,
        //   low: 16.29,
        //   volume: 138300,
        //   preMarket: 16.55
        // }
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

export const singleStockViewSlice = createSlice({
  name: "singleStock",
  initialState: {
    singleStock: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSingleStockInfo.fulfilled, (state, action) => {
      state.singleStock.info = action.payload;
    });
    builder.addCase(
      fetchSingleStockTickerPriceInfo.fulfilled,
      (state, action) => {
        state.singleStock.tickerPriceInfo = action.payload;
      }
    );
    builder.addCase(fetchSingleStockNews.fulfilled, (state, action) => {
      state.singleStock.news = action.payload;
    });
    builder.addCase(
      fetchSingleStockOpenCloseInfo.fulfilled,
      (state, action) => {
        console.log("Action payload:", action.payload);
        state.singleStock.openClose = action.payload;
      }
    );
  },
});

export const selectSingleStock = (state) => state.singleStockView.singleStock;

export default singleStockViewSlice.reducer;
