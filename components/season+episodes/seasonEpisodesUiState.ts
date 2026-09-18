export type SeasonEpisodesUiState =
    | { status: 'loading' }
    | { status: 'loaded'; episodeCountsBySeason: { [season: number]: number } }
    | { status: 'error'; message: string };
//mesma energia de um enum ou sealed class, o nome disso é discriminated union