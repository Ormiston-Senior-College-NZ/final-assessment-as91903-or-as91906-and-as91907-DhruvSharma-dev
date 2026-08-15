// Student information page containing two client-side NCEA calculators and
// teacher-editable resource links. Calculator state never enters the database;
// only shared link content is loaded through Flask/SQLite.
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HighlightText from "../components/HighlightText";
import Layout from "../components/Layout";
import {
  getStoredStudentInfoLinks,
  loadStoredStudentInfoLinks,
} from "../data/studentNetData";

const nceaGradeOptions = [
  // NCEA grades use different point values in both calculations. Keeping the
  // labels and values together means the display and maths use the same data.
  { label: "Achieved", value: "achieved", points: 2 },
  { label: "Merit", value: "merit", points: 3 },
  { label: "Excellence", value: "excellence", points: 4 },
];

const startingCreditEntries = [
  // The rows have fixed grades in the requested order. Students only enter the
  // credit totals, which is quicker and prevents selecting the same grade twice.
  { id: 1, credits: "", grade: "excellence" },
  { id: 2, credits: "", grade: "merit" },
  { id: 3, credits: "", grade: "achieved" },
];

function CreditGradeRow({ creditEntry, onCreditEntryChange }) {
  // Find the full grade object so its readable label can be shown beside the input.
  const grade = nceaGradeOptions.find(
    (gradeOption) => gradeOption.value === creditEntry.grade,
  );

  return (
    <div className="grid min-h-16 grid-cols-[1fr_auto] overflow-hidden rounded-lg border border-[#F2901D] bg-white">
      <input
        type="number"
        min="0"
        value={creditEntry.credits}
        onChange={(event) =>
          onCreditEntryChange(creditEntry.id, "credits", event.target.value)
        }
        placeholder="0"
        aria-label="Credits"
        className="
          h-full
          min-w-0
          w-full
          min-h-16
          px-3
          text-base
          text-[#F2901D]
          outline-none
          placeholder:text-[#F2901D]
        "
      />

      <div className="flex min-h-16 w-32 items-center justify-center border-l border-[#F2901D] px-3 text-sm font-semibold text-[#F2901D] sm:w-44 sm:text-base">
        {grade?.label}
      </div>
    </div>
  );
}

function CalculatorPanel({ title, calculatorType, highlight }) {
  // The same panel is used twice. calculatorType decides whether it performs the
  // GPA calculation or the Rank Score calculation, avoiding duplicated components.
  const [creditEntries, setCreditEntries] = useState(startingCreditEntries);

  const calculatorResult = useMemo(() => {
    // useMemo recalculates only when the entered credits or calculator type changes.
    const completedCreditEntries = creditEntries
      .map((creditEntry) => {
        // HTML inputs return strings, so credits must be converted before adding.
        const credits = Number(creditEntry.credits);
        const grade = nceaGradeOptions.find(
          (option) => option.value === creditEntry.grade,
        );

        if (!credits || !grade) {
          // Ignore empty or invalid rows so they do not affect the final result.
          return null;
        }

        return {
          credits,
          points: grade.points,
        };
      })
      .filter(Boolean);

    if (calculatorType === "rankScore") {
      // Rank Score uses at most the best 80 credits. Sorting by points ensures
      // Excellence credits are counted first, then Merit, and then Achieved.
      let remainingCredits = 80;
      const bestCreditTotal = completedCreditEntries
        .sort(
          (firstCreditEntry, secondCreditEntry) =>
            secondCreditEntry.points - firstCreditEntry.points,
        )
        .reduce((total, creditEntry) => {
          if (!remainingCredits) {
            return total;
          }

          const creditsToCount = Math.min(creditEntry.credits, remainingCredits);
          // Only use the credits that still fit inside the 80-credit limit.
          remainingCredits -= creditsToCount;

          return total + creditsToCount * creditEntry.points;
        }, 0);

      return Math.min(bestCreditTotal, 320).toString();
    }

    // GPA is a weighted average: total grade points divided by total credits.
    // Multiplying credits by grade points gives each grade the correct weighting.
    const totalCreditsAndPoints = completedCreditEntries.reduce(
      (currentTotals, creditEntry) => ({
        credits: currentTotals.credits + creditEntry.credits,
        points: currentTotals.points + creditEntry.credits * creditEntry.points,
      }),
      { credits: 0, points: 0 },
    );

    if (!totalCreditsAndPoints.credits) {
      // Dividing by zero would display NaN, so show the starting result instead.
      return "0.00";
    }

    return (
      totalCreditsAndPoints.points / totalCreditsAndPoints.credits
    ).toFixed(2);
  }, [creditEntries, calculatorType]);

  function updateCreditEntry(creditEntryId, field, value) {
    // React state should not be edited directly. map creates a new array and only
    // replaces the matching row, leaving the other two credit values unchanged.
    setCreditEntries((currentCreditEntries) =>
      currentCreditEntries.map((creditEntry) =>
        creditEntry.id === creditEntryId
          ? { ...creditEntry, [field]: value }
          : creditEntry,
      ),
    );
  }

  return (
    <section className="min-h-104 rounded-lg border border-[#F2901D] bg-white p-4 sm:min-h-136 sm:p-6">
      <h1 className="text-xl font-semibold text-gray-950 sm:text-2xl">
        <HighlightText text={title} highlight={highlight} />
      </h1>

      <div className="mt-10 flex flex-col items-center sm:mt-18">
        <p className="text-5xl font-normal leading-none text-black sm:text-7xl">
          {calculatorResult}
        </p>

        <div className="mt-8 flex w-full max-w-xl flex-col gap-3">
          {creditEntries.map((creditEntry) => (
            <CreditGradeRow
              key={creditEntry.id}
              creditEntry={creditEntry}
              onCreditEntryChange={updateCreditEntry}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoCard({ label, url, highlight }) {
  // Bottom Student Info card, optionally linking to an external resource.
  const hasLink = Boolean(url);
  // If there is no URL yet, render a disabled button instead of a broken link.
  const MoreInfoButton = hasLink ? "a" : "button";

  return (
    <article
      className="
        flex
        flex-col
        min-h-18
        items-stretch
        justify-between
        gap-4
        rounded-lg
        border
        border-[#F2901D]
        bg-white
        px-6
        py-3
        sm:flex-row
        sm:items-center
      "
    >
      <h2 className="text-lg font-medium text-gray-950 sm:text-xl">
        <HighlightText text={label} highlight={highlight} />
      </h2>

      <MoreInfoButton
        href={hasLink ? url : undefined}
        target={hasLink ? "_blank" : undefined}
        rel={hasLink ? "noopener noreferrer" : undefined}
        type={hasLink ? undefined : "button"}
        disabled={!hasLink}
        className={`
          rounded-lg
          px-5
          py-3
          text-center
          text-base
          font-semibold
          text-white
          ${hasLink ? "bg-[#F2901D]" : "bg-[#F2901D]/70"}
        `}
      >
        More Info
      </MoreInfoButton>
    </article>
  );
}

export default function StudentInfo() {
  // Load teacher-edited bottom links from Flask/SQLite.
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get("highlight") || "";
  const [studentInfoLinks] = useState(() => getStoredStudentInfoLinks());
  const [savedStudentInfoLinks, setSavedStudentInfoLinks] = useState(studentInfoLinks);

  useEffect(() => {
    // Load the teacher-edited bottom cards after the first render.
    loadStoredStudentInfoLinks().then(setSavedStudentInfoLinks);
  }, []);

  return (
    <Layout>
      <section className="space-y-5">
        <div className="grid grid-cols-1 gap-7 xl:grid-cols-2">
          <CalculatorPanel
            title="GPA Calculator"
            calculatorType="gpa"
            highlight={highlight}
          />

          <CalculatorPanel
            title="Rank Score Calculator"
            calculatorType="rankScore"
            highlight={highlight}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Bottom cards are editable from the Teacher Panel. */}
          {savedStudentInfoLinks.map((card) => (
            <InfoCard
              key={card.id}
              highlight={highlight}
              {...card}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
