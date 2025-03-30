import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/store/productsSlice";
import dataTableReducer from "../features/products/store/dataTableSlice";
import addModalReducer from "../features/products/store/addModalSlice";
import searchNameReducer from "../features/products/store/searchNameSlice";
import searchCategoriesReducer from "../features/products/store/searchCategoriesSlice";
import searchAvailabilityReducer from "../features/products/store/searchAvailabilitySlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    dataTable: dataTableReducer,
    addModal: addModalReducer,
    searchName: searchNameReducer,
    searchCategories: searchCategoriesReducer,
    searchAvailability: searchAvailabilityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
