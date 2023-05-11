import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const TOKEN = "token";

export const me = createAsyncThunk("auth/me", async () => {
  const token = window.localStorage.getItem(TOKEN);
  try {
    if (token) {
      const res = await axios.get("/auth/me", {
        headers: {
          Authorization: token,
        },
      });
      return res.data;
    } else {
      return {};
    }
  } catch (err) {
    if (err.response.data) {
      // eslint-disable-next-line no-undef
      return thunkAPI.rejectWithValue(err.response.data);
    } else {
      return "There was an issue with your request.";
    }
  }
});

export const authenticate = createAsyncThunk(
  "auth/authenticate",
  async ({ email, password, method, first_name, last_name }, thunkAPI) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await axios.post(`/auth/${method}`, {
        email,
        password,
        first_name,
        last_name,
      });
      window.localStorage.setItem(TOKEN, res.data.token);
      thunkAPI.dispatch(me());
    } catch (err) {
      throw err;
    }
  }
);

export const editUserProfileInfo = createAsyncThunk(
  "editUserInfo",
  async ({ id, first_name, last_name, email }) => {
    const token = window.localStorage.getItem(TOKEN);
    try {
      if (token) {
        const res = await axios.put(
          `http://localhost:8080/api/users/${id}`,
          { first_name, last_name, email },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        return res.data;
      }
    } catch (error) {
      console.log(error);
      return "Please input the correct previous password";
    }
  }
);

export const editUserPassword = createAsyncThunk(
  "editUserPassword",
  async ({ id, oldPassword, newPassword }) => {
    const token = window.localStorage.getItem(TOKEN);
    try {
      const res = await axios.put(
        `http://localhost:8080/api/users/password/${id}`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      return res.data;
    } catch (error) {
      if (error.response.data) {
        // eslint-disable-next-line no-undef
        return thunkAPI.rejectWithValue(err.response.data);
      } else {
        return "There was an issue with your request.";
      }
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    me: {},
    error: null,
    errorMessage: null,
  },
  reducers: {
    logout(state, action) {
      window.localStorage.removeItem(TOKEN);
      state.me = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(me.fulfilled, (state, action) => {
      state.me = action.payload;
    });
    builder.addCase(me.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(authenticate.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(editUserProfileInfo.fulfilled, (state, action) => {
      state.me = action.payload;
    });
    builder.addCase(editUserPassword.fulfilled, (state, action) => {
      state.me = action.payload;
    });
    builder.addCase(editUserPassword.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});

export const { logout } = authSlice.actions;
export const selectUser = (state) => {
  return state.auth;
};

export default authSlice.reducer;
