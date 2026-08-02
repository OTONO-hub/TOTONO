export type JourneyYear = {
  year: string;
  visits: number;
  progress: number;
};

export function calculateSaunaJourney(
  posts: {
    visit_date: string;
  }[]
): JourneyYear[] {
  const visitsByYear = new Map<
    string,
    number
  >();

  for (const post of posts) {
    const year =
      post.visit_date.slice(0, 4);

    visitsByYear.set(
      year,
      (visitsByYear.get(year) ?? 0) + 1
    );
  }

  const years = Array.from(
    visitsByYear.entries()
  )
    .map(([year, visits]) => ({
      year,
      visits,
    }))
    .sort((a, b) =>
      a.year.localeCompare(b.year)
    );

  const maxVisits = Math.max(
    ...years.map((y) => y.visits),
    1
  );

  return years.map((year) => ({
    ...year,
    progress: Math.round(
      (year.visits / maxVisits) * 100
    ),
  }));
}
