import { useMemo, useState } from "react";
import Layout from "../components/Layout";

const nceaGradeOptions = [
  { label: "Achieved", value: "achieved", points: 2 },
  { label: "Merit", value: "merit", points: 3 },
  { label: "Excellence", value: "excellence", points: 4 },
];

const startingCreditEntries = [
  { id: 1, credits: "", grade: "" },
  { id: 2, credits: "", grade: "" },
  { id: 3, credits: "", grade: "" },
];

const studentInfoCards = [
  {
    title: "Student Leadership",
    linkUrl: "",
  },
  {
    title: "DoE at OSC",
    linkUrl: "",
  },
  {
    title: "Sports",
    linkUrl: "https://sites.google.com/ormiston.school.nz/oscsports/welcome",
  },
];

function CreditGradeRow({ creditEntry, onCreditEntryChange }) {
  return (
    <div className="grid h-16 grid-cols-[1fr_13rem] items-center rounded-lg border border-[#F2901D] bg-white">
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
          rounded-md
          px-3
          text-lg
          text-[#F2901D]
          outline-none
          placeholder:text-[#F2901D]
        "
      />

      <select
        value={creditEntry.grade}
        onChange={(event) =>
          onCreditEntryChange(creditEntry.id, "grade", event.target.value)
        }
        aria-label="Grade"
        className="
          h-full
          w-full
          rounded-lg
          border
          border-[#F2901D]
          bg-white
          px-3
          text-lg
          text-[#F2901D]
          outline-none
        "
      >
        <option value="">Grade..</option>
        {nceaGradeOptions.map((grade) => (
          <option
            key={grade.value}
            value={grade.value}
          >
            {grade.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CalculatorPanel({ title, calculatorType }) {
  const [creditEntries, setCreditEntries] = useState(startingCreditEntries);

  const calculatorResult = useMemo(() => {
    const completedCreditEntries = creditEntries
      .map((creditEntry) => {
        const credits = Number(creditEntry.credits);
        const grade = nceaGradeOptions.find(
          (option) => option.value === creditEntry.grade,
        );

        if (!credits || !grade) {
          return null;
        }

        return {
          credits,
          points: grade.points,
        };
      })
      .filter(Boolean);

    if (calculatorType === "rankScore") {
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
          remainingCredits -= creditsToCount;

          return total + creditsToCount * creditEntry.points;
        }, 0);

      return Math.min(bestCreditTotal, 320).toString();
    }

    const totalCreditsAndPoints = completedCreditEntries.reduce(
      (currentTotals, creditEntry) => ({
        credits: currentTotals.credits + creditEntry.credits,
        points: currentTotals.points + creditEntry.credits * creditEntry.points,
      }),
      { credits: 0, points: 0 },
    );

    if (!totalCreditsAndPoints.credits) {
      return "0.00";
    }

    return (
      totalCreditsAndPoints.points / totalCreditsAndPoints.credits
    ).toFixed(2);
  }, [creditEntries, calculatorType]);

  function updateCreditEntry(creditEntryId, field, value) {
    setCreditEntries((currentCreditEntries) =>
      currentCreditEntries.map((creditEntry) =>
        creditEntry.id === creditEntryId
          ? { ...creditEntry, [field]: value }
          : creditEntry,
      ),
    );
  }

  return (
    <section className="min-h-136 rounded-lg border border-[#F2901D] bg-white p-6">
      <h1 className="text-2xl font-semibold text-gray-950">
        {title}
      </h1>

      <div className="mt-18 flex flex-col items-center">
        <p className="text-7xl font-normal leading-none text-black">
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

function InfoCard({ title, linkUrl }) {
  const hasLink = Boolean(linkUrl);
  const MoreInfoButton = hasLink ? "a" : "button";

  return (
    <article
      className="
        flex
        min-h-18
        items-center
        justify-between
        gap-4
        rounded-lg
        border
        border-[#F2901D]
        bg-white
        px-6
        py-3
      "
    >
      <h2 className="text-xl font-medium text-gray-950">
        {title}
      </h2>

      <MoreInfoButton
        href={hasLink ? linkUrl : undefined}
        target={hasLink ? "_blank" : undefined}
        rel={hasLink ? "noopener noreferrer" : undefined}
        type={hasLink ? undefined : "button"}
        disabled={!hasLink}
        className={`
          rounded-lg
          px-5
          py-3
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
  return (
    <Layout>
      <section className="space-y-5">
        <div className="grid grid-cols-1 gap-7 xl:grid-cols-2">
          <CalculatorPanel
            title="GPA Calculator"
            calculatorType="gpa"
          />

          <CalculatorPanel
            title="Rank Score Calculator"
            calculatorType="rankScore"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {studentInfoCards.map((card) => (
            <InfoCard
              key={card.title}
              {...card}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
