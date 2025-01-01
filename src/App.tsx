import React, { useEffect } from "react";
import SearchComponent from "./components/SearchComponent";
import NewProductComponent from "./components/NewProductComponent";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DataTable from "./components/DataTableComponent";
import ReportTable from "./components/ReportTableComponent";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./app/store";
import { getAllProducts } from "./app/products/productsSlice";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
            overFlowX: "hidden",
          },
        }}
      />
      <div>
        <SearchComponent />
        <NewProductComponent />
        <DataTable />
        <ReportTable />
      </div>
    </ThemeProvider>
  );
};

export default App;
