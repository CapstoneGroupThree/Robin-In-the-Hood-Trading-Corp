import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchTransactions = createAsyncThunk(
  "fetchTransactions",
  async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/transactions/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectTransactions = (state) => state.transactions;

export default transactionsSlice.reducer;
