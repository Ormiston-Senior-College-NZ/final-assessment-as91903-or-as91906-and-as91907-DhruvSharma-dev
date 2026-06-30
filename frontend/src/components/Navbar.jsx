import { NavLink } from "react-router-dom";
import logo from "../assets/osc-logo.png";

export default function Navbar() {
  return (
    <div className="fixed top-4 left-6 right-6 z-50">
      <nav
        className="
          bg-white
          rounded-xl
          shadow-md
          h-16
          px-6
          flex
          items-center
          justify-between
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Ormiston Senior College StudentNET Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-8 text-base font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-2 py-1 pb-2 border-b-2 transition-all duration-200 ${
                isActive
                  ? "border-[#F2901D] text-[#F2901D]"
                  : "border-transparent text-gray-700 hover:text-[#F2901D] hover:border-[#F2901D]"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/student-info"
            className={({ isActive }) =>
              `px-2 py-1 pb-2 border-b-2 transition-all duration-200 ${
                isActive
                  ? "border-[#F2901D] text-[#F2901D]"
                  : "border-transparent text-gray-700 hover:text-[#F2901D] hover:border-[#F2901D]"
              }`
            }
          >
            Student Info
          </NavLink>

          <NavLink
            to="/curriculum"
            className={({ isActive }) =>
              `px-2 py-1 pb-2 border-b-2 transition-all duration-200 ${
                isActive
                  ? "border-[#F2901D] text-[#F2901D]"
                  : "border-transparent text-gray-700 hover:text-[#F2901D] hover:border-[#F2901D]"
              }`
            }
          >
            Curriculum
          </NavLink>

          <NavLink
            to="/careers"
            className={({ isActive }) =>
              `px-2 py-1 pb-2 border-b-2 transition-all duration-200 ${
                isActive
                  ? "border-[#F2901D] text-[#F2901D]"
                  : "border-transparent text-gray-700 hover:text-[#F2901D] hover:border-[#F2901D]"
              }`
            }
          >
            Careers
          </NavLink>

          <NavLink
            to="/web-apps"
            className={({ isActive }) =>
              `px-2 py-1 pb-2 border-b-2 transition-all duration-200 ${
                isActive
                  ? "border-[#F2901D] text-[#F2901D]"
                  : "border-transparent text-gray-700 hover:text-[#F2901D] hover:border-[#F2901D]"
              }`
            }
          >
            Web Apps
          </NavLink>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="
            w-56
            border
            border-gray-300
            rounded-lg
            px-3
            py-2
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-[#F2901D]
            focus:border-[#F2901D]
          "
        />
      </nav>
    </div>
  );
}