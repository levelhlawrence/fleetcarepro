import { FaRegNewspaper } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { IoSearchOutline } from "react-icons/io5";
import { apiClient } from "../../utils/api";

interface Vehicle {
  bus_no: string;
  body_make?: string;
  body_model?: string;
  body_year?: string;
  veh_make?: string;
  assigned_shop?: string;
}

interface ShowVehiclesProps {
  vehicles: Vehicle[];
  nextPage: string | null;
  prevPage: string | null;
  count: number | null;
  getVehicles: (url: string) => void;
  isLoading?: boolean;
  isSearchActive?: boolean;
}

export default function ShowVehicles({
  vehicles,
  nextPage,
  prevPage,
  getVehicles,
  isLoading = false,
  isSearchActive = false,
}: ShowVehiclesProps) {
  const navigate = useNavigate();

  // open vehicle page by ID on click
  const vechPageRedirect = async (busNo: string) => {
    try {
      const response = await apiClient.get(`/vehicles/${busNo}`);
      const data = response.data;
      navigate(`${busNo}`, { state: { bus: data } });
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  };

  // render search results
  return (
    <aside className="border border-emerald-600 rounded-tl-md rounded-tr-md mb-18">
      <table className="table-auto w-full">
        <thead className="bg-emerald-800">
          <tr>
            <th className="text-white px-4 py-3 text-sm font-bold">
              Vehicle No.
            </th>
            <th className="text-white px-4 py-3 text-sm font-bold">Make</th>
            <th className="text-white px-4 py-3 text-sm font-bold">Model</th>
            <th className="text-white px-4 py-3 text-sm font-bold">Year</th>
            <th className="text-white px-4 py-3 text-sm font-bold">Location</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="py-8 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-emerald-600"></div>
                  Loading vehicles...
                </div>
              </td>
            </tr>
          ) : vehicles && vehicles.length > 0 ? (
            vehicles.map((veh) => (
              <tr
                onClick={() => vechPageRedirect(veh.bus_no)}
                key={veh.bus_no}
                id={veh.bus_no}
                className="text-center text-sm border-t border-emerald-600 hover:cursor-pointer hover:bg-emerald-50 transition-colors"
              >
                <td className="py-2 px-4">
                  <div className="flex justify-center items-center gap-2">
                    <FaRegNewspaper className="p-0" />
                    <span>{veh.bus_no || "N/A"}</span>
                  </div>
                </td>
                <td className="py-2 px-4">
                  {veh.body_make || veh.veh_make || "N/A"}
                </td>
                <td className="py-2 px-4">{veh.body_model || "N/A"}</td>
                <td className="py-2 px-4">{veh.body_year || "N/A"}</td>
                <td className="py-2 px-4">{veh.assigned_shop || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-8 text-center">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <IoSearchOutline size={24} />
                  <span>
                    {isSearchActive
                      ? "No vehicles found matching your search criteria"
                      : "No vehicles available"}
                  </span>
                  {isSearchActive && (
                    <span className="text-sm">
                      Try adjusting your search filters
                    </span>
                  )}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between p-4 text-white border-t border-emerald-600">
        <button
          onClick={() => prevPage && !isLoading && getVehicles(prevPage)}
          disabled={!prevPage || isLoading}
          className={`flex items-center p-2 rounded transition ${
            !prevPage || isLoading
              ? "bg-gray-500 text-gray-200 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 hover:cursor-pointer"
          }`}
        >
          <GrFormPrevious size={24} />
          <span className="text-sm ml-1">Prev</span>
        </button>

        <button
          onClick={() => nextPage && !isLoading && getVehicles(nextPage)}
          disabled={!nextPage || isLoading}
          className={`flex items-center p-2 rounded transition ${
            !nextPage || isLoading
              ? "bg-gray-500 text-gray-200 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 hover:cursor-pointer"
          }`}
        >
          <span className="text-sm mr-1">Next</span>
          <MdOutlineNavigateNext size={24} />
        </button>
      </div>
    </aside>
  );
}
