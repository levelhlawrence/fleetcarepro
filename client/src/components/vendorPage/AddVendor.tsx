import React, { useState } from "react";

type VendorProps = {
  setShowAddVendor: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddVendor({ setShowAddVendor }: VendorProps) {
  const [vendorData, setVendorData] = useState({
    name: "",
    number: "",
    email: "",
    address: "",
    notes: "",
  });

  const handleClose = () => {
    setShowAddVendor(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVendorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Vendor Data Submitted:", vendorData);
    setShowAddVendor(false);
  };

  return (
    <div className="absolute bg-black/50 h-screen w-screen top-0 left-0 flex justify-center items-center z-10">
      <form className="bg-white p-4 rounded-md relative z-20 w-2/3">
        {/* Form Title */}
        <h1 className="ml-2 text-2xl text-gray-700 pb-2 border-b border-gray-400">
          Add New Vendor
        </h1>

        {/* NAME */}
        <div className="flex flex-col my-4">
          <label className="ml-2" htmlFor="vendor-name">
            Name:
          </label>
          <input
            className="border border-gray-400 rounded-sm ml-2 px-2 py-1"
            name="name"
            id="name"
            type="text"
            onChange={handleChange}
          />
        </div>

        {/* NUMBER */}
        <div className="flex flex-col mb-4">
          <label className="ml-2" htmlFor="vendor-number">
            Number:
          </label>
          <input
            className="border border-gray-400 rounded-sm ml-2 px-2 py-1"
            name="number"
            type="number"
            id="number"
            onChange={handleChange}
          />
        </div>

        {/* EMAIL */}
        <div className="flex flex-col mb-4">
          <label className="ml-2" htmlFor="vendor-email">
            Email:
          </label>
          <input
            className="border border-gray-400 rounded-sm ml-2 px-2 py-1"
            name="email"
            id="email"
            type="email"
            onChange={handleChange}
          />
        </div>

        {/* ADDRESS */}
        <div className="flex flex-col mb-4">
          <label className="ml-2" htmlFor="vendor-address">
            Address:
          </label>
          <input
            className="border border-gray-400 rounded-sm ml-2 px-2 py-1"
            name="address"
            id="address"
            type="address"
            onChange={handleChange}
          />
        </div>

        {/* NOTES */}
        <div className="flex flex-col">
          <label className="ml-2" htmlFor="vendor-notes">
            Notes:
          </label>
          <textarea
            rows={5}
            className=" px-2 py-1 border border-gray-400 rounded-sm ml-2 mb-6"
            name="notes"
            id="notes"
            onChange={handleChange}
          />
        </div>

        {/* BUTTON SECTION */}
        <div className="flex justify-end gap-2 w-full border-t border-gray-300 pt-4">
          <button
            onClick={handleClose}
            className="p-[0.4rem] bg-gray-400 rounded text-white hover:cursor-pointer hover:bg-gray-500"
          >
            Close
          </button>
          <input
            onClick={handleSubmit}
            className="bg-blue-400 text-white px-2 rounded-sm hover:cursor-pointer hover:bg-blue-500"
            type="submit"
            value="Save Changes"
          />
        </div>
      </form>
    </div>
  );
}
export default AddVendor;
