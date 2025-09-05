import ShowVehicles from "../components/vechileComponents/showVehicles";
import TotalVechs from "../components/vechileComponents/TotalVechs";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehCount, setVehCount] = useState<number | null>(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);

  const getVehicles = async (
    url: string = import.meta.env.VITE_VEHICLE_API
  ) => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      setVehicles(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setVehCount(data.count);
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
      <TotalVechs count={vehCount} />
      <ShowVehicles
        vehicles={vehicles}
        nextPage={nextPage}
        prevPage={prevPage}
        count={vehCount}
        getVehicles={getVehicles}
      />
    </div>
  );
}
