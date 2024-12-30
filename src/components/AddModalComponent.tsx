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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  closeAddModal,
  hideNewCategory,
  openAddModal,
  resetAddState,
  setAddCategory,
  setAddExpirationDate,
  setAddName,
  setAddNewCategory,
  setAddStock,
  setAddUnitPrice,
  showNewCategory,
} from "../app/addModal/addModalSlice";
import dayjs from "dayjs";

const AddModalComponent: React.FC = () => {
  const addModal = useSelector((state: RootState) => state.addModal.value);
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

  const dispatch = useDispatch();

  const handleCancel = () => {
    dispatch(closeAddModal());
    dispatch(resetAddState());
  };

  const handleSave = () => {
    dispatch(closeAddModal());
    dispatch(resetAddState());
    alert("Se ha guardado el producto");
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
          Add New Product
        </Typography>

        {/* Input para Name */}
        <TextField
          label="Name"
          variant="outlined"
          value={addName}
          onChange={(e) => dispatch(setAddName(e.target.value))}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Select para Category */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={addCategory}
            onChange={(e) => {
              if (e.target.value === "add-new-category") {
                dispatch(showNewCategory());
                dispatch(setAddCategory(e.target.value));
              } else {
                dispatch(hideNewCategory());
                dispatch(setAddCategory(e.target.value));
              }
            }}
          >
            <MenuItem value="test">Test</MenuItem>
            <MenuItem value="test">Test</MenuItem>
            <MenuItem value="add-new-category">Add New Category</MenuItem>
          </Select>
        </FormControl>

        {/* Input para agregar una nueva categoría */}
        {isCategoryOpen && (
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              label="New Category"
              variant="outlined"
              fullWidth
              value={addNewCategory}
              onChange={(e) => dispatch(setAddNewCategory(e.target.value))}
            />
          </Box>
        )}
        {/* Input para Stock */}
        <TextField
          label="Stock"
          variant="outlined"
          type="number"
          fullWidth
          value={addStock}
          onChange={(e) => dispatch(setAddStock(parseInt(e.target.value)))}
          sx={{ mb: 2 }}
        />

        {/* Input para Unit Price */}
        <TextField
          label="Unit Price"
          variant="outlined"
          type="number"
          fullWidth
          value={addUnitPrice}
          onChange={(e) =>
            dispatch(setAddUnitPrice(parseFloat(e.target.value)))
          }
          sx={{ mb: 2 }}
        />

        {/* Input para Expiration Date */}
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
          />
        </LocalizationProvider>

        {/* Botones para Guardar y Cancelar */}
        <Box sx={{ display: "flex", justifyContent: "center" }} gap={5}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ width: "33%", height: "48px" }}
          >
            Save
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
