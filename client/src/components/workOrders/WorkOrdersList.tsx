import React, { useState } from 'react';
import { WorkOrder } from '../../pages/WorkOrders';
import { apiClient } from '../../utils/api';
import { 
  FaTools, 
  FaExclamationTriangle, 
  FaClock, 
  FaUser,
  FaBus,
  FaCalendarAlt,
  FaDollarSign
} from 'react-icons/fa';
import { IoCheckmarkCircle, IoWarning, IoTime, IoSpeedometer } from 'react-icons/io5';

interface WorkOrdersListProps {
  workOrders: WorkOrder[];
  isLoading: boolean;
  onStatusUpdate: (workOrderId: string, newStatus: string) => void;
}

const WorkOrdersList: React.FC<WorkOrdersListProps> = ({
  workOrders,
  isLoading,
  onStatusUpdate,
}) => {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'down': return 'bg-red-100 text-red-800 border-red-200';
      case 'outsourced': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'in_service': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-gray-600';
      case 'medium': return 'text-blue-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <IoTime className="w-4 h-4" />;
      case 'in_progress': return <FaTools className="w-4 h-4" />;
      case 'completed': return <IoCheckmarkCircle className="w-4 h-4" />;
      case 'down': return <IoWarning className="w-4 h-4" />;
      case 'outsourced': return <FaUser className="w-4 h-4" />;
      case 'in_service': return <IoSpeedometer className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'down', label: 'Vehicle Down' },
    { value: 'outsourced', label: 'Outsourced' },
    { value: 'in_service', label: 'Back In Service' },
  ];

  const handleStatusChange = async (workOrderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(workOrderId);
      
      // Update the work order status via API
      await apiClient.patch(`/work-orders/${workOrderId}/`, {
        status: newStatus,
        ...(newStatus === 'in_progress' && { started_at: new Date().toISOString() }),
        ...(newStatus === 'completed' && { completed_at: new Date().toISOString() }),
      });
      
      onStatusUpdate(workOrderId, newStatus);
    } catch (error) {
      console.error('Error updating work order status:', error);
      // You might want to show a toast notification here
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (workOrders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <FaTools className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Work Orders Found</h3>
        <p className="text-gray-600">
          No work orders match your current search criteria. Try adjusting your filters or create a new work order.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workOrders.map((workOrder) => (
                <tr key={workOrder.work_order_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {workOrder.work_order_id}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {workOrder.title}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaBus className="text-gray-400 mr-2" size={16} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {workOrder.vehicle_info?.bus_no}
                        </div>
                        <div className="text-sm text-gray-500">
                          {workOrder.vehicle_info?.make} {workOrder.vehicle_info?.model}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(workOrder.status)}`}>
                      {getStatusIcon(workOrder.status)}
                      <span className="ml-1">{workOrder.status_display}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaExclamationTriangle className={`mr-1 ${getPriorityColor(workOrder.priority)}`} size={12} />
                      <span className={`text-sm font-medium ${getPriorityColor(workOrder.priority)}`}>
                        {workOrder.priority_display}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workOrder.assigned_to_name || 'Unassigned'}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2" size={12} />
                      {formatDate(workOrder.due_date)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <select
                      value={workOrder.status}
                      onChange={(e) => handleStatusChange(workOrder.work_order_id, e.target.value)}
                      disabled={updatingStatus === workOrder.work_order_id}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="space-y-4 p-4">
          {workOrders.map((workOrder) => (
            <div key={workOrder.work_order_id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {workOrder.work_order_id}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{workOrder.title}</p>
                </div>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(workOrder.status)}`}>
                  {getStatusIcon(workOrder.status)}
                  <span className="ml-1">{workOrder.status_display}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <FaBus className="mr-1" size={12} />
                    Vehicle
                  </div>
                  <div className="text-gray-900 font-medium">
                    {workOrder.vehicle_info?.bus_no}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <FaExclamationTriangle className="mr-1" size={12} />
                    Priority
                  </div>
                  <div className={`font-medium ${getPriorityColor(workOrder.priority)}`}>
                    {workOrder.priority_display}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <FaUser className="mr-1" size={12} />
                    Assigned To
                  </div>
                  <div className="text-gray-900">
                    {workOrder.assigned_to_name || 'Unassigned'}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <FaCalendarAlt className="mr-1" size={12} />
                    Due Date
                  </div>
                  <div className="text-gray-900">
                    {formatDate(workOrder.due_date)}
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <label className="block text-xs text-gray-500 mb-1">Update Status</label>
                <select
                  value={workOrder.status}
                  onChange={(e) => handleStatusChange(workOrder.work_order_id, e.target.value)}
                  disabled={updatingStatus === workOrder.work_order_id}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkOrdersList;
