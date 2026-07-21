import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
  curriculumLevels,
  getStoredSubjects,
} from "../data/studentNetData";

export default function Curriculum() {
  const [activeLevel, setActiveLevel] = useState("level2");
  const [searchTerm, setSearchTerm] = useState("");
  const [subjects] = useState(() => getStoredSubjects());

  const filteredSubjects = useMemo(() => {
    const activeSubjects = subjects[activeLevel] || [];
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return activeSubjects;
    }

    return activeSubjects.filter((subject) =>
      subject.name.toLowerCase().includes(normalizedSearchTerm),
    );
  }, [activeLevel, searchTerm, subjects]);

  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const selectedSubject =
    filteredSubjects.find((subject) => subject.id === selectedSubjectId) ||
    filteredSubjects[0];

  return (
    <Layout>
      <section className="space-y-6">
        <div className="flex flex-wrap justify-center gap-3">
          {curriculumLevels.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => {
                setActiveLevel(level.id);
                setSelectedSubjectId("");
              }}
              className={`min-w-56 rounded-md border border-[#F2901D] px-8 py-4 text-xl font-bold transition ${
                activeLevel === level.id
                  ? "bg-[#F2901D] text-white"
                  : "bg-white text-gray-950 hover:bg-[#fff5e9]"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[20rem_1fr]">
          <aside className="rounded-lg border border-[#F2901D] bg-white p-4">
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

            <div className="space-y-2">
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
                  {subject.name}
                </button>
              ))}

              {!filteredSubjects.length && (
                <p className="rounded-md border border-dashed border-[#F2901D] px-4 py-6 text-center text-sm text-gray-500">
                  No subjects found.
                </p>
              )}
            </div>
          </aside>

          <article className="min-h-[36rem] rounded-lg border border-[#F2901D] bg-white p-5">
            <h2 className="mb-5 text-xl font-bold text-gray-950">
              More Info:
            </h2>

            {selectedSubject ? (
              <div className="max-w-4xl space-y-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-[#F2901D]">
                    {curriculumLevels.find((level) => level.id === activeLevel)?.label}
                  </p>

                  <h3 className="mt-1 text-3xl font-bold text-gray-950">
                    {selectedSubject.name}
                  </h3>
                </div>

                <p className="text-lg leading-8 text-gray-700">
                  {selectedSubject.description}
                </p>

                <div className="rounded-lg border border-[#F2901D]/40 bg-[#fff8ec] p-4">
                  <h4 className="text-base font-bold text-gray-950">
                    Pathway
                  </h4>
                  <p className="mt-2 leading-7 text-gray-700">
                    {selectedSubject.pathway}
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
