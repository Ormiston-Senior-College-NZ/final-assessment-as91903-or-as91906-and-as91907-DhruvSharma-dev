import { useState } from "react";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import { Link } from "react-router-dom";
import {
  eventCalendarEmbedUrl,
  eventCalendarViewUrl,
  getStoredWeekItems,
} from "../data/studentNetData";

export default function Home() {
  const [weekItems] = useState(() => getStoredWeekItems());
  const [calendarFrameKey, setCalendarFrameKey] = useState(0);

  return (
    <Layout>
      <section className="space-y-4">
        {/* Top Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

          <DashboardCard
            title="What's on this week?"
            className="min-h-64 lg:col-span-3"
          >
            <div className="space-y-3">
              {weekItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-md border border-[#F2901D]/40 bg-[#fff8ec] px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-[#F2901D]">
                      {item.day}
                    </p>
                    <p className="text-xs font-medium text-gray-600">
                      {item.time}
                    </p>
                  </div>

                  <h3 className="mt-1 text-sm font-semibold text-gray-950">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-600">
                    {item.location}
                  </p>
                </article>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="2026 Event Calendar"
            className="min-h-112 lg:col-span-7"
          >
            <div className="overflow-hidden rounded-md border border-[#F2901D]/40 bg-white">
              <iframe
                key={calendarFrameKey}
                title="OSC 2026 Event Calendar"
                src={eventCalendarEmbedUrl}
                className="h-88 w-full"
              />
            </div>

            <a
              href={eventCalendarViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-[#F2901D] hover:underline"
            >
              Open full calendar
            </a>
          </DashboardCard>

          <DashboardCard
            title="Filter"
            className="min-h-112 lg:col-span-2"
          >
            <div className="space-y-3">
              <a
                href={eventCalendarViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md border border-[#F2901D] px-3 py-3 text-center text-sm font-semibold text-gray-950 transition hover:bg-[#fff5e9]"
              >
                Open Sheet
              </a>

              <button
                type="button"
                onClick={() => setCalendarFrameKey((currentKey) => currentKey + 1)}
                className="w-full rounded-md border border-[#F2901D] px-3 py-3 text-sm font-semibold text-gray-950 transition hover:bg-[#fff5e9]"
              >
                Refresh
              </button>

              <div className="rounded-md border border-[#F2901D]/40 bg-[#fff8ec] p-3 text-xs leading-5 text-gray-700">
                OSC Google login required.
              </div>
            </div>
          </DashboardCard>

        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

          <DashboardCard
            title="Map of School"
            className="min-h-96 lg:col-span-8"
          />

          <DashboardCard
            title="Announcements"
            className="min-h-96 lg:col-span-4"
          />

        </div>

        {/* Teacher Panel */}
        <div>
          <Link
            to="/teacher-login"
            className="
              inline-flex
              items-center
              justify-center
              rounded-md
              bg-[#F2901D]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#d87d11]
            "
          >
            Teacher's Panel
          </Link>
        </div>
      </section>

    </Layout>
  );
}
