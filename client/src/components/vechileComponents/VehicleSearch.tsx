import React, { useState, useEffect } from 'react';
import { IoSearch, IoClose, IoCarSport } from 'react-icons/io5';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

interface SearchFilters {
  vehicleNo: string;
  year: string;
  location: string;
  generalSearch: string;
}

interface VehicleSearchProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading: boolean;
  totalResults?: number;
  onClear: () => void;
}

const VehicleSearch: React.FC<VehicleSearchProps> = ({
  onSearch,
  isLoading,
  totalResults,
  onClear,
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    vehicleNo: '',
    year: '',
    location: '',
    generalSearch: '',
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Check if there are active filters
  useEffect(() => {
    const hasFilters = Object.values(filters).some(value => value.trim() !== '');
    setHasActiveFilters(hasFilters);
  }, [filters]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(filters);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters, onSearch]);

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    setFilters({
      vehicleNo: '',
      year: '',
      location: '',
      generalSearch: '',
    });
    setIsExpanded(false);
    onClear();
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
              placeholder="Search vehicles by number, year, location, make, or model..."
              value={filters.generalSearch}
              onChange={(e) => handleInputChange('generalSearch', e.target.value)}
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
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700"
          >
            {isExpanded ? 'Simple' : 'Advanced'}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={handleClear}
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
              <span className="text-yellow-600">No vehicles found matching your search criteria</span>
            ) : (
              <span>{totalResults} vehicle{totalResults !== 1 ? 's' : ''} found</span>
            )}
          </div>
        )}
      </div>

      {/* Advanced search filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vehicle Number Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IoCarSport className="inline mr-2" size={16} />
                Vehicle Number
              </label>
              <input
                type="text"
                placeholder="e.g., BUS-001"
                value={filters.vehicleNo}
                onChange={(e) => handleInputChange('vehicleNo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2" size={16} />
                Year
              </label>
              <input
                type="text"
                placeholder="e.g., 2020"
                value={filters.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2" size={16} />
                Assigned Location
              </label>
              <input
                type="text"
                placeholder="e.g., Main Depot"
                value={filters.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Advanced filters work in combination with the general search
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleSearch;
