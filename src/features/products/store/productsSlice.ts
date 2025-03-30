import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Product } from "../../../types/Product";
import { PageResponse } from "../../../types/Pagination";

interface ProductsState {
  currentProducts: Product[];
  searchedProducts: Product[];
  isSearching: boolean;
  totalElements: number;
}

const initialState: ProductsState = {
  currentProducts: [],
  searchedProducts: [],
  isSearching: false,
  totalElements: 0,
};

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async ({
    page = 0,
    sortBy = null,
    sortOrder = "asc",
  }: {
    page?: number;
    sortBy?: string | null;
    sortOrder?: "asc" | "desc";
  }) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (sortBy) {
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);
    }

    const response = await fetch(
      `http://localhost:9090/products?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json() as Promise<PageResponse<Product>>;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchedProducts: (state, action) => {
      state.searchedProducts = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    setCurrentProducts: (state, action) => {
      state.currentProducts = action.payload.content;
      state.totalElements = action.payload.totalElements;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.currentProducts = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        console.error("Failed to fetch products:", action.error);
      });
  },
});

export const { setSearchedProducts, setIsSearching, setCurrentProducts } =
  productsSlice.actions;

export default productsSlice.reducer;
