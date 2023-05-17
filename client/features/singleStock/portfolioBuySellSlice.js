import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//todo create a get quantity thunk which runs on start
// todo create a buy thunk
// todo createa sell thunk
// todo send new asset value after price refresh to backend

//used to fetch portfolio items and also balance
export const fetchUserPortfolio = createAsyncThunk(
  "fetchUserPortfolio",
  async ({ userId }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/portfolio/${userId}`
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const buyStockForPortfolio = createAsyncThunk(
  "buyStockForPortfolio",
  async ({ userId, stockTicker, stockName, quantity, purchasePrice }) => {
    const transaction_type = "buy";
    try {
      const response = await axios.post(
        `http://localhost:8080/api/portfolio/transaction`,
        {
          userId,
          stockTicker,
          stockName,
          transaction_type,
          quantity,
          purchasePrice,
        }
      );
      //going to return to use successful or not
      return response;
    } catch (err) {
      console.log(err);
    }
  }
);
export const sellStockForPortfolio = createAsyncThunk(
  "buyStockForPortfolio",
  async ({ userId, stockTicker, stockName, quantity, purchasePrice }) => {
    const transaction_type = "sell";
    try {
      const response = await axios.post(
        `http://localhost:8080/api/portfolio/transaction`,
        {
          userId,
          stockTicker,
          stockName,
          transaction_type,
          quantity,
          purchasePrice,
        }
      );
      //going to return to use successful or not
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const portfolioBuySellSlice = createSlice({
  name: "portfolioBuySell",
  initialState: {},
  reducers: {},
});

export default portfolioBuySellSlice.reducer;
