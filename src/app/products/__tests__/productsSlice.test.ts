import { describe, it, expect, vi } from "vitest";
import productsReducer, {
  setSearchedProducts,
  setIsSearching,
  setCurrentProducts,
  getAllProducts,
} from "../productsSlice";
import { Product } from "../../../types/Product";
import { PageResponse } from "../../../types/Pagination";

describe("Products Slice", () => {
  const initialState = {
    currentProducts: [],
    searchedProducts: [],
    isSearching: false,
    totalElements: 0,
  };

  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Product 1",
      category: "Category 1",
      unitPrice: 10.99,
      quantityInStock: 5,
      expirationDate: "2024-12-31",
    },
  ];

  const mockPageResponse: PageResponse<Product> = {
    content: mockProducts,
    page: 0,
    size: 10,
    totalElements: 1,
  };

  it("should handle initial state", () => {
    expect(productsReducer(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });

  it("should handle setSearchedProducts", () => {
    const actual = productsReducer(
      initialState,
      setSearchedProducts(mockProducts)
    );
    expect(actual.searchedProducts).toEqual(mockProducts);
  });

  it("should handle setIsSearching", () => {
    const actual = productsReducer(initialState, setIsSearching(true));
    expect(actual.isSearching).toBe(true);
  });

  it("should handle setCurrentProducts", () => {
    const actual = productsReducer(
      initialState,
      setCurrentProducts(mockPageResponse)
    );
    expect(actual.currentProducts).toEqual(mockProducts);
    expect(actual.totalElements).toBe(1);
  });

  it("should handle getAllProducts.fulfilled", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPageResponse),
    });
    global.fetch = mockFetch;

    const thunk = getAllProducts();
    const dispatch = vi.fn();
    const getState = vi.fn();

    await thunk(dispatch, getState, undefined);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("http://localhost:9090/products")
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "products/getAllProducts/fulfilled",
        payload: mockPageResponse,
      })
    );
  });

  it("should handle getAllProducts.rejected", async () => {
    const mockError = new Error("Failed to fetch");
    const mockFetch = vi.fn().mockRejectedValue(mockError);
    global.fetch = mockFetch;

    const thunk = getAllProducts();
    const dispatch = vi.fn();
    const getState = vi.fn();

    await expect(thunk(dispatch, getState, undefined)).rejects.toThrow(
      "Failed to fetch"
    );

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("http://localhost:9090/products")
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "products/getAllProducts/rejected",
        error: expect.any(Error),
      })
    );
  });
});
