import { configureStore } from "@reduxjs/toolkit";
import searchNameReducer from "./searchName/searchNameSlice";
import searchCategoriesReducer from "./searchCategories/searchCategoriesSlice";
import searchAvailabilityReducer from "./searchAvailability/searchAvailabilitySlice";
import addModalReducer from "./addModal/addModalSlice";

export const store = configureStore({
  reducer: {
    searchName: searchNameReducer,
    searchCategories: searchCategoriesReducer,
    searchAvailability: searchAvailabilityReducer,
    addModal: addModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
