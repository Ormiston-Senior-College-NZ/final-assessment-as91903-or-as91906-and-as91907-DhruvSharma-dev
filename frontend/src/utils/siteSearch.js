function normalizeSearchText(value = "") {
  // Make the search easier to compare by removing capitals and punctuation.
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function editDistance(firstWord, secondWord) {
  // Count how many letters would need changing to fix a spelling mistake.
  const previousRow = Array.from(
    { length: secondWord.length + 1 },
    (_, index) => index,
  );

  for (let firstIndex = 1; firstIndex <= firstWord.length; firstIndex += 1) {
    let diagonal = previousRow[0];
    previousRow[0] = firstIndex;

    for (let secondIndex = 1; secondIndex <= secondWord.length; secondIndex += 1) {
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
  // A higher score means the text is a better match for the search.
  const query = normalizeSearchText(searchTerm);
  const normalizedText = normalizeSearchText(text);

  if (!query || !normalizedText) {
    return 0;
  }

  const queryWords = query.split(" ");
  const textWords = normalizedText.split(" ");
  let score = normalizedText.includes(query) ? 30 : 0;

  queryWords.forEach((queryWord) => {
    // Full word matches are the most useful.
    if (textWords.includes(queryWord)) {
      score += 12;
      return;
    }

    if (
      queryWord.length >= 3 &&
      textWords.some((textWord) => textWord.startsWith(queryWord))
    ) {
      // This also lets unfinished words match while the user is typing.
      score += 6;
      return;
    }

    if (queryWord.length >= 4) {
      // Longer words can have up to two wrong letters.
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
  // Compare every page and return the one with the highest score.
  const normalizedQuery = normalizeSearchText(searchTerm);

  if (!normalizedQuery) {
    return null;
  }

  const rankedRoutes = searchRoutes.map((route) => {
    // Page keywords count more than text that happens to be on the page.
    const keywordScore = scoreSearchText(normalizedQuery, route.keywords.join(" ")) * 2;
    const contentScore = scoreSearchText(normalizedQuery, route.content);

    return { ...route, score: keywordScore + contentScore };
  });

  rankedRoutes.sort((firstRoute, secondRoute) => secondRoute.score - firstRoute.score);

  return rankedRoutes[0]?.score > 0 ? rankedRoutes[0] : null;
}
