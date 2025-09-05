import { Routes, Route } from "react-router";
import "./App.css";
// import components here
import Narbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import VehicleDetails from "./components/vechileComponents/VehicleDetails.tsx";
// import pages here
import Home from "./pages/Home.tsx";
import Vendor from "./pages/Vendor.tsx";
import Vehicles from "./pages/Vehicles.tsx";

function App() {
  return (
    <div>
      <div className="flex flex-col md:flex-row">
        <Narbar />
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="vendors" element={<Vendor />} />
          {/* VEHICLES ROUTES */}
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
