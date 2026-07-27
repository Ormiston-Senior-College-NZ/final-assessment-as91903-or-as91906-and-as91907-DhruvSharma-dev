import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import { useSearchParams } from "react-router-dom";
import HighlightText from "../components/HighlightText";

export default function Norms() {
  // Highlight words when the navbar search sends a query here.
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get("highlight") || "";

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-6">
        <HighlightText text="School Norms" highlight={highlight} />
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        {/* This search input is a placeholder for the future searchable norms feature. */}
        <input
          type="text"
          placeholder="Search school norms..."
          className="
            w-full
            bg-white
            border
            border-[#C49A00]
            rounded-lg
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-[#C49A00]
          "
        />
      </div>

      <div className="grid grid-cols-12 gap-4">

        {/* Categories */}
        <DashboardCard
          title="Categories"
          className="col-span-3"
        >
          <div className="space-y-2">

            {/* Later these buttons can filter real norms loaded from Flask. */}
            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              <HighlightText text="Attendance" highlight={highlight} />
            </button>

            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              <HighlightText text="Uniform" highlight={highlight} />
            </button>

            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              <HighlightText text="Behaviour" highlight={highlight} />
            </button>

            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              <HighlightText text="Devices" highlight={highlight} />
            </button>

            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              <HighlightText text="Exams" highlight={highlight} />
            </button>

            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              <HighlightText text="Safety" highlight={highlight} />
            </button>

          </div>
        </DashboardCard>

        {/* Selected Norm */}
        <DashboardCard
          title="Attendance"
          className="col-span-9"
        >
          {/* Placeholder content until the school norms API/database is added. */}
          <h2 className="text-2xl font-semibold mb-4">
            <HighlightText text="Attendance Expectations" highlight={highlight} />
          </h2>

          <p className="leading-7 text-gray-700">
            <HighlightText
              text="School attendance expectations will appear here. Later this content will be loaded from the Flask backend so staff can update the norms without changing the website."
              highlight={highlight}
            />
          </p>
        </DashboardCard>

      </div>
    </Layout>
  );
}
