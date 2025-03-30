import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchCategoriesState {
  value: string[];
}

const initialState: SearchCategoriesState = {
  value: [],
};

const searchCategoriesSlice = createSlice({
  name: "searchCategories",
  initialState,
  reducers: {
    setSearchCategories: (state, action: PayloadAction<string[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setSearchCategories } = searchCategoriesSlice.actions;
export default searchCategoriesSlice.reducer;
