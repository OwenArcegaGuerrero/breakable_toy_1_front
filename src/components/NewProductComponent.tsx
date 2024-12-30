import { Box, Button } from "@mui/material";
import React from "react";
import AddModalComponent from "./AddModalComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { closeAddModal, openAddModal } from "../app/addModal/addModalSlice";

const NewProductComponent: React.FC = () => {
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
        paddingX: 12,
      }}
    >
      <Button variant="outlined" sx={{ height: "48px" }} onClick={handleSubmit}>
        New Product
      </Button>
      {addModal && <AddModalComponent />}
    </Box>
  );
};

export default NewProductComponent;
