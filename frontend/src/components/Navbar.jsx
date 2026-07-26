import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/osc-logo.png";

const navLinkClass = ({ isActive }) =>
  `
    rounded-lg
    px-3
    py-2
    text-sm
    sm:text-base
    xl:px-4
    xl:py-2.5
    xl:text-lg
    font-semibold
    whitespace-nowrap
    transition
    duration-200
    ${
      isActive
        ? "bg-[#F2901D] text-white shadow-sm"
        : "text-gray-800 hover:bg-[#fff5e9] hover:text-[#F2901D]"
    }
  `;

const searchRoutes = [
  {
    path: "/careers",
    keywords: ["career", "careers", "gateway", "university", "apprenticeship"],
  },
  {
    path: "/curriculum",
    keywords: ["curriculum", "subject", "subjects", "ncea", "level", "pathway", "scholarship", "scholarships"],
  },
  {
    path: "/student-info",
    keywords: ["student", "gpa", "rank", "score", "sports", "leadership", "doe"],
  },
  {
    path: "/web-apps",
    keywords: ["web", "apps", "gmail", "classroom", "refseek", "myportfolio"],
  },
  {
    path: "/norms",
    keywords: ["norm", "norms", "attendance", "uniform", "behaviour", "devices", "exams"],
  },
  {
    path: "/",
    keywords: ["announcement", "announcements", "map", "calendar", "event", "week"],
  },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearchSubmit(event) {
    event.preventDefault();

    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    if (!trimmedSearchTerm) {
      return;
    }

    const matchingRoute =
      searchRoutes.find((route) =>
        route.keywords.some((keyword) => trimmedSearchTerm.includes(keyword)),
      ) || searchRoutes[0];

    navigate(`${matchingRoute.path}?highlight=${encodeURIComponent(trimmedSearchTerm)}`);
    setSearchTerm("");
  }

  return (
    <div className="fixed left-0 right-0 top-3 z-50 px-3 sm:px-6">
      <nav
        className="
          relative
          mx-auto
          max-w-488
          bg-white
          rounded-xl
          shadow-[0_18px_45px_rgba(0,0,0,0.45)]
          min-h-16
          px-3
          py-3
          sm:px-6
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          xl:flex-nowrap
          xl:gap-6
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Ormiston Senior College StudentNET Logo"
            className="h-10 w-auto object-contain sm:h-12"
          />
        </div>

        {/* Navigation */}
        <div className="order-3 flex w-full items-center gap-2 overflow-x-auto pb-1 sm:gap-3 xl:order-0 xl:w-auto xl:flex-1 xl:justify-center xl:gap-4 xl:overflow-visible xl:pb-0">
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
        <form onSubmit={handleSearchSubmit}>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search..."
            className="
              w-40
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
              sm:w-56
            "
          />
        </form>
      </nav>
    </div>
  );
}
