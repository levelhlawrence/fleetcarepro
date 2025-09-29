import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import WorkOrdersList from "../components/workOrders/WorkOrdersList";
import WorkOrderFilters from "../components/workOrders/WorkOrderFilters";
import CreateWorkOrder from "../components/workOrders/CreateWorkOrder";
import { FaPlus, FaTools, FaChartBar } from "react-icons/fa";

export interface WorkOrder {
  work_order_id: string;
  vehicle: string;
  vehicle_info: {
    bus_no: string;
    make: string;
    model: string;
    year: string;
  };
  title: string;
  description: string;
  status:
    | "pending"
    | "in_progress"
    | "completed"
    | "down"
    | "outsourced"
    | "in_service";
  status_display: string;
  priority: "low" | "medium" | "high" | "critical";
  priority_display: string;
  assigned_to: number | null;
  assigned_to_name: string | null;
  created_by: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  due_date: string | null;
  started_at: string | null;
  completed_at: string | null;
  estimated_cost: string | null;
  actual_cost: string | null;
  mileage_at_work: string | null;
  parts_needed: string | null;
  work_performed: string | null;
  notes: string | null;
  vendor: number | null;
  vendor_name: string | null;
  external_work_order_no: string | null;
}

interface Filters {
  status: string;
  priority: string;
  vehicle: string;
  assigned_to: string;
  search: string;
}

const WorkOrders: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    status: "",
    priority: "",
    vehicle: "",
    assigned_to: "",
    search: "",
  });

  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    in_progress: 0,
    completed: 0,
    down: 0,
    outsourced: 0,
    in_service: 0,
  });

  const buildQueryParams = (filters: Filters): URLSearchParams => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) {
        params.append(key, value.trim());
      }
    });

    return params;
  };

  const fetchWorkOrders = useCallback(
    async (currentFilters?: Filters) => {
      try {
        setIsLoading(true);
        const filtersToUse = currentFilters || filters;
        const queryParams = buildQueryParams(filtersToUse);
        const url = `/work-orders/?${queryParams.toString()}`;

        const response = await apiClient.get(url);
        const data = response.data;

        setWorkOrders(data.results || []);
        setTotalCount(data.count || 0);

        // Calculate status counts
        const counts = {
          pending: 0,
          in_progress: 0,
          completed: 0,
          down: 0,
          outsourced: 0,
          in_service: 0,
        };

        (data.results || []).forEach((wo: WorkOrder) => {
          if (counts.hasOwnProperty(wo.status)) {
            counts[wo.status as keyof typeof counts]++;
          }
        });

        setStatusCounts(counts);
      } catch (error) {
        console.error("Error fetching work orders:", error);
        setWorkOrders([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    fetchWorkOrders(newFilters);
  }, []);

  const handleWorkOrderCreated = useCallback(() => {
    setShowCreateModal(false);
    fetchWorkOrders();
  }, [fetchWorkOrders]);

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
      fetchWorkOrders();
    },
    [fetchWorkOrders]
  );

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  return (
    <div className="min-h-screen w-full px-8 py-8 bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Work Orders
            </h1>
            <p className="text-gray-600">
              Manage and track maintenance work orders for your fleet
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus size={16} />
              New Work Order
            </button>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          <div 
            onClick={() => navigate("/workorders/status/pending")}
            className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg border border-yellow-200 group hover:border-yellow-300 hover:cursor-pointer transition"
          >
            <div className="text-2xl font-bold text-yellow-700 group-hover:text-yellow-800">
              {statusCounts.pending}
            </div>
            <div className="text-sm text-yellow-600 group-hover:text-yellow-700">
              Pending
            </div>
          </div>
          <div 
            onClick={() => navigate("/workorders/status/in_progress")}
            className="bg-blue-50 hover:bg-blue-100 transition group hover:cursor-pointer p-4 rounded-lg border border-blue-200 hover:border-blue-300"
          >
            <div className="text-2xl font-bold text-blue-700 group-hover:text-blue-800">
              {statusCounts.in_progress}
            </div>
            <div className="text-sm text-blue-600 group-hover:text-blue-700">
              In Progress
            </div>
          </div>
          <div 
            onClick={() => navigate("/workorders/status/down")}
            className="group transition hover:cursor-pointer hover:bg-red-100 bg-red-50 p-4 rounded-lg border border-red-200 hover:border-red-300"
          >
            <div className="text-2xl font-bold text-red-700 group-hover:text-red-800">
              {statusCounts.down}
            </div>
            <div className="text-sm text-red-600 group-hover:text-red-700">
              Vehicle Down
            </div>
          </div>
          <div 
            onClick={() => navigate("/workorders/status/outsourced")}
            className="transition group hover:bg-purple-100 hover:cursor-pointer bg-purple-50 p-4 rounded-lg border border-purple-200 hover:border-purple-300"
          >
            <div className="text-2xl font-bold text-purple-700 group-hover:text-purple-800">
              {statusCounts.outsourced}
            </div>
            <div className="text-sm text-purple-600 group-hover:text-purple-700">
              Outsourced
            </div>
          </div>
          <div 
            onClick={() => navigate("/workorders/status/completed")}
            className="bg-green-50 group transition p-4 hover:bg-green-100 hover:cursor-pointer rounded-lg border border-green-200 hover:border-green-300"
          >
            <div className="text-2xl font-bold text-green-700 group-hover:text-green-800">
              {statusCounts.completed}
            </div>
            <div className="text-sm text-green-600 group-hover:text-green-700">
              Completed
            </div>
          </div>
          <div 
            onClick={() => navigate("/workorders/status/in_service")}
            className="bg-emerald-50 hover:bg-emerald-100 p-4 rounded-lg border border-emerald-200 hover:border-emerald-300 hover:cursor-pointer transition group"
          >
            <div className="text-2xl font-bold text-emerald-700 group-hover:text-emerald-800">
              {statusCounts.in_service}
            </div>
            <div className="text-sm text-emerald-600 group-hover:text-emerald-700">
              In Service
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <WorkOrderFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isLoading={isLoading}
        totalResults={totalCount}
      />

      {/* Work Orders List */}
      <WorkOrdersList
        workOrders={workOrders}
        isLoading={isLoading}
        onStatusUpdate={handleStatusUpdate}
      />

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

export default WorkOrders;
