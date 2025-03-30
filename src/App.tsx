import { Box } from "@mui/material";
import { Search } from "./features/products/components/Search";
import { NewProduct } from "./features/products/components/NewProduct";
import { DataTable } from "./features/products/components/DataTable";
import { GlobalStyle } from "./styles/GlobalStyle";

function App() {
  return (
    <Box sx={{ padding: "2rem" }}>
      <Search />
      <NewProduct />
      <DataTable />
    </Box>
  );
}

export default App;
