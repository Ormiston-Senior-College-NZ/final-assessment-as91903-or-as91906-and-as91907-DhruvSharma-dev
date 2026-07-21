import { NavLink } from "react-router-dom";
import logo from "../assets/osc-logo.png";

const navLinkClass = ({ isActive }) =>
  `
    rounded-lg
    px-4
    py-2.5
    text-lg
    font-semibold
    transition
    duration-200
    ${
      isActive
        ? "bg-[#F2901D] text-white shadow-sm"
        : "text-gray-800 hover:bg-[#fff5e9] hover:text-[#F2901D]"
    }
  `;

export default function Navbar() {
  return (
    <div className="fixed left-0 right-0 top-4 z-50 px-6">
      <nav
        className="
          mx-auto
          max-w-488
          bg-white
          rounded-xl
          shadow-md
          min-h-16
          px-6
          flex
          items-center
          justify-between
          gap-6
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
        <div className="flex flex-1 items-center justify-center gap-4">
          <NavLink
            to="/"
            className={navLinkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/student-info"
            className={navLinkClass}
          >
            Student Info
          </NavLink>

          <NavLink
            to="/web-apps"
            className={navLinkClass}
          >
            Web-Based App(s)
          </NavLink>

          <NavLink
            to="/careers"
            className={navLinkClass}
          >
            Careers
          </NavLink>

          <NavLink
            to="/curriculum"
            className={navLinkClass}
          >
            Curriculum
          </NavLink>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="
            w-56
            shrink-0
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
