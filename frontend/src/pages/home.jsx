import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-6">
        Home Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-white rounded-xl shadow p-4 h-64">
          What's on this week?
        </div>

        <div className="bg-white rounded-xl shadow p-4 h-64 col-span-3">
          Event Calendar
        </div>

      </div>

      <div className="grid grid-cols-3 gap-4">

        <div className="bg-white rounded-xl shadow p-4 h-80 col-span-2">
          School Map
        </div>

        <div className="bg-white rounded-xl shadow p-4 h-80">
          Announcements
        </div>

      </div>
    </Layout>
  );
}