import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../app/store";
import { setSearchName } from "../../store/searchNameSlice";
import { setSearchCategories } from "../../store/searchCategoriesSlice";
import { setSearchAvailability } from "../../store/searchAvailabilitySlice";
import {
  getAllProducts,
  setIsSearching,
  setSearchedProducts,
} from "../../store/productsSlice";
import { ENDPOINTS } from "../../../../config/api";

export const Search: React.FC = () => {
  const products = useSelector(
    (state: RootState) => state.products.currentProducts
  );
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );
  const searchName = useSelector((state: RootState) => state.searchName.value);
  const searchCategories = useSelector(
    (state: RootState) => state.searchCategories.value
  );
  const searchAvailability = useSelector(
    (state: RootState) => state.searchAvailability.value
  );
  const currentPage = useSelector(
    (state: RootState) => state.products.currentPage
  );
  const pageSize = useSelector((state: RootState) => state.products.pageSize);
  const dispatch = useDispatch<AppDispatch>();

  const [nameError, setNameError] = useState<string | null>(null);

  const availabilityOptions = ["All", "In stock", "Out of stock"];

  const validateName = (name: string) => {
    if (name.length > 120) {
      setNameError("Name must be less than 121 characters");
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleNameChange = (name: string) => {
    if (validateName(name)) {
      dispatch(setSearchName(name));
    }
  };

  const sendSearch = async () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      size: pageSize.toString(),
    });

    if (searchName) {
      params.append("name", searchName);
    }
    if (searchCategories.length > 0) {
      searchCategories.forEach((category) => {
        params.append("category", category);
      });
    }
    if (searchAvailability && searchAvailability !== "All") {
      params.append("availability", searchAvailability);
    }

    try {
      const response = await fetch(
        `${ENDPOINTS.PRODUCTS.BASE}?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to search products");
      }
      const data = await response.json();
      dispatch(setSearchedProducts(data.content || []));
      dispatch(setIsSearching(true));
    } catch (error) {
      console.error("Error searching products:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleSubmit = () => {
    if (
      !searchName &&
      searchCategories.length === 0 &&
      (!searchAvailability || searchAvailability === "All")
    ) {
      dispatch(getAllProducts({ page: currentPage, size: pageSize }));
      dispatch(setIsSearching(false));
    } else {
      sendSearch();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        margin: "2rem auto",
        padding: "1.5rem",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Name"
          value={searchName}
          onChange={(e) => handleNameChange(e.target.value)}
          error={!!nameError}
          helperText={nameError || ""}
          variant="outlined"
          fullWidth
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            multiple
            value={searchCategories}
            onChange={(e) => dispatch(setSearchCategories(e.target.value))}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <FormControl sx={{ width: "50%" }}>
          <InputLabel>Availability</InputLabel>
          <Select
            value={searchAvailability}
            onChange={(e) => dispatch(setSearchAvailability(e.target.value))}
            label="Availability"
          >
            {availabilityOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ height: "56px", minWidth: "120px" }}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
};
