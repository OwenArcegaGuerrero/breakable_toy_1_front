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
import { AppDispatch, RootState } from "../app/store";
import { setSearchName } from "../app/searchName/searchNameSlice";
import { setSearchCategories } from "../app/searchCategories/searchCategoriesSlice";
import { setSearchAvailability } from "../app/searchAvailability/searchAvailabilitySlice";
import {
  getAllProducts,
  setIsSearching,
  setSearchedProducts,
} from "../app/products/productsSlice";

const SearchComponent: React.FC = () => {
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
  const dispatch = useDispatch<AppDispatch>();

  const [nameError, setNameError] = useState<string | null>(null);

  const availabilityOptions = ["All", "In stock", "Out of stock"];

  const validateName = (name: string) => {
    if (name.length > 120) {
      setNameError("Name must be less than 121 characteres");
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
    let uri = "http://localhost:9090/products?";
    uri += searchName != "" ? "&name=" + searchName : "";
    uri += searchCategories != "" ? "&category=" + searchCategories : "";
    uri +=
      searchAvailability != "" ? "&availability=" + searchAvailability : "";
    const products = await fetch(uri)
      .then((response) => response.json())
      .then((data) => data);
    dispatch(setSearchedProducts(products));
    dispatch(setIsSearching(true));
  };

  const handleSubmit = () => {
    if (
      searchName === "" &&
      searchCategories.length === 0 &&
      searchAvailability === ""
    ) {
      dispatch(getAllProducts());
      dispatch(setIsSearching(false));
    } else {
      sendSearch();
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{
        width: "100vw",
        maxWidth: "1600px",
        margin: "2% auto",
        padding: 2,
        border: "1px solid black",
        borderRadius: 2,
      }}
    >
      <Box display={"flex"} gap={2}>
        <TextField
          label="Name"
          value={searchName}
          onChange={(e) => handleNameChange(e.target.value)}
          error={!!nameError}
          helperText={nameError || ""}
          variant="outlined"
          fullWidth
          sx={{ flex: 0.5 }}
        />
      </Box>
      <Box display={"flex"} gap={2}>
        <FormControl sx={{ width: "30%" }}>
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
      <Box
        display={"flex"}
        gap={2}
        justifyContent={"space-between"}
        sx={{ width: "50%" }}
      >
        <FormControl sx={{ width: "60%" }}>
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
          sx={{ height: "48px", width: "20%" }}
          onClick={handleSubmit}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
};

export default SearchComponent;
