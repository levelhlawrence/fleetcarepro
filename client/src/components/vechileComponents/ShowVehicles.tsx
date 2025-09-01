import { FaRegNewspaper } from "react-icons/fa6";
import { useNavigate } from "react-router";
import axios from "axios";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

import { useEffect } from "react";

export default function ShowVehicles({
  vehicles,
  nextPage,
  prevPage,
  getVehicles,
  setVehNumber,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    getVehicles();
  }, []);

  // open vehicle page on click
  const vechPageRedirect = async (busNo) => {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/vehicles/${busNo}`
    );
    const data = response.data;
    console.log(data);
    navigate(`${busNo}`, { state: { bus: data } });
  };

  // render search results

  return (
    <aside className="border border-emerald-600 rounded-tl-md rounded-tr-md mb-18">
      <table className="table-auto w-full">
        <thead className="bg-green-800">
          <tr>
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
            vehicles?.map((veh) => {
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
      <div className="flex justify-between p-4 text-white border-t border-emerald-600">
        <button
          onClick={() => prevPage && getVehicles(prevPage)}
          className={`hover:cursor-pointer hover:bg-emerald-700 bg-emerald-600 flex items-center p-2 rounded transition ${
            !prevPage && "bg-gray-500 text-gray-200 hover:hover:bg-gray-500"
          }`}
        >
          <GrFormPrevious size={24} /> <p className="text-sm">Prev</p>
        </button>

        <button
          onClick={() => nextPage && getVehicles(nextPage)}
          className={`hover:cursor-pointer hover:bg-emerald-700 bg-emerald-600 flex items-center p-2 rounded transition ${
            !nextPage && "bg-gray-500 text-gray-200 hover:hover:bg-gray-500"
          }`}
        >
          <p className="text-sm">Next</p>
          <MdOutlineNavigateNext size={24} />
        </button>
      </div>
    </aside>
  );
}
