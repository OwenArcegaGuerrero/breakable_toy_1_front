import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface searchAvailabilityState {
  value: string | string[];
}

const initialState: searchAvailabilityState = {
  value: "",
};

const searchAvailabilitySlice = createSlice({
  name: "searchAvailability",
  initialState,
  reducers: {
    setSearchAvailability: (
      state,
      action: PayloadAction<string | string[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSearchAvailability } = searchAvailabilitySlice.actions;
export default searchAvailabilitySlice.reducer;
