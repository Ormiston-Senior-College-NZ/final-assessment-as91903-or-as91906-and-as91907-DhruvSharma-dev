import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="fixed top-4 left-6 right-6 z-50">

      <nav
        className="
          bg-white
          rounded-xl
          shadow-md
          h-14
          px-6
          flex
          items-center
          justify-between
        "
      >

        {/* Logo */}
        <div className="flex items-center gap-3">
          {/* Placeholder Logo */}
          <div
            className="
              w-10
              h-10
              rounded-lg
              border-2
              border-dashed
              border-[#C49A00]
              flex
              items-center
              justify-center
              text-xs
              text-gray-500
            "
          >
            LOGO
          </div>

          <div className="font-bold text-xl text-[#F2901D]">
            StudentNET
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-8 text-sm font-medium">

          <Link to="/">Home</Link>

          <Link to="/student-info">
            Student Info
          </Link>

          <Link to="/web-apps">
            Web Apps
          </Link>

          <Link to="/careers">
            Careers
          </Link>

          <Link to="/curriculum">
            Curriculum
          </Link>

        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="
            border
            rounded-md
            px-3
            py-1
            w-56
          "
        />

      </nav>

    </div>
  );
}