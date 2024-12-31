import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/Product";

interface dataTableState {
  headers: string[];
  currentHoveredHeader: string | null;
  rows: Product[];
  arrowPosition: "up" | "down";
  sorting: boolean;
}

const initialState: dataTableState = {
  headers: ["Name", "Category", "Price", "Expiration Date", "Stock"],
  currentHoveredHeader: "",
  rows: [],
  arrowPosition: "up",
  sorting: false,
};

const dataTableSlice = createSlice({
  name: "dataTable",
  initialState,
  reducers: {
    setCurrentHoveredHeader: (state, action: PayloadAction<string>) => {
      state.currentHoveredHeader = action.payload;
    },
    setRows: (state, action: PayloadAction<Product[]>) => {
      state.rows = action.payload;
    },
    setArrowPosition: (state, action: PayloadAction<"up" | "down">) => {
      state.arrowPosition = action.payload;
    },
    setSorting: (stat, action: PayloadAction<boolean>) => {
      stat.sorting = action.payload;
    },
  },
});

export const {
  setCurrentHoveredHeader,
  setRows,
  setArrowPosition,
  setSorting,
} = dataTableSlice.actions;
export default dataTableSlice.reducer;
