export default function HighlightText({ text, highlight }) {
  if (!highlight || !text) {
    return text;
  }

  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <mark
        key={`${part}-${index}`}
        className="rounded bg-yellow-200 px-1 text-gray-950"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
