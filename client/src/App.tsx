import { Routes, Route } from "react-router";
import "./App.css";
// import pages here
import Home from "./pages/Home.tsx";
import Vendor from "./pages/Vendor.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="vendors" element={<Vendor />} />
    </Routes>
  );
}

export default App;
