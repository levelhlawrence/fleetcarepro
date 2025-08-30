import { FaRegNewspaper } from "react-icons/fa6";
import { useNavigate } from "react-router";
import axios from "axios";

export default function ShowVehicles({ vehicles }) {
  const navigate = useNavigate();

  const vechPageRedirect = async (busNo) => {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/vehicles/${busNo}`
    );
    const data = response.data;
    console.log(data);
    navigate(`${busNo}`, { state: { bus: data } });
  };

  return (
    <aside className="border border-emerald-600 rounded-md">
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-emerald-700">
            <th className="text-white px-4 py-2 text-sm font-bold text-gray-600">
              Vehicle No.
            </th>
            <th className="text-white px-4 py-2 text-sm font-bold text-gray-600">
              Make
            </th>
            <th className="text-white px-4 py-2 text-sm font-bold text-gray-600">
              Model
            </th>
            <th className="text-white px-4 py-2 text-sm font-bold text-gray-600">
              Year
            </th>
          </tr>
        </thead>
        <tbody>
          {vehicles &&
            vehicles?.results?.map((veh) => {
              return (
                <tr
                  onClick={() => vechPageRedirect(veh.bus_no)}
                  key={veh.bus_no}
                  id={veh.bus_no}
                  className="text-center text-sm border-t border-emerald-600 hover:cursor-pointer hover:bg-emerald-50"
                >
                  <td className="py-2 flex justify-center gap-2">
                    <FaRegNewspaper className="p-0" />
                    {veh.bus_no || "Blank"}
                  </td>
                  <td>{veh.body_make || "Blank"}</td>
                  <td>{veh.body_model || "Blank"}</td>
                  <td>{veh.body_year || "Blank"}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </aside>
  );
}
