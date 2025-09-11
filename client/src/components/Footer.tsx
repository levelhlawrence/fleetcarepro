import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-xl font-bold text-white">FleetCare Pro</h2>
          <p className="mt-3 text-sm">
            Smart fleet management to keep your business moving. Track vehicles,
            manage work orders, and optimize operations in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="/dashboard" className="hover:text-white">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/vehicles" className="hover:text-white">
                Vehicles
              </a>
            </li>
            <li>
              <a href="/workorders" className="hover:text-white">
                Work Orders
              </a>
            </li>
            <li>
              <a href="/reports" className="hover:text-white">
                Reports
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MdEmail className="text-blue-400" /> support@fleetcarepro.com
            </li>
            <li className="flex items-center gap-2">
              <MdPhone className="text-green-400" /> +1 (800) 555-1234
            </li>
          </ul>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-white">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} FleetCare Pro. All rights reserved.
      </div>
    </footer>
  );
}
