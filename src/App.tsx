import React from "react";
import SearchComponent from "./components/SearchComponent";
import NewProductComponent from "./components/NewProductComponent";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const App: React.FC = () => {
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
      </div>
    </ThemeProvider>
  );
};

export default App;
