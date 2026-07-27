import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import { Link, useSearchParams } from "react-router-dom";
import HighlightText from "../components/HighlightText";
import {
  eventCalendarEmbedUrl,
  eventCalendarViewUrl,
  getStoredAnnouncements,
  getStoredWeekItems,
  loadStoredAnnouncements,
  loadStoredWeekItems,
} from "../data/studentNetData";
import mapOne from "../assets/map-1.jpg";
import mapTwo from "../assets/map-2.jpg";
import mapThree from "../assets/map-3.jpg";

const schoolMaps = [
  // These images are shown in the Map of School carousel.
  {
    title: "Main Building (Ground Floor)",
    image: mapOne,
  },
  {
    title: "Main Building (Second Floor)",
    image: mapTwo,
  },
  {
    title: "Ōwhanga and Pūriri Area (on the Field)",
    image: mapThree,
  },
];

export default function Home() {
  // Read the search word from the URL so matching dashboard text can be highlighted.
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get("highlight") || "";
  const [weekItems, setWeekItems] = useState(() => getStoredWeekItems());
  const [announcements, setAnnouncements] = useState(() => getStoredAnnouncements());
  const [calendarFrameKey, setCalendarFrameKey] = useState(0);
  const [activeMapIndex, setActiveMapIndex] = useState(0);
  const activeMap = schoolMaps[activeMapIndex];

  function showPreviousMap() {
    // Move to the previous map, looping back to the end if needed.
    setActiveMapIndex((currentIndex) =>
      currentIndex === 0 ? schoolMaps.length - 1 : currentIndex - 1,
    );
  }

  function showNextMap() {
    // Move to the next map, looping back to the first map if needed.
    setActiveMapIndex((currentIndex) =>
      currentIndex === schoolMaps.length - 1 ? 0 : currentIndex + 1,
    );
  }

  useEffect(() => {
    // Load shared home page content from Flask/SQLite when the page opens.
    loadStoredWeekItems().then(setWeekItems);
    loadStoredAnnouncements().then(setAnnouncements);
  }, []);

  return (
    <Layout>
      <section className="space-y-4">
        {/* Top dashboard row: week notices, calendar, and sheet options. */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

          <DashboardCard
            title="What's on this week?"
            className="min-h-64 lg:col-span-3"
          >
            {/* These weekly items are edited from the Teacher Panel. */}
            <div className="space-y-3">
              {weekItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-md border border-[#F2901D]/40 bg-[#fff8ec] px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-[#F2901D]">
                      <HighlightText text={item.day} highlight={highlight} />
                    </p>
                    <p className="text-xs font-medium text-gray-600">
                      <HighlightText text={item.time} highlight={highlight} />
                    </p>
                  </div>

                  <h3 className="mt-1 text-sm font-semibold text-gray-950">
                    <HighlightText text={item.title} highlight={highlight} />
                  </h3>

                  <p className="mt-1 text-xs text-gray-600">
                    <HighlightText text={item.location} highlight={highlight} />
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
              {/* The restricted Google Sheet is embedded so OSC users can view it after logging in. */}
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
            title="Sheet Options"
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

        {/* Bottom dashboard row: school map and announcements. */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

          <DashboardCard
            title="Map of School"
            className="min-h-96 lg:col-span-8"
          >
            <div className="flex min-h-76 flex-col items-center justify-center rounded-md bg-[#404040] px-4 py-6 text-white">
              <h3 className="mb-5 text-3xl font-bold">
                Map of School
              </h3>

              <div className="grid w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-3">
                {/* Faded side previews show there are more maps to browse. */}
                <img
                  src={schoolMaps[
                    activeMapIndex === 0 ? schoolMaps.length - 1 : activeMapIndex - 1
                  ].image}
                  alt=""
                  className="hidden h-36 w-full rounded-md border border-white/20 object-cover opacity-45 sm:block"
                />

                <div className="relative w-[min(100%,34rem)] overflow-hidden rounded-md border border-[#F2901D] bg-white text-gray-950 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="px-4 pt-3 text-sm font-bold text-[#F2901D]">
                      {activeMap.title}
                    </p>
                    <p className="px-4 pt-3 text-xs font-semibold text-gray-500">
                      {activeMapIndex + 1}/{schoolMaps.length}
                    </p>
                  </div>

                  <img
                    src={activeMap.image}
                    alt={`${activeMap.title} school map`}
                    className="h-56 w-full object-contain px-3 pb-3"
                  />
                </div>

                <img
                  src={schoolMaps[
                    activeMapIndex === schoolMaps.length - 1 ? 0 : activeMapIndex + 1
                  ].image}
                  alt=""
                  className="hidden h-36 w-full rounded-md border border-white/20 object-cover opacity-45 sm:block"
                />
              </div>

              <div className="mt-4 flex gap-4">
                {/* Arrow buttons change which map is shown in the centre. */}
                <button
                  type="button"
                  onClick={showPreviousMap}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2901D] text-2xl font-bold text-black shadow-md"
                  aria-label="Previous map"
                >
                  {"<"}
                </button>

                <button
                  type="button"
                  onClick={showNextMap}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2901D] text-2xl font-bold text-black shadow-md"
                  aria-label="Next map"
                >
                  {">"}
                </button>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Announcements"
            className="min-h-96 lg:col-span-4"
          >
            {/* Announcements are loaded from the same shared content system as week items. */}
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <article
                  key={announcement.id}
                  className="rounded-md border border-[#F2901D]/40 bg-[#fff8ec] px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-gray-950">
                      <HighlightText text={announcement.title} highlight={highlight} />
                    </h3>

                    <p className="text-xs font-semibold text-[#F2901D]">
                      <HighlightText text={announcement.date} highlight={highlight} />
                    </p>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    <HighlightText text={announcement.message} highlight={highlight} />
                  </p>
                </article>
              ))}
            </div>
          </DashboardCard>

        </div>

        {/* Teacher login entry point. */}
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
