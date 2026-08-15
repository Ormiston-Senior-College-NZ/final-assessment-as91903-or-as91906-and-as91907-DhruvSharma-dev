// Search functions used by the Navbar. They compare the search text with page
// keywords and allow for small spelling mistakes.
function normalizeSearchText(value = "") {
  // Convert different versions of the same text into one consistent format.
  // For example, "NCEA-Level 2" becomes "ncea level 2". Normalising accents,
  // punctuation and capital letters prevents them from changing search results.
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function editDistance(firstWord, secondWord) {
  // This is the Levenshtein distance algorithm. It counts the smallest number
  // of inserted, removed, or changed letters needed to turn one word into another.
  // The previous row is reused to avoid creating a full two-dimensional table.
  const previousRow = Array.from(
    { length: secondWord.length + 1 },
    (_, index) => index,
  );

  for (let firstIndex = 1; firstIndex <= firstWord.length; firstIndex += 1) {
    let diagonal = previousRow[0];
    previousRow[0] = firstIndex;

    for (let secondIndex = 1; secondIndex <= secondWord.length; secondIndex += 1) {
      // Save the old cell because it becomes the diagonal value on the next loop.
      const oldValue = previousRow[secondIndex];
      const substitutionCost =
        firstWord[firstIndex - 1] === secondWord[secondIndex - 1] ? 0 : 1;

      previousRow[secondIndex] = Math.min(
        previousRow[secondIndex] + 1,
        previousRow[secondIndex - 1] + 1,
        diagonal + substitutionCost,
      );
      diagonal = oldValue;
    }
  }

  return previousRow[secondWord.length];
}

export function scoreSearchText(searchTerm, text) {
  // Give a numerical relevance score to one piece of text. Exact phrases receive
  // the highest bonus, followed by full words, prefixes, and close spellings.
  const query = normalizeSearchText(searchTerm);
  const normalizedText = normalizeSearchText(text);

  if (!query || !normalizedText) {
    return 0;
  }

  const queryWords = query.split(" ");
  const textWords = normalizedText.split(" ");
  // Finding the whole query together is stronger than finding its words apart.
  let score = normalizedText.includes(query) ? 30 : 0;

  queryWords.forEach((queryWord) => {
    // Full word matches receive a larger score than partial or fuzzy matches.
    if (textWords.includes(queryWord)) {
      score += 12;
      return;
    }

    if (
      queryWord.length >= 3 &&
      textWords.some((textWord) => textWord.startsWith(queryWord))
    ) {
      // Prefix matching lets "calc" find "calculator" while a user is typing.
      score += 6;
      return;
    }

    if (queryWord.length >= 4) {
      // Typo matching starts at four letters to stop short words producing lots
      // of unrelated matches. Longer words allow two mistakes instead of one.
      const allowedDistance = queryWord.length >= 8 ? 2 : 1;
      if (
        textWords.some(
          (textWord) =>
            Math.abs(textWord.length - queryWord.length) <= allowedDistance &&
            editDistance(queryWord, textWord) <= allowedDistance,
        )
      ) {
        score += 4;
      }
    }
  });

  return score;
}

export function findBestSearchRoute(searchTerm, searchRoutes) {
  // Compare the query with every searchable page and return the strongest route.
  // Returning null for a blank or unmatched query lets the Navbar use its fallback.
  const normalizedQuery = normalizeSearchText(searchTerm);

  if (!normalizedQuery) {
    return null;
  }

  const rankedRoutes = searchRoutes.map((route) => {
    // Keywords describe the page's main purpose, so their score is doubled.
    // Editable page content still counts, but is given a lower priority.
    const keywordScore = scoreSearchText(normalizedQuery, route.keywords.join(" ")) * 2;
    const contentScore = scoreSearchText(normalizedQuery, route.content);

    return { ...route, score: keywordScore + contentScore };
  });

  // JavaScript sorts upwards by default, so subtract in reverse for highest first.
  rankedRoutes.sort((firstRoute, secondRoute) => secondRoute.score - firstRoute.score);

  return rankedRoutes[0]?.score > 0 ? rankedRoutes[0] : null;
}
