import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchNameState {
  value: string;
}

const initialState: SearchNameState = {
  value: "",
};

const searchNameSlice = createSlice({
  name: "searchName",
  initialState,
  reducers: {
    setSearchName: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setSearchName } = searchNameSlice.actions;
export default searchNameSlice.reducer;
