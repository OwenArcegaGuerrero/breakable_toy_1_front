import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../types/Product";
import { ENDPOINTS } from "../../../config/api";

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
}

interface ProductsState {
  currentProducts: Product[];
  searchedProducts: Product[];
  isSearching: boolean;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  sortBy: string | null;
  sortOrder: "asc" | "desc";
  error: string | null;
  isLoading: boolean;
}

const initialState: ProductsState = {
  currentProducts: [],
  searchedProducts: [],
  isSearching: false,
  totalElements: 0,
  currentPage: 0,
  pageSize: 10,
  sortBy: null,
  sortOrder: "asc",
  error: null,
  isLoading: false,
};

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async ({
    page = 0,
    size = 10,
    sortBy = null,
    sortOrder = "asc",
  }: {
    page?: number;
    size?: number;
    sortBy?: string | null;
    sortOrder?: string;
  }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (sortBy) {
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);
    }

    try {
      const response = await fetch(
        `${ENDPOINTS.PRODUCTS.BASE}?${params.toString()}`
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Invalid response format. Expected JSON but received: " + contentType
        );
      }

      const data = await response.json();

      // Validate the response structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format: Expected an object");
      }

      return {
        content: Array.isArray(data.content) ? data.content : [],
        page: typeof data.page === "number" ? data.page : 0,
        size: typeof data.size === "number" ? data.size : 10,
        totalElements:
          typeof data.totalElements === "number" ? data.totalElements : 0,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }
      throw new Error("Failed to fetch products: Unknown error");
    }
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
      action: PayloadAction<{ products: Product[]; totalElements: number }>
    ) => {
      state.currentProducts = action.payload.products;
      state.totalElements = action.payload.totalElements;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string | null>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.currentProducts = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.size;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
        console.error("Failed to fetch products:", action.error);
      });
  },
});

export const {
  setSearchedProducts,
  setIsSearching,
  setCurrentProducts,
  setCurrentPage,
  setPageSize,
  setSortBy,
  setSortOrder,
  clearError,
} = productsSlice.actions;

export default productsSlice.reducer;
