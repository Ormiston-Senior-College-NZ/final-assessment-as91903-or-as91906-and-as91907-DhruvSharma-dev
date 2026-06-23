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
            className="h-15 w-auto object-contain"
          />

          <div>
            <h1 className="text-xl font-bold text-[#F2901D]">
              StudentNET
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-8 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-[#F2901D] font-semibold"
                : "text-gray-700 hover:text-[#F2901D] transition-colors"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/student-info"
            className={({ isActive }) =>
              isActive
                ? "text-[#F2901D] font-semibold"
                : "text-gray-700 hover:text-[#F2901D] transition-colors"
            }
          >
            Student Info
          </NavLink>

          <NavLink
            to="/curriculum"
            className={({ isActive }) =>
              isActive
                ? "text-[#F2901D] font-semibold"
                : "text-gray-700 hover:text-[#F2901D] transition-colors"
            }
          >
            Curriculum
          </NavLink>

          <NavLink
            to="/careers"
            className={({ isActive }) =>
              isActive
                ? "text-[#F2901D] font-semibold"
                : "text-gray-700 hover:text-[#F2901D] transition-colors"
            }
          >
            Careers
          </NavLink>

          <NavLink
            to="/web-apps"
            className={({ isActive }) =>
              isActive
                ? "text-[#F2901D] font-semibold"
                : "text-gray-700 hover:text-[#F2901D] transition-colors"
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