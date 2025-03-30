import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddModalState {
  value: boolean;
  addName: string;
  addCategory: string;
  addNewCategory: string;
  isNewCategoryOpen: boolean;
  addStock: number | string;
  addUnitPrice: number | string;
  addExpirationDate: string | null;
}

const initialState: AddModalState = {
  value: false,
  addName: "",
  addCategory: "",
  addNewCategory: "",
  isNewCategoryOpen: false,
  addStock: "",
  addUnitPrice: "",
  addExpirationDate: null,
};

const addModalSlice = createSlice({
  name: "addModal",
  initialState,
  reducers: {
    openAddModal: (state) => {
      state.value = true;
    },
    closeAddModal: (state) => {
      state.value = false;
    },
    showNewCategory: (state) => {
      state.isNewCategoryOpen = true;
    },
    hideNewCategory: (state) => {
      state.isNewCategoryOpen = false;
    },
    setAddName: (state, action: PayloadAction<string>) => {
      state.addName = action.payload;
    },
    setAddCategory: (state, action: PayloadAction<string>) => {
      state.addCategory = action.payload;
    },
    setAddNewCategory: (state, action: PayloadAction<string>) => {
      state.addNewCategory = action.payload;
    },
    setAddStock: (state, action: PayloadAction<number | string>) => {
      state.addStock = action.payload;
    },
    setAddUnitPrice: (state, action: PayloadAction<number | string>) => {
      state.addUnitPrice = action.payload;
    },
    setAddExpirationDate: (state, action: PayloadAction<string | null>) => {
      state.addExpirationDate = action.payload;
    },
    resetAddState: (state) => {
      return initialState;
    },
  },
});

export const {
  openAddModal,
  closeAddModal,
  showNewCategory,
  hideNewCategory,
  setAddName,
  setAddCategory,
  setAddNewCategory,
  setAddStock,
  setAddUnitPrice,
  setAddExpirationDate,
  resetAddState,
} = addModalSlice.actions;

export default addModalSlice.reducer;
