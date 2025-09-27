import bgHeroImg from "../images/heroBusImg.jpg";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../utils/api";
// import ICONS
import {
  FaBus,
  FaTools,
  FaClock,
  FaChartLine,
  FaCalendarDay,
} from "react-icons/fa";
import {
  IoSpeedometer,
  IoCheckmarkCircle,
  IoWarning,
  IoTime,
} from "react-icons/io5";

// import COMPONENTS
import TotalFleet from "../components/homeComponents/TotalFleet";
import ActiveWorkOrders from "../components/homeComponents/ActiveWorkOrders";
import CriticalIssues from "../components/homeComponents/Criticalissues";
import CompletedToday from "../components/homeComponents/CompletedToday";
import VehiclesDown from "../components/homeComponents/VehiclesDown";
import PendingMaintenance from "../components/homeComponents/PendingMaintenance";

interface DashboardStats {
  totalVehicles: number;
  activeWorkOrders: number;
  criticalIssues: number;
  completedToday: number;
  vehiclesDown: number;
  pendingMaintenance: number;
}

interface RecentActivity {
  id: string;
  type: "work_order" | "vehicle" | "maintenance";
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  vehicle?: string;
}

function Home() {
  const { state } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    activeWorkOrders: 0,
    criticalIssues: 0,
    completedToday: 0,
    vehiclesDown: 0,
    pendingMaintenance: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch vehicles
        const vehiclesResponse = await apiClient.get("/vehicles/");
        const vehicles = vehiclesResponse.data.results || [];

        // Fetch work orders
        const workOrdersResponse = await apiClient.get("/work-orders/");
        const workOrders = workOrdersResponse.data.results || [];

        // Calculate stats
        const totalVehicles = vehiclesResponse.data.count || 0;
        const activeWorkOrders = workOrders.filter((wo: any) =>
          ["pending", "in_progress"].includes(wo.status)
        ).length;
        const criticalIssues = workOrders.filter(
          (wo: any) => wo.priority === "critical" && wo.status !== "completed"
        ).length;
        const vehiclesDown = workOrders.filter(
          (wo: any) => wo.status === "down"
        ).length;
        const pendingMaintenance = workOrders.filter(
          (wo: any) => wo.status === "pending"
        ).length;

        // Today's completed work orders
        const today = new Date().toISOString().split("T")[0];
        const completedToday = workOrders.filter(
          (wo: any) =>
            wo.status === "completed" && wo.completed_at?.startsWith(today)
        ).length;

        setStats({
          totalVehicles,
          activeWorkOrders,
          criticalIssues,
          completedToday,
          vehiclesDown,
          pendingMaintenance,
        });

        // Create recent activity from work orders
        const activities: RecentActivity[] = workOrders
          .slice(0, 5)
          .map((wo: any) => ({
            id: wo.work_order_id,
            type: "work_order" as const,
            title: wo.title,
            description: `Work order ${wo.status_display} for ${wo.vehicle_info?.bus_no}`,
            timestamp: wo.updated_at,
            status: wo.status,
            vehicle: wo.vehicle_info?.bus_no,
          }));

        setRecentActivity(activities);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in_progress":
        return "text-blue-600";
      case "pending":
        return "text-yellow-600";
      case "down":
        return "text-red-600";
      case "outsourced":
        return "text-purple-600";
      case "in_service":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-8 py-8 bg-gray-50">
      {/* Header Section */}
      <div className="mb-8">
        <div
          style={{ backgroundImage: `url(${bgHeroImg})` }}
          className="relative rounded-lg flex bg-cover bg-center p-8 flex-col md:flex-row md:items-center md:justify-between"
        >
          <div className="absolute rounded-lg top-0 left-0 w-full bg-cyan-900/75 z-10 h-full"></div>
          <div className="relative z-20">
            <h1 className="text-2xl font-bold text-white mb-2">
              {getGreeting()}, {state.user?.first_name}!
            </h1>
            <p className="text-gray-100 mt-[-0.9rem] mb-4 font-medium">
              {state.user?.position}
            </p>
            <p className="text-gray-200 text-sm mt-[-0.4rem]">
              Welcome back. Here's the fleet overview for today.
            </p>
          </div>
          <div className="relative z-20 text-yellow-300">
            <div className="flex text-sm items-center gap-2">
              <FaCalendarDay />
              <span>{formatTime(currentTime)}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <span className="font-medium text-whit  e">{}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <TotalFleet stats={stats} />
        <ActiveWorkOrders stats={stats} />
        <CriticalIssues stats={stats} />
        <CompletedToday stats={stats} />
        <VehiclesDown stats={stats} />
        <PendingMaintenance stats={stats} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaClock className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FaTools className="text-blue-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                      {activity.status && (
                        <span
                          className={`font-medium ${getStatusColor(
                            activity.status
                          )}`}
                        >
                          {activity.status.replace("_", " ").toUpperCase()}
                        </span>
                      )}
                      {activity.vehicle && (
                        <span>Vehicle: {activity.vehicle}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No recent activity
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <IoSpeedometer className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>
          </div>
          <div className="space-y-3">
            <button className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <div className="flex items-center gap-3">
                <FaTools className="text-blue-600" size={20} />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Create Work Order
                  </h4>
                  <p className="text-sm text-gray-600">
                    Schedule maintenance or repairs
                  </p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <div className="flex items-center gap-3">
                <FaBus className="text-green-600" size={20} />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Vehicle Inspection
                  </h4>
                  <p className="text-sm text-gray-600">
                    Perform routine inspections
                  </p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <div className="flex items-center gap-3">
                <FaChartLine className="text-purple-600" size={20} />
                <div>
                  <h4 className="font-medium text-gray-900">Fleet Reports</h4>
                  <p className="text-sm text-gray-600">
                    View performance analytics
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
