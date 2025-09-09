import fleetCareLogo from "../images/maintLogo1.svg";
import { useState } from "react";
import { navRoutes } from "../utils/routes";
import {
  IoMenuOutline,
  IoClose,
  IoLogOutOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../utils/api";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleMenuHandler = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (state.refreshToken) {
        await authAPI.logout(state.refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
      setIsLoggingOut(false);
      navigate("/login");
    }
  };

  return (
    <nav className="bg-gray-600 text-white md:min-h-screen md:min-w-1/4 flex items-center md:flex-col justify-between md:justify-start px-4 py-2 relative">
      {/* Logo */}
      <div id="fleet-logo" className="flex items-center gap-2 md:mt-4">
        <img
          className="invert w-10"
          src={fleetCareLogo}
          alt="fleetcarepro-icon"
        />
        <h4 className="text-xl">
          Fleetcare<span className="font-bold text-emerald-400">Pro</span>
        </h4>
      </div>

      {/* Mobile toggle button (hidden on md+) */}
      <button
        onClick={toggleMenuHandler}
        className="md:hidden absolute right-4 top-4"
      >
        {isOpen ? <IoClose size={30} /> : <IoMenuOutline size={30} />}
      </button>

      {/* Menu */}
      <div
        className={` mt-20 md:mt-24 transition-all duration-300 absolute bg-gray-600 right-0 top-[-2rem] max-h-screen p-10 w-1/2 md:relative md:p-0 md:h-[80vh] md:w-full flex flex-col justify-between items-center
          ${isOpen ? "block" : "hidden"} md:flex`}
      >
        {/* Navigation Links */}
        <ul>
          {navRoutes.map((route) => (
            <li key={route.name} className="flex gap-4 mb-8 items-center ">
              <div>{route.icon}</div>
              <Link className="text-sm" to={`/${route.href}`}>
                {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Info and Logout */}
        <div>
          {/* User Info */}
          {state.user && (
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <IoPersonOutline size={16} />
                <span className="text-sm font-medium">
                  {state.user.first_name} {state.user.last_name}
                </span>
              </div>
              <p className="text-xs text-gray-300">{state.user.department}</p>
              <p className="text-xs text-gray-300">{state.user.email}</p>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 w-full p-2 text-sm text-red-300 hover:text-red-200 hover:bg-gray-700 rounded transition-colors disabled:opacity-50 hover:cursor-pointer "
          >
            <IoLogOutOutline size={16} />
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </nav>
  );
}
