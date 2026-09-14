import { Episode } from '../model/Episode';

export interface EpisodeRepository {
    getEpisodesBySeason(season: number): Episode[];
    getEpisodeCountsBySeason(): { [season: number]: number };
}

