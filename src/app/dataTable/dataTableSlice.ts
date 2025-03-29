import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/Product";

/**
 * Interface representing the state of the data table
 * @interface dataTableState
 */
interface dataTableState {
  headers: string[];
  currentHoveredHeader: string | null;
  rows: Product[];
  arrowPosition: "up" | "down";
  sorting: boolean;
  isEditing: boolean;
  updateProductId: number | string;
  selectedProducts: number[];
  isUpdatingStock: boolean;
  stockUpdateError: string | null;
}

/**
 * Initial state for the data table
 */
const initialState: dataTableState = {
  headers: ["Name", "Category", "Price", "Expiration Date", "Stock"],
  currentHoveredHeader: "",
  rows: [],
  arrowPosition: "up",
  sorting: false,
  isEditing: false,
  updateProductId: "",
  selectedProducts: [],
  isUpdatingStock: false,
  stockUpdateError: null,
};

/**
 * Data table slice for managing table state
 */
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
    // New reducers for checkbox functionality
    toggleProductSelection: (state, action: PayloadAction<number>) => {
      const index = state.selectedProducts.indexOf(action.payload);
      if (index === -1) {
        state.selectedProducts.push(action.payload);
      } else {
        state.selectedProducts.splice(index, 1);
      }
    },
    setSelectedProducts: (state, action: PayloadAction<number[]>) => {
      state.selectedProducts = action.payload;
    },
    clearSelectedProducts: (state) => {
      state.selectedProducts = [];
    },
    setIsUpdatingStock: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingStock = action.payload;
    },
    setStockUpdateError: (state, action: PayloadAction<string | null>) => {
      state.stockUpdateError = action.payload;
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
  toggleProductSelection,
  setSelectedProducts,
  clearSelectedProducts,
  setIsUpdatingStock,
  setStockUpdateError,
} = dataTableSlice.actions;

export default dataTableSlice.reducer;
