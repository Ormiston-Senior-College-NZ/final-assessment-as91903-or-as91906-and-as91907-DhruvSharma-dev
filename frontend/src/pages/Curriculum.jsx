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
  // Get the word searched in the navbar.
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get("highlight") || "";
  const [activeLevel, setActiveLevel] = useState("level2");
  const [searchTerm, setSearchTerm] = useState("");
  const [subjects, setSubjects] = useState(() => getStoredSubjects());

  useEffect(() => {
    // Load any subjects the teacher has changed.
    loadStoredSubjects().then(setSubjects);
  }, []);

  const filteredSubjects = useMemo(() => {
    // Search names, descriptions and pathways, then show the best matches first.
    const activeSubjects = subjects[activeLevel] || [];
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return activeSubjects;
    }

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
      .sort((firstResult, secondResult) => secondResult.score - firstResult.score)
      .map((result) => result.subject);
  }, [activeLevel, searchTerm, subjects]);

  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const selectedSubject =
    filteredSubjects.find((subject) => subject.id === selectedSubjectId) ||
    filteredSubjects[0];

  return (
    <Layout>
      <section className="space-y-4 lg:h-[calc(100vh-13rem)] lg:overflow-hidden">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {curriculumLevels.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => {
                setActiveLevel(level.id);
                setSelectedSubjectId("");
              }}
              className={`w-full rounded-md border border-[#F2901D] px-5 py-3 text-base font-bold transition sm:py-4 sm:text-xl ${
                activeLevel === level.id
                  ? "bg-[#F2901D] text-white"
                  : "bg-white text-gray-950 hover:bg-[#fff5e9]"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:h-[calc(100%-4.75rem)] lg:grid-cols-[20rem_1fr] lg:overflow-hidden">
          <aside className="flex min-h-0 flex-col rounded-lg border border-[#F2901D] bg-white p-4">
            <h1 className="mb-4 text-xl font-bold text-gray-950">
              Subject:
            </h1>

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search..."
              className="mb-3 w-full rounded-md border border-[#F2901D] px-3 py-3 text-base outline-none focus:ring-2 focus:ring-[#F2901D]"
            />

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {filteredSubjects.map((subject) => (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => setSelectedSubjectId(subject.id)}
                  className={`w-full rounded-md border border-[#F2901D] px-4 py-3 text-left text-sm font-semibold transition ${
                    selectedSubject?.id === subject.id
                      ? "bg-[#F2901D] text-white"
                      : "bg-white text-gray-950 hover:bg-[#fff5e9]"
                  }`}
                >
                  <HighlightText text={subject.name} highlight={highlight} />
                </button>
              ))}

              {!filteredSubjects.length && (
                <p className="rounded-md border border-dashed border-[#F2901D] px-4 py-6 text-center text-sm text-gray-500">
                  No subjects found.
                </p>
              )}
            </div>
          </aside>

          <article className="min-h-96 overflow-y-auto rounded-lg border border-[#F2901D] bg-white p-4 sm:min-h-144 sm:p-5 lg:min-h-0">
            <h2 className="mb-5 text-xl font-bold text-gray-950">
              More Info:
            </h2>

            {selectedSubject ? (
              <div className="max-w-4xl space-y-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-[#F2901D]">
                    {curriculumLevels.find((level) => level.id === activeLevel)?.label}
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">
                    <HighlightText text={selectedSubject.name} highlight={highlight} />
                  </h3>
                </div>

                <p className="whitespace-pre-wrap wrap-break-word text-base leading-7 text-gray-700 sm:text-lg sm:leading-8">
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
