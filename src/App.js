import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerMenu from "./screens/CustomerMenu";
import AdminMenu from "./screens/AdminMenu";
import NoPage from "./screens/NoPage";
import ImageManager from "./screens/ImageManager";
import OrdersList from "./screens/OrdersList";
import ManagersView from "./screens/ManagersView";
import Login from "./screens/Login";
import Reports from "./screens/Reports";
import ShoppingCart from "./screens/ShoppingCart";
import Welcome from "./screens/Welcome";
import Supervisor from "./screens/Supervisor";
import Admin from "./screens/Admin";
import AdminReports from "./screens/adminReports";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Welcome />} />
          <Route path="/hm/:tableId" element={<CustomerMenu />} />
          <Route path="/menu" element={<CustomerMenu />} />
          {/* <Route path="/admin" element={<AdminMenu />} /> */}
          <Route path="/ImageManager" element={<ImageManager />} />
          <Route path="/OrdersList" element={<OrdersList />} />
          <Route path="/ManagersList" element={<ManagersView />} />
          <Route path="/Supervisor" element={<Supervisor />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/AdminReports" element={<AdminReports />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/ShoppingCart" element={<ShoppingCart />} />
          <Route path="/Login" element={<Login />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
