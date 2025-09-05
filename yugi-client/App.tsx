import { Outlet } from "react-router-dom";
import Header from "./src/app/layout/Header";

const App = () => {
  return (
    <div>
      <Header/>
      <Outlet /> {/* Tu se renderuju sve child rute */}
    </div>
  );
};

export default App;
