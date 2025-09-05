import { createBrowserRouter } from "react-router-dom";
import App from "../../../App";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import CardsPage from "../pages/Card/CardsPage";
import ErrorPage from "../pages/Error/ErrorPage";
import HomePage from "../pages/Home/HomePage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,           // Layout
    errorElement: <ErrorPage />, // Greška za nepostojeće rute
    children: [
      { index: true, element: <HomePage /> },
      { path: "Register", element: <RegisterPage /> },  // sada je direktno /Register
      { path: "Login", element: <LoginPage /> },        // direktno /Login
         { path: "cards", element: <CardsPage /> }, // /cards
 ]

  },
]);

export default router;
