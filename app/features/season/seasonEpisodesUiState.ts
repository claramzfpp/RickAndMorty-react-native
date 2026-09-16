export type SeasonEpisodesUiState =
    | { status: 'loading' }
    | { status: 'loaded'; episodeCountsBySeason: { [season: number]: number } }
    | { status: 'error'; message: string };
