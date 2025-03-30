import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataTableState {
  selectedProducts: number[];
  isEditing: boolean;
  updateProductId: number | null;
  isUpdatingStock: boolean;
  stockUpdateError: string | null;
}

const initialState: DataTableState = {
  selectedProducts: [],
  isEditing: false,
  updateProductId: null,
  isUpdatingStock: false,
  stockUpdateError: null,
};

const dataTableSlice = createSlice({
  name: "dataTable",
  initialState,
  reducers: {
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
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setUpdateProductId: (state, action: PayloadAction<number | null>) => {
      state.updateProductId = action.payload;
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
  toggleProductSelection,
  setSelectedProducts,
  clearSelectedProducts,
  setIsEditing,
  setUpdateProductId,
  setIsUpdatingStock,
  setStockUpdateError,
} = dataTableSlice.actions;

export default dataTableSlice.reducer;
