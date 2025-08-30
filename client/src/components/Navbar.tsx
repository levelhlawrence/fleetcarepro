import fleetCareLogo from "../images/maintLogo1.svg";
import { useState } from "react";
import { navRoutes } from "../utils/routes";
import { IoMenuOutline, IoClose } from "react-icons/io5";
import { Link } from "react-router";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenuHandler = () => {
    setIsOpen((prev) => !prev);
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
      <ul
        className={`mt-20 md:mt-24 transition-all duration-300 absolute bg-gray-600 right-0 top-[-2rem] h-screen p-10 w-1/2 md:relative md:p-0 md:h-full
          ${isOpen ? "block" : "hidden"} md:block`}
      >
        {navRoutes.map((route) => (
          <li key={route.name} className="flex gap-4 mb-8 items-center">
            <div>{route.icon}</div>
            <Link className="text-sm" to={route.href}>
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
