import ShowVehicles from "../components/vechileComponents/ShowVehicles";
import TotalVechs from "../components/vechileComponents/TotalVechs";
import VehicleSearch from "../components/vechileComponents/VehicleSearch";
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../utils/api";

interface SearchFilters {
  vehicleNo: string;
  year: string;
  location: string;
  generalSearch: string;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehCount, setVehCount] = useState<number | null>(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    vehicleNo: '',
    year: '',
    location: '',
    generalSearch: '',
  });
  const [isSearchActive, setIsSearchActive] = useState(false);

  const buildSearchParams = (filters: SearchFilters): URLSearchParams => {
    const params = new URLSearchParams();
    
    if (filters.generalSearch.trim()) {
      params.append('search', filters.generalSearch.trim());
    }
    if (filters.vehicleNo.trim()) {
      params.append('vehicle_no', filters.vehicleNo.trim());
    }
    if (filters.year.trim()) {
      params.append('year', filters.year.trim());
    }
    if (filters.location.trim()) {
      params.append('location', filters.location.trim());
    }
    
    return params;
  };

  const getVehicles = async (url: string = `/vehicles/`, filters?: SearchFilters) => {
    try {
      setIsLoading(true);
      let finalUrl = url;
      
      // If filters are provided and it's the base URL, add search parameters
      if (filters && url === '/vehicles/') {
        const searchParams = buildSearchParams(filters);
        if (searchParams.toString()) {
          finalUrl = `/vehicles/?${searchParams.toString()}`;
        }
      }
      
      const response = await apiClient.get(finalUrl);
      const data = response.data;
      
      setVehicles(data.results || []);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setVehCount(data.count || 0);
      
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
      setVehCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
    const hasActiveFilters = Object.values(filters).some(value => value.trim() !== '');
    setIsSearchActive(hasActiveFilters);
    getVehicles('/vehicles/', filters);
  }, []);

  const handleClearSearch = useCallback(() => {
    const emptyFilters = {
      vehicleNo: '',
      year: '',
      location: '',
      generalSearch: '',
    };
    setSearchFilters(emptyFilters);
    setIsSearchActive(false);
    getVehicles('/vehicles/', emptyFilters);
  }, []);

  useEffect(() => {
    getVehicles();
  }, []);

  return (
    <div className="min-h-screen w-full px-8">
      <h2 className="text-2xl font-semibold mt-8">Fleet Overview</h2>
      <TotalVechs count={vehCount} />
      
      <VehicleSearch
        onSearch={handleSearch}
        isLoading={isLoading}
        totalResults={isSearchActive ? vehCount : undefined}
        onClear={handleClearSearch}
      />
      
      <ShowVehicles
        vehicles={vehicles}
        nextPage={nextPage}
        prevPage={prevPage}
        count={vehCount}
        getVehicles={getVehicles}
        isLoading={isLoading}
        isSearchActive={isSearchActive}
      />
    </div>
  );
}
