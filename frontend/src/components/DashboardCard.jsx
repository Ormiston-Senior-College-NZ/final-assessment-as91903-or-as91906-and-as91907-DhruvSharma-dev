export default function DashboardCard({
  title,
  children,
  className = "",
}) {
  return (
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