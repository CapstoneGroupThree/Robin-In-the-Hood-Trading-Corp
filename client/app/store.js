import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import authReducer from "../features/auth/authSlice";
import allStocksReducer from "../features/allStocks/allStocksSlice";
import singleStockViewSliceReducer from "../features/singleStock/singleStockViewSlice.js";
import popularStocksViewSliceReducer from "../features/home/popularStockView/popularStockViewSlice";
import watchlistStocksViewSliceReducer from "../features/home/watchListView/watchListViewSlice";
import portfolioBuySellSliceReducer from "../features/singleStock/portfolioBuySellSlice";
import portfolioSliceReducer from "../features/portfolio/portfolioSlice";
import transactionSliceReducer from "../features/portfolio/transactionSlice";
import searchResultsSliceReducer from "../features/searchBar/searchSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    allStocks: allStocksReducer,
    singleStockView: singleStockViewSliceReducer,
    popularStocksView: popularStocksViewSliceReducer,
    watchlistStocksView: watchlistStocksViewSliceReducer,
    portfolioBuySellStock: portfolioBuySellSliceReducer,
    portfolio: portfolioSliceReducer,
    transactions: transactionSliceReducer,
    searchResults: searchResultsSliceReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
export * from "../features/auth/authSlice";
