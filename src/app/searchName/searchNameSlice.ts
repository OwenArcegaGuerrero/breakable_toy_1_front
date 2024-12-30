import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface searchNameState {
  value: string;
}

const initialState: searchNameState = {
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
