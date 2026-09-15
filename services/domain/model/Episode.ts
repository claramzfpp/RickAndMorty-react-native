import { EpisodeId } from './EpisodeId';

export interface Episode { // 'data class'/'struct' mapeado
    id: EpisodeId;
    name: string;
    airDate: string;
    episodeCode: string;
    season: number;
    episodeNumber: number;
}