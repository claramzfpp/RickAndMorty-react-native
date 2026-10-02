import { Episode } from '@/services/domain/model/Episode';

export type SeasonEpisodesScreenUIState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'loaded'; season: number; episodes: Episode[] };
