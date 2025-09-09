import React, { useState, useEffect } from "react";
import { apiClient } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { IoClose } from "react-icons/io5";
import { FaBus, FaExclamationTriangle, FaCalendarAlt } from "react-icons/fa";

interface CreateWorkOrderProps {
  onClose: () => void;
  onWorkOrderCreated: () => void;
}

interface Vehicle {
  bus_no: string;
  body_make?: string;
  veh_make?: string;
  body_model?: string;
  veh_model?: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const CreateWorkOrder: React.FC<CreateWorkOrderProps> = ({
  onClose,
  onWorkOrderCreated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    vehicle: "",
    title: "",
    description: "",
    priority: "medium",
    assigned_to: "",
    due_date: "",
    estimated_cost: "",
    parts_needed: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch vehicles and employees on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesResponse, employeesResponse] = await Promise.all([
          apiClient.get("/vehicles/"),
          apiClient.get("/employees/"),
        ]);

        setVehicles(vehiclesResponse.data.results || []);
        setEmployees(employeesResponse.data.results || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehicle) {
      newErrors.vehicle = "Vehicle is required";
    }
    if (!formData.title) {
      newErrors.title = "Title is required";
    }
    if (!formData.description) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const workOrderData = {
        ...formData,
        assigned_to: formData.assigned_to || null,
        due_date: formData.due_date || null,
        estimated_cost: formData.estimated_cost
          ? parseFloat(formData.estimated_cost)
          : null,
      };

      await apiClient.post("/work-orders/", workOrderData);
      onWorkOrderCreated();
    } catch (error: any) {
      console.error("Error creating work order:", error);

      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors: Record<string, string> = {};

        Object.entries(apiErrors).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            newErrors[key] = value[0];
          } else if (typeof value === "string") {
            newErrors[key] = value;
          }
        });

        setErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Work Order
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-200px)]"
        >
          <div className="p-6 space-y-6">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaBus className="inline mr-2" size={16} />
                Vehicle *
              </label>
              <select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.vehicle ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.bus_no} value={vehicle.bus_no}>
                    {vehicle.bus_no} - {vehicle.body_make || vehicle.veh_make}{" "}
                    {vehicle.body_model || vehicle.veh_model}
                  </option>
                ))}
              </select>
              {errors.vehicle && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicle}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Order Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Brake inspection and repair"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.title ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe the work that needs to be performed..."
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Priority and Assigned To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaExclamationTriangle className="inline mr-2" size={16} />
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To
                </label>
                <select
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Unassigned</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.first_name} {employee.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date and Estimated Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2" size={16} />
                  Due Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Cost
                </label>
                <input
                  type="number"
                  name="estimated_cost"
                  value={formData.estimated_cost}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Parts Needed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parts Needed
              </label>
              <textarea
                name="parts_needed"
                value={formData.parts_needed}
                onChange={handleInputChange}
                rows={3}
                placeholder="List any parts or materials needed..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any additional information or special instructions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              )}
              {isLoading ? "Creating..." : "Create Work Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkOrder;
