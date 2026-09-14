import { Episode } from '../model/Episode';

export interface EpisodeRepository {
    episodes: Episode[];
    loadAllEpisodes(): Promise<void>;
    getEpisodesBySeason(season: number): Episode[];
    getEpisodeCountsBySeason(): { [season: number]: number };
}

