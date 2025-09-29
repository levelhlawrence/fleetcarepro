import { Routes, Route } from "react-router";
import "./App.css";
// import components here
import Narbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import VehicleDetails from "./components/vechileComponents/VehicleDetails.tsx";
import Login from "./components/auth/Login.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
// import pages here
import Home from "./pages/Home.tsx";
import Vendor from "./pages/Vendor.tsx";
import Vehicles from "./pages/Vehicles.tsx";
import WorkOrders from "./pages/WorkOrders.tsx";
import WorkOrderStatus from "./pages/WorkOrderStatus.tsx";
// import auth context
import { useAuth } from "./contexts/AuthContext.tsx";

function App() {
  const { state } = useAuth();

  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex flex-col md:flex-row">
                <Narbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/vendors" element={<Vendor />} />
                  {/* VEHICLES ROUTES */}
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/vehicles/:id" element={<VehicleDetails />} />
                  {/* WORK ORDERS ROUTES */}
                  <Route path="/workorders" element={<WorkOrders />} />
                  <Route path="/workorders/status/:status" element={<WorkOrderStatus />} />
                </Routes>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Only show footer for authenticated users */}
      {state.isAuthenticated && <Footer />}
    </div>
  );
}

export default App;
