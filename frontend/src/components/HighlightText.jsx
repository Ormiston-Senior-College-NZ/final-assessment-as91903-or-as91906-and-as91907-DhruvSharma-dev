export default function HighlightText({ text, highlight }) {
  // If there is no search word, show the text normally.
  if (!highlight || !text) {
    return text;
  }

  // Split the text around the searched word so matching parts can be highlighted.
  // The replace line escapes special characters like "." or "?" in a search.
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));

  return parts.map((part, index) =>
    // Matching pieces become yellow, while non-matching pieces stay normal text.
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
