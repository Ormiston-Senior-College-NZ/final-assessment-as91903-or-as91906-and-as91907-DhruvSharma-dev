// Student-facing curriculum browser backed by the normalized subject, level and
// subject_levels tables. It supports level navigation, fuzzy subject filtering,
// selected-subject details and highlighting from the global Navbar search.
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HighlightText from "../components/HighlightText";
import Layout from "../components/Layout";
import {
  curriculumLevels,
  getStoredSubjects,
  loadStoredSubjects,
} from "../data/studentNetData";
import { scoreSearchText } from "../utils/siteSearch";

export default function Curriculum() {
  // useSearchParams reads values from the URL. The Navbar adds a "highlight"
  // value when a student uses the main search, so this page can mark that word.
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get("highlight") || "";

  // Level 2 is selected when the page first opens because it is the main year
  // level currently being used. Clicking a level button changes this value.
  const [activeLevel, setActiveLevel] = useState("level2");

  // This search is separate from the Navbar search. It only filters subjects
  // inside the level that the student is currently viewing.
  const [searchTerm, setSearchTerm] = useState("");
  // The function form of useState only reads local storage on the first render.
  // This gives the page content immediately instead of waiting for the backend.
  const [subjects, setSubjects] = useState(() => getStoredSubjects());

  useEffect(() => {
    // Local storage is shown first, then this request checks SQLite for the
    // latest teacher-edited version and replaces the subjects if it finds one.
    loadStoredSubjects().then(setSubjects);
  }, []);

  const filteredSubjects = useMemo(() => {
    // useMemo avoids running the full search again unless the level, search text,
    // or subject data changes. This matters more as teachers add more subjects.
    // Subjects are stored as an object with level1, level2, level3 and
    // scholarships arrays. || [] prevents an error if one group is missing.
    const activeSubjects = subjects[activeLevel] || [];

    // Removing spaces and changing capitals makes searches such as " English "
    // behave the same as "english".
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      // With an empty search, keep the teacher's original subject order.
      return activeSubjects;
    }

    // Subject names are multiplied by two because they are normally a stronger
    // match than a word that only appears in the description or pathway.
    return activeSubjects
      .map((subject) => ({
        subject,
        score:
          scoreSearchText(normalizedSearchTerm, subject.name) * 2 +
          scoreSearchText(
            normalizedSearchTerm,
            `${subject.description} ${subject.pathway}`,
          ),
      }))
      .filter((result) => result.score > 0)
      // Put the strongest search result at the top of the subject list.
      .sort((firstResult, secondResult) => secondResult.score - firstResult.score)
      // Remove the temporary score because the JSX only needs each subject.
      .map((result) => result.subject);
  }, [activeLevel, searchTerm, subjects]);

  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  // Keep the clicked subject selected if it is still in the filtered list.
  // Otherwise, show the first result so the information panel is never outdated.
  const selectedSubject =
    filteredSubjects.find((subject) => subject.id === selectedSubjectId) ||
    filteredSubjects[0];

  return (
    <Layout>
      {/* The page uses the shared Layout so it gets the Navbar and Quick Links. */}
      <section className="space-y-4 lg:h-[calc(100vh-13rem)] lg:overflow-hidden">
        {/* These buttons switch between the four curriculum groups. The grid
            changes from one column on phones to four columns on large screens. */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {curriculumLevels.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => {
                // Clear the old selection because subject IDs belong to a level.
                setActiveLevel(level.id);
                setSelectedSubjectId("");
              }}
              className={`w-full rounded-md border border-[#F2901D] px-5 py-3 text-base font-bold transition sm:py-4 sm:text-xl ${
                // Orange shows the student which curriculum level is active.
                activeLevel === level.id
                  ? "bg-[#F2901D] text-white"
                  : "bg-white text-gray-950 hover:bg-[#fff5e9]"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        {/* The left side contains navigation and the right side contains details.
            On smaller screens the two areas stack so they remain readable. */}
        <div className="grid grid-cols-1 gap-4 lg:h-[calc(100%-4.75rem)] lg:grid-cols-[20rem_1fr] lg:overflow-hidden">
          <aside className="flex min-h-0 flex-col rounded-lg border border-[#F2901D] bg-white p-4">
            <h1 className="mb-4 text-xl font-bold text-gray-950">
              Subject:
            </h1>

            <input
              type="search"
              value={searchTerm}
              // Controlled input: React state always contains the current text.
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search..."
              className="mb-3 w-full rounded-md border border-[#F2901D] px-3 py-3 text-base outline-none focus:ring-2 focus:ring-[#F2901D]"
            />

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {/* Only subjects that matched the search are turned into buttons. */}
              {filteredSubjects.map((subject) => (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => setSelectedSubjectId(subject.id)}
                  className={`w-full rounded-md border border-[#F2901D] px-4 py-3 text-left text-sm font-semibold transition ${
                    // The selected subject uses orange to match the level buttons.
                    selectedSubject?.id === subject.id
                      ? "bg-[#F2901D] text-white"
                      : "bg-white text-gray-950 hover:bg-[#fff5e9]"
                  }`}
                >
                  <HighlightText text={subject.name} highlight={highlight} />
                </button>
              ))}

              {!filteredSubjects.length && (
                // Give useful feedback instead of leaving an unexplained blank box.
                <p className="rounded-md border border-dashed border-[#F2901D] px-4 py-6 text-center text-sm text-gray-500">
                  No subjects found.
                </p>
              )}
            </div>
          </aside>

          {/* This panel changes whenever a subject button is selected. */}
          <article className="min-h-96 overflow-y-auto rounded-lg border border-[#F2901D] bg-white p-4 sm:min-h-144 sm:p-5 lg:min-h-0">
            <h2 className="mb-5 text-xl font-bold text-gray-950">
              More Info:
            </h2>

            {selectedSubject ? (
              // A valid subject has a name, description and possible pathway.
              <div className="max-w-4xl space-y-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-[#F2901D]">
                    {/* Find the readable label, such as LEVEL 2, from its ID. */}
                    {curriculumLevels.find((level) => level.id === activeLevel)?.label}
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">
                    <HighlightText text={selectedSubject.name} highlight={highlight} />
                  </h3>
                </div>

                <p className="whitespace-pre-wrap wrap-break-word text-base leading-7 text-gray-700 sm:text-lg sm:leading-8">
                  {/* whitespace-pre-wrap keeps line breaks entered by a teacher. */}
                  <HighlightText text={selectedSubject.description} highlight={highlight} />
                </p>

                <div className="rounded-lg border border-[#F2901D]/40 bg-[#fff8ec] p-4">
                  <h4 className="text-base font-bold text-gray-950">
                    Pathway
                  </h4>
                  <p className="mt-2 whitespace-pre-wrap wrap-break-word leading-7 text-gray-700">
                    <HighlightText text={selectedSubject.pathway} highlight={highlight} />
                  </p>
                </div>
              </div>
            ) : (
              // This state can happen when a level has no subjects saved yet.
              <p className="text-gray-500">
                Add subjects in the Teacher Panel to display curriculum information here.
              </p>
            )}
          </article>
        </div>
      </section>
    </Layout>
  );
}
