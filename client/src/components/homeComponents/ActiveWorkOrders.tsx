import { FaTools } from "react-icons/fa";
export default function ActiveWorkOrders({ stats }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500 group hover:bg-yellow-50 transition hover:cursor-pointer hover:border-yellow-600 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1 group-hover:text-gray-700 transition">
            Active Work Orders
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.activeWorkOrders}
          </p>
        </div>
        <div className="p-3 bg-yellow-100 rounded-full group-hover:bg-yellow-200 transition">
          <FaTools
            className="text-yellow-600 group-hover:text-yellow-700 transition"
            size={24}
          />
        </div>
      </div>
    </div>
  );
}
