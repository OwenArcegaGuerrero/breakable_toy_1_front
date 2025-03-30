import { RootState } from "../../../app/store";

export const selectProducts = (state: RootState) =>
  state.products.currentProducts;
export const selectTotalElements = (state: RootState) =>
  state.products.totalElements;
export const selectIsSearching = (state: RootState) =>
  state.products.isSearching;
export const selectSearchedProducts = (state: RootState) =>
  state.products.searchedProducts;
