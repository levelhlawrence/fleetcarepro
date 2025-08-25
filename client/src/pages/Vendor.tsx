import { useState } from "react";
import AddVendor from "../components/vendorPage/AddVendor";
import DisplayVendors from "../components/displayVendors";

function Vendor() {
  const [showAddVendor, setShowAddVendor] = useState(false);

  return (
    <section className="bg-gray-200 min-h-screen p-8">
      <div className="bg-white h-screen rounded-2xl p-8 border border-gray-300">
        <article className="flex justify-between items-center mb-8">
          <aside>
            <h1 className="text-3xl">Shop Employees / Vendors</h1>
            <p className="mt-2 text-gray-500 font-light">Manage Personnel</p>
          </aside>
          <button
            onClick={() => setShowAddVendor(!showAddVendor)}
            className="bg-blue-400 rounded-md p-2 text-white hover:bg-blue-500 transition hover:scale-105 active:scale-95 hover:cursor-pointer"
          >
            Add Staff
          </button>
        </article>
        {showAddVendor && (
          <div>
            <AddVendor setShowAddVendor={setShowAddVendor} />
          </div>
        )}
        {/* <DisplayVendors /> */}
        <DisplayVendors />
      </div>
    </section>
  );
}

export default Vendor;
