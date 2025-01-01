import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/Product";

interface Products {
  currentProducts: Product[];
  searchedProducts: Product[];
  isSearching: boolean;
}

const initialState: Products = {
  currentProducts: [],
  searchedProducts: [],
  isSearching: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.currentProducts = action.payload;
    },
    setSearchedProducts: (state, action: PayloadAction<Product[]>) => {
      state.searchedProducts = action.payload;
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getAllProducts.fulfilled,
      (state, action: PayloadAction<Product[]>) => {
        state.currentProducts = action.payload;
      }
    );
  },
});

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async () => {
    const data = await fetch("http://localhost:9090/products")
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    return data;
  }
);

export const { setProducts, setSearchedProducts, setIsSearching } =
  productsSlice.actions;
export default productsSlice.reducer;
