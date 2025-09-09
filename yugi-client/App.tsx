import { Outlet, useLocation } from "react-router-dom";
import './App.css';
import Header from "./src/app/layout/Header";

const App = () => {
  const location = useLocation();

  // Sakrij Header samo na GamePage
  const hideHeader = location.pathname === "/game";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!hideHeader && <Header />}
      <div style={{ flex: 1 }}>
        <Outlet /> {/* Tu se renderuju sve child rute */}
      </div>
    </div>
  );
};

export default App;
