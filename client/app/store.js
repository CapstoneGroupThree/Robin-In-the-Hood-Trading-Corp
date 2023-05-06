import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import authReducer from "../features/auth/authSlice";
import singleStockViewSliceReducer from "../features/singleStock/singleStockSearchSlice";
import popularStocksViewSliceReducer from "../features/home/popularStockView/popularStockViewSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    singleStockView: singleStockViewSliceReducer,
    popularStocksView: popularStocksViewSliceReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
export * from "../features/auth/authSlice";
