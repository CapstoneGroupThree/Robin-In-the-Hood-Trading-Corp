import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSearchResults = createAsyncThunk(
  "fetchSearchResults",
  async ({ symbol }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/ticker/${symbol}`
      );
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue({ status: "failed", error: err.message });
    }
  }
);

export const searchResultsSlice = createSlice({
  name: "searchResults",
  initialState: {
    status: "idle",
    data: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSearchResults.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(fetchSearchResults.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    });
  },
});

export const selectSearchResults = (state) => {
  return state.searchResults;
};

export default searchResultsSlice.reducer;
