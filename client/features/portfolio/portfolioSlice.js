import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice";
//Fetch Portfolio
export const fetchSinglePortfolio = createAsyncThunk(
  "singlePortfolio",
  async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/portfolio/${id}`
      );
      return response.data.portfolio;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

export const updatePortfolioValuation = createAsyncThunk(
  "updatePortfolioValuation",
  async ({ id, totalValuation }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/totalBalanceHistory/balance/${id}`,
        { newAssetsValue: totalValuation }
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const portfolioSlice = createSlice({
  name: "singlePortfolio",
  initialState: [],
  reducers: {
    resetPortfolio: (state) => {
      return []; // Reset the portfolio state to an empty array
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSinglePortfolio.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(logout, (state) => {
      return []; // Reset the portfolio state to an empty array
    });
  },
});

export const { resetPortfolio } = portfolioSlice.actions;

export const selectSinglePortfolio = (state) => state.portfolio;

export default portfolioSlice.reducer;
