import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchAvailabilityState {
  value: string;
}

const initialState: SearchAvailabilityState = {
  value: "",
};

const searchAvailabilitySlice = createSlice({
  name: "searchAvailability",
  initialState,
  reducers: {
    setSearchAvailability: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setSearchAvailability } = searchAvailabilitySlice.actions;
export default searchAvailabilitySlice.reducer;
