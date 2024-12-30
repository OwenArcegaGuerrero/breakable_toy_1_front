import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface searchCategoriesState {
  value: string | string[];
}

const initialState: searchCategoriesState = {
  value: [],
};

const searchCategoriesSlice = createSlice({
  name: "searchCategories",
  initialState,
  reducers: {
    setSearchCategories: (state, action: PayloadAction<string | string[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setSearchCategories } = searchCategoriesSlice.actions;
export default searchCategoriesSlice.reducer;
