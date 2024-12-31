import { configureStore } from "@reduxjs/toolkit";
import searchNameReducer from "./searchName/searchNameSlice";
import searchCategoriesReducer from "./searchCategories/searchCategoriesSlice";
import searchAvailabilityReducer from "./searchAvailability/searchAvailabilitySlice";
import addModalReducer from "./addModal/addModalSlice";
import dataTableReducer from "./dataTable/dataTableSlice";
import productsReducer from "./products/productsSlice";

export const store = configureStore({
  reducer: {
    searchName: searchNameReducer,
    searchCategories: searchCategoriesReducer,
    searchAvailability: searchAvailabilityReducer,
    addModal: addModalReducer,
    dataTable: dataTableReducer,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["addModal/setAddExpirationDate"],
        ignoredPaths: ["products", "addModal"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
