import { Episode } from '../model/Episode';

export interface EpisodeRepository {
    episodes: Episode[];
    loadAllEpisodes(): Promise<void>;
    getEpisodesBySeason(season: number): Episode[];
    getEpisodeCountsBySeason(): { [season: number]: number };
    // looks up within the already-loaded episodes; call loadAllEpisodes() first
    getEpisodeById(id: number): Episode | undefined;
    // looks up within the already-loaded episodes; call loadAllEpisodes() first
    searchEpisodesByName(name: string): Episode[];
}

