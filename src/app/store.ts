import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/store/productsSlice";
import dataTableReducer from "./dataTable/dataTableSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    dataTable: dataTableReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
