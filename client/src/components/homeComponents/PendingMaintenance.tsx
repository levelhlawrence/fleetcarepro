import { IoTime } from "react-icons/io5";

export default function PendingMaintenance({ stats }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500 group hover:bg-orange-50 hover:cursor-pointer hover:border-orange-600 transition  hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700 mb-1">
            Pending Maintenance
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.pendingMaintenance}
          </p>
        </div>
        <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition">
          <IoTime
            className="text-orange-600 group-hover:text-orange-700"
            size={24}
          />
        </div>
      </div>
    </div>
  );
}
