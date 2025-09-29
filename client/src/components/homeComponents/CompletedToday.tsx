import { IoCheckmarkCircle } from "react-icons/io5";
import { useNavigate } from "react-router";

export default function CompletedToday({ stats }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/workorders/status/completed");
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500 group hover:shadow-md transition-shadow hover:border-green-600 hover:cursor-pointer hover:bg-green-50"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700 mb-1 transition">
            Completed Today
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.completedToday}
          </p>
        </div>
        <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition">
          <IoCheckmarkCircle
            className="text-green-600 group-hover:text-green-700"
            size={24}
          />
        </div>
      </div>
    </div>
  );
}
