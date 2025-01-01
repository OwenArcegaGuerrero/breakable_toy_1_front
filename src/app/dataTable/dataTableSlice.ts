import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/Product";

interface dataTableState {
  headers: string[];
  currentHoveredHeader: string | null;
  rows: Product[];
  arrowPosition: "up" | "down";
  sorting: boolean;
  isEditing: boolean;
  updateProductId: number | string;
}

const initialState: dataTableState = {
  headers: ["Name", "Category", "Price", "Expiration Date", "Stock"],
  currentHoveredHeader: "",
  rows: [],
  arrowPosition: "up",
  sorting: false,
  isEditing: false,
  updateProductId: "",
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
    setSorting: (state, action: PayloadAction<boolean>) => {
      state.sorting = action.payload;
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setUpdateProductId: (state, action: PayloadAction<number | string>) => {
      state.updateProductId = action.payload;
    },
  },
});

export const {
  setCurrentHoveredHeader,
  setRows,
  setArrowPosition,
  setSorting,
  setIsEditing,
  setUpdateProductId,
} = dataTableSlice.actions;
export default dataTableSlice.reducer;
