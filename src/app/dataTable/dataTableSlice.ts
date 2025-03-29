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
  selectedProducts: Set<number>;
  isUpdatingStock: boolean;
}

const initialState: dataTableState = {
  headers: ["Name", "Category", "Price", "Expiration Date", "Stock"],
  currentHoveredHeader: "",
  rows: [],
  arrowPosition: "up",
  sorting: false,
  isEditing: false,
  updateProductId: "",
  selectedProducts: new Set(),
  isUpdatingStock: false,
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
    setSelectedProducts: (state, action: PayloadAction<number[]>) => {
      state.selectedProducts = new Set(action.payload);
    },
    toggleProductSelection: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      if (state.selectedProducts.has(productId)) {
        state.selectedProducts.delete(productId);
      } else {
        state.selectedProducts.add(productId);
      }
    },
    clearSelectedProducts: (state) => {
      state.selectedProducts.clear();
    },
    setIsUpdatingStock: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingStock = action.payload;
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
  setSelectedProducts,
  toggleProductSelection,
  clearSelectedProducts,
  setIsUpdatingStock,
} = dataTableSlice.actions;

export default dataTableSlice.reducer;
