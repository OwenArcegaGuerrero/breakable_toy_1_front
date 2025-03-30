import { Provider } from "react-redux";
import { store } from "./app/store";
import { DataTable } from "./features/products/components/DataTable";
import { GlobalStyle } from "./styles/GlobalStyle";

function App() {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <div className="container">
        <h1>Product Management</h1>
        <DataTable />
      </div>
    </Provider>
  );
}

export default App;
