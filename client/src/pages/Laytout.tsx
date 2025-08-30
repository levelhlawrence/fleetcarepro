import { Outlet } from "react-router";
export default function Layout() {
  return (
    <div>
      <p className="bg-red-500 w-screen text-4xl">Hello layout</p>
      <Outlet />
    </div>
  );
}
