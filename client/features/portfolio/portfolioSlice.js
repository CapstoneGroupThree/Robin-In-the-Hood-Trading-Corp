import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//Fetch Portfolio
export const fetchSinglePortfolio = createAsyncThunk(
  "singlePortfolio",
  async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/portfolio/${id}`
      );
      console.log("Fetch Portfolio Redux Response:", response);
      return response.data.portfolio;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

export const portfolioSlice = createSlice({
  name: "singlePortfolio",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSinglePortfolio.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectSinglePortfolio = (state) => state.portfolio;

export default portfolioSlice.reducer;
