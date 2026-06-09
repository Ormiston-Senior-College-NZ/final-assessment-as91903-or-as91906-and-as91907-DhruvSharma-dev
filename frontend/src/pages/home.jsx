import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";

export default function Home() {
  return (
    <Layout>

      {/* Top Row */}
      <div className="grid grid-cols-12 gap-3 mb-3">

        <DashboardCard
          title="What's on this week?"
          className="col-span-3 h-64"
        />

        <DashboardCard
          title="2026 Event Calendar"
          className="col-span-7 h-64"
        />

        <DashboardCard
          title="Filter"
          className="col-span-2 h-64"
        />

      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-12 gap-3">

        <DashboardCard
          title="Map of School"
          className="col-span-8 h-80"
        />

        <DashboardCard
          title="Announcements"
          className="col-span-4 h-80"
        />

      </div>

      {/* Teacher Panel */}
      <div className="mt-4">
        <button
          className="
            bg-[#F2901D]
            text-white
            px-4
            py-2
            rounded-md
          "
        >
          Teacher's Panel
        </button>
      </div>

    </Layout>
  );
}