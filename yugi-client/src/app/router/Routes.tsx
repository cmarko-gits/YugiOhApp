import { createBrowserRouter } from "react-router-dom";
import App from "../../../App";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import CardPage from "../pages/Card/CardPage";
import CardsPage from "../pages/Card/CardsPage";
import DeckBuilderPage from "../pages/Deck/DeckBuilderPage";
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
      { path: "cards", element: <CardsPage /> }, 
      { path: "/card/:id", element: <CardPage/>},
      { path: "deck" , element:<DeckBuilderPage/>}
    ]

  },
]);

export default router;
