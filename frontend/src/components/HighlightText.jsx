export default function HighlightText({ text, highlight }) {
  // Show normal text when there is nothing to highlight.
  if (!highlight || !text) {
    return text;
  }

  // Split the text wherever the searched word appears.
  // This stops symbols like "." or "?" from breaking the search pattern.
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));

  return parts.map((part, index) =>
    // Matching parts get a yellow background.
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
