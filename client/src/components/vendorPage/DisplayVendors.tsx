import { useState, useEffect, use } from "react";
import axios from "axios";

function DisplayVendors() {
  const [vendors, setVendors] = useState([]);

  const fetchVendors = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/vendors/");
      const data = response.data.results;
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  useEffect(() => {
    fetchVendors();
    console.log(vendors);
  }, [vendors.length]);

  return (
    <div>
      <aside className="border border-gray-300 rounded-t-lg bg-gray-100 p-4 border-b-0">
        <h1>Display Vendors Component</h1>
      </aside>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 text-sm font-normal text-gray-600">
              Name
            </th>
            <th className="px-4 py-2 text-sm font-normal text-gray-600">
              Number
            </th>
            <th className="px-4 py-2 text-sm font-normal text-gray-600">
              Email
            </th>
            <th className="px-4 py-2 text-sm font-normal text-gray-600">
              Address
            </th>
            <th className="px-4 py-2 text-sm font-normal text-gray-600">
              City
            </th>
            <th className="px-4 py-2 text-sm font-normal text-gray-600">
              State
            </th>
            <th className="px-4 py-2 text-sm font-normal text-gray-600">
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => {
            return (
              <tr
                className="border-t border-gray-300 text-center"
                key={vendor.id}
              >
                <td className="text-center">{vendor.name}</td>
                <td>{vendor.number || "none"}</td>
                <td>{vendor.email || "none"}</td>
                <td>{vendor.address || "none"}</td>
                <td className="text-center">{vendor.city || "none"}</td>
                <td className="text-center">{vendor.state || "none"}</td>
                <td>{vendor.notes || "none"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default DisplayVendors;
