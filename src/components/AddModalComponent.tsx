import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import {
  closeAddModal,
  hideNewCategory,
  resetAddState,
  setAddCategory,
  setAddExpirationDate,
  setAddName,
  setAddNewCategory,
  setAddStock,
  setAddUnitPrice,
  showNewCategory,
} from "../app/addModal/addModalSlice";
import { Product } from "../types/Product";
import dayjs from "dayjs";
import { getAllProducts } from "../app/products/productsSlice";
import { setIsEditing } from "../app/dataTable/dataTableSlice";

const AddModalComponent: React.FC = () => {
  const products = useSelector(
    (state: RootState) => state.products.currentProducts
  );
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );
  const addName = useSelector((state: RootState) => state.addModal.addName);
  const addCategory = useSelector(
    (state: RootState) => state.addModal.addCategory
  );
  const addNewCategory = useSelector(
    (state: RootState) => state.addModal.addNewCategory
  );
  const addStock = useSelector((state: RootState) => state.addModal.addStock);
  const addUnitPrice = useSelector(
    (state: RootState) => state.addModal.addUnitPrice
  );
  const addExpirationDate = useSelector(
    (state: RootState) => state.addModal.addExpirationDate
  );
  const isCategoryOpen = useSelector(
    (state: RootState) => state.addModal.isNewCategoryOpen
  );
  const isEditing = useSelector(
    (state: RootState) => state.dataTable.isEditing
  );
  const updateProductId = useSelector(
    (state: RootState) => state.dataTable.updateProductId
  );

  const [nameError, setNameError] = useState<string | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [newCategorryError, setNewCategoryError] = useState<string | null>(
    null
  );

  const dispatch = useDispatch<AppDispatch>();

  const validateAddName = (name: string) => {
    if (name.length > 120) {
      setNameError("Name must be less than 121 characteres");
      return false;
    }
    setNameError(null);
    return true;
  };

  const validateAddStock = (stock: number) => {
    if (stock < 0) {
      setStockError("Stock must be a non-negative number");
      return false;
    }
    setStockError(null);
    return true;
  };

  const validateAddPrice = () => {
    setPriceError(null);
    return true;
  };

  const validateNewCategory = (newCategory: string) => {
    if (isCategoryOpen && newCategory === "") {
      setNewCategoryError("Please add a new category");
      return false;
    }
    setNewCategoryError(null);
    return true;
  };

  const handleAddNameChange = (name: string) => {
    if (validateAddName(name)) {
      dispatch(setAddName(name));
    }
  };

  const handleAddStockChange = (stock: number) => {
    if (validateAddStock(stock)) {
      dispatch(setAddStock(stock));
    }
  };

  const handleAddPriceChange = (price: number) => {
    dispatch(setAddUnitPrice(price));
  };

  const handleAddNewCategoryChange = (newCategory: string) => {
    if (validateNewCategory(newCategory)) {
      dispatch(setAddNewCategory(newCategory));
    }
  };

  const saveProduct = async () => {
    console.log("entre");

    if (addName === "") {
      setNameError("Please add a name");
      return false;
    }
    if (addStock === "") {
      setStockError("Please add a stock");
      return false;
    }
    if (addUnitPrice === "") {
      setPriceError("Please add a price");
      return false;
    }
    if (!isCategoryOpen && addCategory === "") {
      setCategoryError("Please add a category");
      return false;
    }

    const product: Product = {
      name: addName,
      category: addNewCategory != "" ? addNewCategory : addCategory,
      unitPrice: addUnitPrice != "" ? addUnitPrice : 0,
      expirationDate: addExpirationDate != null ? addExpirationDate : null,
      quantityInStock: addStock != "" ? addStock : 0,
      creationDate: dayjs().format("YYYY-MM-DD"),
      updateDate: null,
    };
    fetch("http://localhost:9090/products", {
      method: "POST",
      body: JSON.stringify(product),
      headers: {
        "content-type": "application/json",
      },
    }).then((response) => {
      if (response.status == 201) {
        alert("Product added successfully");
        dispatch(getAllProducts());
        dispatch(closeAddModal());
        dispatch(resetAddState());
      } else {
        dispatch(closeAddModal());
        dispatch(resetAddState());
        alert("Error while adding product");
      }
    });
  };

  const updateProduct = async (id: number) => {
    if (addName === "") {
      setNameError("Please add a name");
      return false;
    }
    if (addStock === "" || isNaN(addStock as number)) {
      setStockError("Please add a stock");
      return false;
    }

    if (!isCategoryOpen && addCategory === "") {
      setCategoryError("Please add a category");
      return false;
    }

    const product: Product = {
      name: addName,
      category: addNewCategory != "" ? addNewCategory : addCategory,
      unitPrice: addUnitPrice != "" ? addUnitPrice : 0,
      expirationDate: addExpirationDate != null ? addExpirationDate : null,
      quantityInStock: addStock != "" ? addStock : 0,
      creationDate: dayjs().format("YYYY-MM-DD"),
      updateDate: null,
    };
    fetch("http://localhost:9090/products/update/" + id, {
      method: "PUT",
      body: JSON.stringify(product),
      headers: {
        "content-type": "application/json",
      },
    }).then((result) => {
      if (result.status == 204) {
        alert("Product updated successfully");
        dispatch(getAllProducts());
        dispatch(closeAddModal());
        dispatch(setIsEditing(false));
      } else {
        alert("Error while updating product");
        dispatch(closeAddModal());
        dispatch(setIsEditing(false));
      }
    });
  };

  const handleCancel = () => {
    dispatch(closeAddModal());
    dispatch(resetAddState());
  };

  const handleUpdate = async (id: number) => {
    if (await updateProduct(id)) {
    }
    dispatch(closeAddModal());
    dispatch(setIsEditing(false));
  };

  const handleSave = async () => {
    if (await saveProduct()) {
      dispatch(closeAddModal());
      dispatch(resetAddState());
    }
  };

  return (
    <Modal open onClose={handleCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          border: "2px solid #000",
          borderRadius: "20px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {isEditing ? "Update Product" : "Add New Product"}
        </Typography>
        <TextField
          label="Name"
          variant="outlined"
          value={addName}
          onChange={(e) => handleAddNameChange(e.target.value)}
          error={!!nameError}
          helperText={nameError || ""}
          fullWidth
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }} error={!!categoryError}>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={addCategory}
            onChange={(e) => {
              if (e.target.value === "add-new-category") {
                dispatch(showNewCategory());
                dispatch(setAddCategory(e.target.value));
                setCategoryError(null);
              } else {
                dispatch(hideNewCategory());
                dispatch(setAddCategory(e.target.value));
              }
            }}
            error={!!categoryError}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
            <MenuItem key={"newCategory"} value="add-new-category">
              Add New Category
            </MenuItem>
          </Select>
          {!!categoryError ? (
            <FormHelperText>Please select a category</FormHelperText>
          ) : (
            <></>
          )}
        </FormControl>
        {isCategoryOpen && (
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              label="New Category"
              variant="outlined"
              fullWidth
              value={addNewCategory}
              onChange={(e) => handleAddNewCategoryChange(e.target.value)}
              error={!!newCategorryError}
              helperText={newCategorryError || ""}
            />
          </Box>
        )}
        <TextField
          label="Stock"
          variant="outlined"
          type="number"
          fullWidth
          value={addStock}
          onChange={(e) => handleAddStockChange(parseInt(e.target.value))}
          error={!!stockError}
          helperText={stockError || ""}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Unit Price"
          variant="outlined"
          type="number"
          fullWidth
          value={addUnitPrice}
          onChange={(e) => handleAddPriceChange(Number(e.target.value))}
          error={!!priceError}
          helperText={priceError || ""}
          sx={{ mb: 2 }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Expiration Date"
            sx={{ width: "100%", mb: 2 }}
            value={addExpirationDate ? dayjs(addExpirationDate) : null}
            onChange={(date) => {
              if (date) {
                dispatch(setAddExpirationDate(date.format("YYYY-MM-DD")));
              }
            }}
            format="DD/MM/YYYY"
          />
        </LocalizationProvider>
        <Box sx={{ display: "flex", justifyContent: "center" }} gap={5}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              isEditing
                ? handleUpdate(updateProductId as number)
                : handleSave();
            }}
            sx={{ width: "33%", height: "48px" }}
          >
            {isEditing ? "Update" : "Save"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            sx={{ width: "33%", height: "48px" }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddModalComponent;
