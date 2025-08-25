function DisplayVendors() {
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
              Notes
            </th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
export default DisplayVendors;
