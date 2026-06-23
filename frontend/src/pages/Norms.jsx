import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";

export default function Norms() {
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-6">
        School Norms
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
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

            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              Attendance
            </button>

            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              Uniform
            </button>

            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              Behaviour
            </button>

            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              Devices
            </button>

            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              Exams
            </button>

            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              Safety
            </button>

          </div>
        </DashboardCard>

        {/* Selected Norm */}
        <DashboardCard
          title="Attendance"
          className="col-span-9"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Attendance Expectations
          </h2>

          <p className="leading-7 text-gray-700">
            School attendance expectations will appear here.
            Later this content will be loaded from the Flask backend
            so staff can update the norms without changing the website.
          </p>
        </DashboardCard>

      </div>
    </Layout>
  );
}