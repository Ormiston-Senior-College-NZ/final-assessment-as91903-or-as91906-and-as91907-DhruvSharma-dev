// Reusable visual container for Home dashboard sections. title describes the card,
// className lets the parent control responsive grid size, and children contain the
// feature-specific content so the border, spacing and heading stay consistent.
export default function DashboardCard({
  // title is shown at the top and children is the content placed inside the card.
  title,
  children,
  // Extra classes let each page control the card size without copying this code.
  className = "",
}) {
  return (
    /* This shared card keeps borders, spacing and headings consistent. */
    <div
      className={`
        bg-white
        border
        border-[#F2901D]
        rounded-lg
        p-3
        sm:p-4
        ${className}
      `}
    >
      <h2 className="mb-3 text-lg font-semibold sm:text-xl">
        {title}
      </h2>

      {/* React places whatever was written inside DashboardCard here. */}
      {children}
    </div>
  );
}
