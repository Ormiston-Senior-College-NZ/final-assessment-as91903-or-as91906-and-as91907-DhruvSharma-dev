import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="px-6 pt-6">
      <nav className="bg-white rounded-xl shadow-md h-16 flex items-center justify-between px-6">

        {/* Logo */}
        <h1 className="text-2xl font-bold text-[#F2901D]">
          StudentNET
        </h1>

        {/* Navigation Links */}
        <div className="flex gap-6 text-gray-700 font-medium">

          <Link
            to="/"
            className="hover:text-[#F2901D] transition"
          >
            Home
          </Link>

          <Link
            to="/student-info"
            className="hover:text-[#F2901D] transition"
          >
            Student Info
          </Link>

          <Link
            to="/curriculum"
            className="hover:text-[#F2901D] transition"
          >
            Curriculum
          </Link>

          <Link
            to="/careers"
            className="hover:text-[#F2901D] transition"
          >
            Careers
          </Link>

          <Link
            to="/web-apps"
            className="hover:text-[#F2901D] transition"
          >
            Web Apps
          </Link>

        </div>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg px-3 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-[#F2901D]"
        />

      </nav>
    </div>
  );
}