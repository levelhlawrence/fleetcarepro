import { FaBus } from "react-icons/fa";
import { useNavigate } from "react-router";

export default function TotalFleet({ stats }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/vehicles");
  };

  return (
    <div
      onClick={handleClick}
      className="group hover:cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md p-6 border-l-4 border-blue-500 hover:bg-blue-50 transition hover:border-blue-600"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium group-hover:text-gray-700 text-gray-600 mb-1">
            Total Fleet
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalVehicles}
          </p>
        </div>
        <div className="p-3 bg-blue-100 group-hover:bg-blue-200 rounded-full transition">
          <FaBus
            className="text-blue-600 group-hover:text-blue-700 transition"
            size={24}
          />
        </div>
      </div>
    </div>
  );
}
