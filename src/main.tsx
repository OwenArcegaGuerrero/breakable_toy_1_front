import { StrictMode } from "react";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import App from "./App.tsx";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
