import ShowVehicles from "../components/vechileComponents/showVehicles";
import TotalVechs from "../components/vechileComponents/TotalVechs";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const getVehicles = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/vehicles?limit=20"
      );
      const data = response.data;
      setVehicles(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVehicles();
  }, []);

  return (
    <div className="min-h-screen w-full px-8">
      <h2 className="text-2xl font-semibold mt-8">Fleet Overview</h2>
      <TotalVechs vehicles={vehicles} />
      <ShowVehicles vehicles={vehicles} />
    </div>
  );
}
