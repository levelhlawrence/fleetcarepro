import React, { useState, useEffect } from 'react';
import { IoSearch, IoClose, IoFunnel } from 'react-icons/io5';
import { FaTools, FaExclamationTriangle, FaClock } from 'react-icons/fa';

interface Filters {
  status: string;
  priority: string;
  vehicle: string;
  assigned_to: string;
  search: string;
}

interface WorkOrderFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  isLoading: boolean;
  totalResults: number;
}

const WorkOrderFilters: React.FC<WorkOrderFiltersProps> = ({
  filters,
  onFiltersChange,
  isLoading,
  totalResults,
}) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
    { value: 'in_progress', label: 'In Progress', color: 'text-blue-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
    { value: 'down', label: 'Vehicle Down', color: 'text-red-600' },
    { value: 'outsourced', label: 'Outsourced', color: 'text-purple-600' },
    { value: 'in_service', label: 'Back In Service', color: 'text-emerald-600' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low', color: 'text-gray-600' },
    { value: 'medium', label: 'Medium', color: 'text-blue-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-600' },
  ];

  useEffect(() => {
    const hasFilters = Object.values(localFilters).some(value => value.trim() !== '');
    setHasActiveFilters(hasFilters);
  }, [localFilters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange(localFilters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localFilters, onFiltersChange]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      status: '',
      priority: '',
      vehicle: '',
      assigned_to: '',
      search: '',
    };
    setLocalFilters(emptyFilters);
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      {/* Main search bar */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search work orders by ID, title, description, or vehicle..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleExpanded}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700 flex items-center gap-2"
          >
            <IoFunnel size={16} />
            {isExpanded ? 'Simple' : 'Filters'}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-1"
            >
              <IoClose size={16} />
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        {totalResults !== undefined && hasActiveFilters && (
          <div className="mt-3 text-sm text-gray-600">
            {totalResults === 0 ? (
              <span className="text-yellow-600">No work orders found matching your search criteria</span>
            ) : (
              <span>{totalResults} work order{totalResults !== 1 ? 's' : ''} found</span>
            )}
          </div>
        )}
      </div>

      {/* Advanced filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaTools className="inline mr-2" size={16} />
                Status
              </label>
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaExclamationTriangle className="inline mr-2" size={16} />
                Priority
              </label>
              <select
                value={localFilters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2" size={16} />
                Vehicle
              </label>
              <input
                type="text"
                placeholder="Vehicle number..."
                value={localFilters.vehicle}
                onChange={(e) => handleFilterChange('vehicle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Assigned To Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To
              </label>
              <input
                type="text"
                placeholder="Employee ID..."
                value={localFilters.assigned_to}
                onChange={(e) => handleFilterChange('assigned_to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Filters work in combination with the search functionality
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick status filters */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-600 mr-2">Quick filters:</span>
          {statusOptions.slice(1).map((status) => (
            <button
              key={status.value}
              onClick={() => handleFilterChange('status', localFilters.status === status.value ? '' : status.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                localFilters.status === status.value
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkOrderFilters;
