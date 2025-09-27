import { IoWarning } from "react-icons/io5";

export default function VehiclesDown({ stats }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-600 group hover:shadow-medium transition hover:bg-red-50 hover:cursor-pointer hover:border-red-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700 mb-1">
            Vehicles Down
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.vehiclesDown}
          </p>
        </div>
        <div className="p-3 bg-red-100 group-hover:bg-red-200 rounded-full transition">
          <IoWarning
            className="text-red-600 group-hover:text-red-700 transition"
            size={24}
          />
        </div>
      </div>
    </div>
  );
}
