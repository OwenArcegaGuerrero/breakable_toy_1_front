import { createSlice } from "@reduxjs/toolkit";
import { Product } from "../../types/Product";
import dayjs from "dayjs";

interface Products {
  currentProducts: Product[];
}

const initialState: Products = {
  currentProducts: [
    {
      id: 1,
      name: "Manzana",
      category: "Fruta",
      unitPrice: 10,
      expirationDate: dayjs("2025-01-07"),
      quantityInStock: 11,
    },
    {
      id: 2,
      name: "Pera",
      category: "Fruta",
      unitPrice: 10,
      expirationDate: dayjs("2025-01-10"),
      quantityInStock: 10,
    },
    {
      id: 3,
      name: "Pera",
      category: "Snack",
      unitPrice: 10,
      expirationDate: dayjs("2025-10-01"),
      quantityInStock: 4,
    },
    {
      id: 4,
      name: "Pera",
      category: "Snack",
      unitPrice: 15,
      expirationDate: dayjs("2025-12-11"),
      quantityInStock: 10,
    },
    {
      id: 5,
      name: "Pera",
      category: "Snack",
      unitPrice: 10,
      expirationDate: dayjs("2025-12-11"),
      quantityInStock: 20,
    },
  ],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
});

export default productsSlice.reducer;
