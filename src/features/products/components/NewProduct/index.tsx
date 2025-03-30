import { Box, Button } from "@mui/material";
import React from "react";
import { AddModal } from "../AddModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import {
  closeAddModal,
  openAddModal,
} from "../../../../app/addModal/addModalSlice";

export const NewProduct: React.FC = () => {
  const addModal = useSelector((state: RootState) => state.addModal.value);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    addModal ? dispatch(closeAddModal()) : dispatch(openAddModal());
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <Button
        variant="contained"
        color="success"
        sx={{
          height: "48px",
          fontWeight: "bold",
          textTransform: "none",
          minWidth: "150px",
        }}
        onClick={handleSubmit}
      >
        New Product
      </Button>
      {addModal && <AddModal />}
    </Box>
  );
};
