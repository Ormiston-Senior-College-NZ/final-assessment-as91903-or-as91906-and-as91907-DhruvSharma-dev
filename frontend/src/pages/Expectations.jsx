import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HighlightText from "../components/HighlightText";
import Layout from "../components/Layout";
import {
  getStoredNorms,
  loadStoredNorms,
} from "../data/studentNetData";

export default function Expectations() {
  // Highlight the word searched in the navbar.
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get("highlight") || "";
  const [norms, setNorms] = useState(() => getStoredNorms());
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    // Get the newest expectations saved by a teacher.
    loadStoredNorms().then(setNorms);
  }, []);

  const categories = useMemo(() => {
    // Make one button for each category without repeats.
    const savedCategories = norms
      .map((norm) => norm.category)
      .filter(Boolean);

    return [...new Set(savedCategories)];
  }, [norms]);

  const selectedCategory = activeCategory || categories[0] || "";

  const filteredNorms = useMemo(() => {
    // Only show expectations from the chosen category.
    return norms.filter((norm) => {
      const normCategory = norm.category || "";

      return normCategory === selectedCategory;
    });
  }, [norms, selectedCategory]);

  return (
    <Layout>
      <section className="space-y-4 lg:h-[calc(100vh-13rem)] lg:overflow-hidden">
        <div className="grid grid-cols-1 gap-4 lg:h-full lg:grid-cols-[17rem_1fr] lg:overflow-hidden">
          <aside className="flex min-h-0 flex-col rounded-lg border border-[#F2901D] bg-white p-4">
            <h1 className="mb-4 text-xl font-bold text-gray-950">
              Expectations:
            </h1>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`w-full rounded-md border border-[#F2901D] px-4 py-3 text-left text-sm font-semibold transition sm:text-base ${
                    selectedCategory === category
                      ? "bg-[#F2901D] text-white"
                      : "bg-white text-gray-950 hover:bg-[#fff5e9]"
                  }`}
                >
                  <HighlightText text={category} highlight={highlight} />
                </button>
              ))}
            </div>
          </aside>

          <article className="min-h-96 overflow-y-auto rounded-lg border border-[#F2901D] bg-white p-4 sm:min-h-144 sm:p-5 lg:min-h-0">
            <h2 className="mb-5 text-xl font-bold text-gray-950">
              Expectations:
            </h2>

            {filteredNorms.length ? (
              <div className="max-w-5xl space-y-5">
                {filteredNorms.map((norm) => (
                  <section
                    key={norm.id}
                    className="rounded-lg border border-[#F2901D]/40 bg-[#fff8ec] p-4"
                  >
                    <p className="text-sm font-bold uppercase tracking-wide text-[#F2901D]">
                      <HighlightText text={norm.category} highlight={highlight} />
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">
                      <HighlightText text={norm.title} highlight={highlight} />
                    </h3>

                    <p className="mt-4 whitespace-pre-wrap wrap-break-word text-base leading-7 text-gray-700 sm:text-lg sm:leading-8">
                      <HighlightText text={norm.content} highlight={highlight} />
                    </p>
                  </section>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Add expectations in the Teacher Panel to display school expectations here.
              </p>
            )}
          </article>
        </div>
      </section>
    </Layout>
  );
}
