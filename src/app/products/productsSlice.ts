import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/Product";
import { PageResponse } from "../../types/Pagination";

interface Products {
  currentProducts: Product[];
  searchedProducts: Product[];
  isSearching: boolean;
  totalElements: number;
}

const initialState: Products = {
  currentProducts: [],
  searchedProducts: [],
  isSearching: false,
  totalElements: 0,
};

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async () => {
    const response = await fetch("http://localhost:9090/products");
    return response.json();
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchedProducts: (state, action: PayloadAction<Product[]>) => {
      state.searchedProducts = action.payload;
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setCurrentProducts: (
      state,
      action: PayloadAction<PageResponse<Product>>
    ) => {
      state.currentProducts = action.payload.content;
      state.totalElements = action.payload.totalElements;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.currentProducts = action.payload;
    });
  },
});

export const { setSearchedProducts, setIsSearching, setCurrentProducts } =
  productsSlice.actions;

export default productsSlice.reducer;
