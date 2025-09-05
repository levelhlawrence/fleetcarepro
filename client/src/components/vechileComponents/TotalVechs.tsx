import { FaBus } from "react-icons/fa6";

export default function TotalVechs({ count }) {
  return (
    <aside className="bg-emerald-700 text-white w-fit p-4 rounded-lg my-4 shadow-md">
      <p className="mb-4">Fleet Total</p>
      <div className="flex justify-between">
        <FaBus size={20} />
        <p className="font-bold ml-4">{count || "loading..."}</p>
      </div>
    </aside>
  );
}
