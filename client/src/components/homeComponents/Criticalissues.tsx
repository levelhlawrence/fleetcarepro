import { FaExclamationTriangle } from "react-icons/fa";

export default function CriticalIssues({ stats }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500 hover:border-red-600 group hover:cursor-pointer hover:shadow-md transition hover:bg-red-50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700 mb-1">
            Critical Issues
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.criticalIssues}
          </p>
        </div>
        <div className="p-3 bg-red-100 group-hover:bg-red-200 transition rounded-full">
          <FaExclamationTriangle
            className="text-red-600 group-hover:text-red-700"
            size={24}
          />
        </div>
      </div>
    </div>
  );
}
