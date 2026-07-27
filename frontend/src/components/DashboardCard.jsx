export default function DashboardCard({
  title,
  children,
  className = "",
}) {
  return (
    /* Reusable white dashboard card used across the home page and content pages. */
    <div
      className={`
        bg-white
        border
        border-[#F2901D]
        rounded-lg
        p-4
        ${className}
      `}
    >
      <h2 className="font-semibold text-xl mb-3">
        {title}
      </h2>

      {children}
    </div>
  );
}
