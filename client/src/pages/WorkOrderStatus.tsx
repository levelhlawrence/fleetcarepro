import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { apiClient } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import WorkOrdersList from "../components/workOrders/WorkOrdersList";
import CreateWorkOrder from "../components/workOrders/CreateWorkOrder";
import { FaPlus, FaArrowLeft, FaBus } from "react-icons/fa";
import { WorkOrder } from "./WorkOrders";

interface Vehicle {
  vehicle_id: string;
  bus_no: string;
  make: string;
  model: string;
  year: string;
  status: string;
}

const STATUS_CONFIG = {
  pending: {
    title: "Pending Work Orders",
    description: "Work orders waiting to be started",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
  },
  in_progress: {
    title: "In Progress Work Orders",
    description: "Work orders currently being worked on",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
  },
  completed: {
    title: "Completed Work Orders",
    description: "Successfully completed work orders",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    buttonColor: "bg-green-600 hover:bg-green-700",
  },
  down: {
    title: "Vehicle Down Work Orders",
    description: "Critical work orders with vehicles out of service",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    buttonColor: "bg-red-600 hover:bg-red-700",
  },
  outsourced: {
    title: "Outsourced Work Orders",
    description: "Work orders handled by external vendors",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
  },
  in_service: {
    title: "Vehicles In Service",
    description: "Vehicles currently operational without open work orders",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700",
  },
};

const WorkOrderStatus: React.FC = () => {
  const { status } = useParams<{ status: string }>();
  const navigate = useNavigate();
  const { state } = useAuth();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      if (status === "in_service") {
        // For in-service, fetch vehicles without open work orders
        const vehiclesResponse = await apiClient.get("/vehicles/");
        const allVehicles = vehiclesResponse.data.results || [];
        
        // Fetch all work orders to determine which vehicles are in service
        const workOrdersResponse = await apiClient.get("/work-orders/");
        const allWorkOrders = workOrdersResponse.data.results || [];
        
        // Get vehicle IDs with open work orders
        const vehiclesWithOpenWorkOrders = new Set(
          allWorkOrders
            .filter((wo: WorkOrder) => !["completed"].includes(wo.status))
            .map((wo: WorkOrder) => wo.vehicle)
        );
        
        // Filter vehicles that don't have open work orders
        const inServiceVehicles = allVehicles.filter(
          (vehicle: Vehicle) => !vehiclesWithOpenWorkOrders.has(vehicle.vehicle_id)
        );
        
        setVehicles(inServiceVehicles);
        setTotalCount(inServiceVehicles.length);
        setWorkOrders([]);
      } else {
        // For other statuses, fetch work orders with the specific status
        const response = await apiClient.get(`/work-orders/?status=${status}`);
        const data = response.data;
        
        setWorkOrders(data.results || []);
        setTotalCount(data.count || 0);
        setVehicles([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setWorkOrders([]);
      setVehicles([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  const handleWorkOrderCreated = useCallback(() => {
    setShowCreateModal(false);
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = useCallback(
    (workOrderId: string, newStatus: string) => {
      // Optimistically update the local state
      setWorkOrders((prev) =>
        prev.map((wo) =>
          wo.work_order_id === workOrderId
            ? {
                ...wo,
                status: newStatus as WorkOrder["status"],
                status_display: newStatus.replace("_", " "),
              }
            : wo
        )
      );

      // Refetch to ensure data consistency
      fetchData();
    },
    [fetchData]
  );

  useEffect(() => {
    if (!config) {
      navigate("/workorders");
      return;
    }
    fetchData();
  }, [config, fetchData, navigate]);

  if (!config) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full px-8 py-8 bg-gray-50">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-300 rounded-lg mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-8 py-8 bg-gray-50">
      {/* Header */}
      <div className={`${config.bgColor} rounded-lg shadow-sm p-6 mb-6 border ${config.borderColor}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate("/workorders")}
                className={`p-2 rounded-lg ${config.textColor} hover:bg-white/50 transition-colors`}
              >
                <FaArrowLeft size={16} />
              </button>
              <h1 className={`text-3xl font-bold ${config.textColor}`}>
                {config.title}
              </h1>
            </div>
            <p className={`${config.textColor} opacity-80`}>
              {config.description}
            </p>
            <div className={`text-lg font-semibold ${config.textColor} mt-2`}>
              {status === "in_service" ? (
                `${totalCount} vehicles in service`
              ) : (
                `${totalCount} work orders`
              )}
            </div>
          </div>
          {status !== "in_service" && (
            <div className="mt-4 md:mt-0 flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className={`flex items-center gap-2 px-4 py-2 ${config.buttonColor} text-white rounded-lg transition-colors`}
              >
                <FaPlus size={16} />
                New Work Order
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {status === "in_service" ? (
        // Render vehicles for in-service status
        <div className="bg-white rounded-lg shadow-sm">
          {vehicles.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.vehicle_id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-100 rounded-full">
                        <FaBus className="text-emerald-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Bus #{vehicle.bus_no}
                        </h3>
                        <p className="text-gray-600">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                        In Service
                      </span>
                      <button
                        onClick={() => navigate(`/vehicles/${vehicle.vehicle_id}`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FaBus className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No vehicles in service
              </h3>
              <p className="text-gray-600">
                All vehicles have active work orders or maintenance scheduled.
              </p>
            </div>
          )}
        </div>
      ) : (
        // Render work orders for other statuses
        <WorkOrdersList
          workOrders={workOrders}
          isLoading={isLoading}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {/* Create Work Order Modal */}
      {showCreateModal && (
        <CreateWorkOrder
          onClose={() => setShowCreateModal(false)}
          onWorkOrderCreated={handleWorkOrderCreated}
        />
      )}
    </div>
  );
};

export default WorkOrderStatus;