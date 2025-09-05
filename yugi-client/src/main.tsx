import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import router from "./app/router/Routes";
import { store } from "./app/store/configureStore";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>   {/* ✅ Redux Provider */}
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
