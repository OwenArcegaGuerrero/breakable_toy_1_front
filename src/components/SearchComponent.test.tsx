import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import SearchComponent from "./SearchComponent";
import searchNameReducer from "../app/searchName/searchNameSlice";
import searchCategoriesReducer from "../app/searchCategories/searchCategoriesSlice";
import searchAvailabilityReducer from "../app/searchAvailability/searchAvailabilitySlice";

interface Product {
  id?: number;
  name: string;
  category: string;
  unitPrice: string | number;
  expirationDate: string | null;
  quantityInStock: number | string;
  creationDate?: string;
  updateDate?: string | null;
}

const productsReducer = (
  state = {
    currentProducts: [
      {
        id: 1,
        name: "Product 1",
        category: "Category 1",
        unitPrice: 10.99,
        expirationDate: "2024-12-31",
        quantityInStock: 100,
        creationDate: "2024-01-01",
        updateDate: null,
      },
      {
        id: 2,
        name: "Product 2",
        category: "Category 2",
        unitPrice: 20.5,
        expirationDate: null,
        quantityInStock: 0,
        creationDate: "2024-01-02",
        updateDate: null,
      },
    ] as Product[],
    isSearching: false,
  },
  action: any
) => {
  switch (action.type) {
    case "products/setIsSearching":
      return { ...state, isSearching: action.payload };
    case "products/setSearchedProducts":
      return { ...state, currentProducts: action.payload };
    case "products/getAllProducts":
      return { ...state, isSearching: false };
    default:
      return state;
  }
};

const initialState = {
  products: {
    currentProducts: [
      {
        id: 1,
        name: "Product 1",
        category: "Category 1",
        unitPrice: 10.99,
        expirationDate: "2024-12-31",
        quantityInStock: 100,
        creationDate: "2024-01-01",
        uodateDate: null,
      },
      {
        id: 2,
        name: "Product 2",
        category: "Category 2",
        unitPrice: 20.5,
        expirationDate: null,
        quantityInStock: 0,
        creationDate: "2024-01-02",
        updateDate: null,
      },
    ] as Product[],
    isSearching: false,
  },
  searchName: {
    value: "",
  },
  searchCategories: {
    value: [],
  },
  searchAvailability: {
    value: "",
  },
};

const createTestStore = (preloadedState = initialState) => {
  return configureStore({
    reducer: {
      products: productsReducer,
      searchName: searchNameReducer,
      searchCategories: searchCategoriesReducer,
      searchAvailability: searchAvailabilityReducer,
    },
    preloadedState,
  });
};

global.fetch = vi.fn();

describe("SearchComponent", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
  });

  it("validates name input length", () => {
    render(
      <Provider store={store}>
        <SearchComponent />
      </Provider>
    );

    const nameInput = screen.getByLabelText("Name");
    const longName = "a".repeat(121);

    fireEvent.change(nameInput, { target: { value: longName } });

    expect(
      screen.getByText("Name must be less than 121 characteres")
    ).toBeTruthy();
  });

  it("updates search name in store", () => {
    render(
      <Provider store={store}>
        <SearchComponent />
      </Provider>
    );

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "test product" } });

    expect(store.getState().searchName.value).toBe("test product");
  });

  it("performs search with correct URL when search button is clicked", async () => {
    const mockResponse = { json: () => Promise.resolve([]) };
    vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

    render(
      <Provider store={store}>
        <SearchComponent />
      </Provider>
    );

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "test" } });

    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/http:\/\/localhost:9090\/products\?.*name=test/)
    );
  });

  it("resets search when no filters are applied", () => {
    render(
      <Provider store={store}>
        <SearchComponent />
      </Provider>
    );
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    const state = store.getState();
    expect(state.products.isSearching).toBe(false);
  });
});
