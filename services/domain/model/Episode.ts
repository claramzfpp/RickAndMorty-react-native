export interface Episode { // 'data class'/'struct' mapeado
    id: number;
    name: string;
    airDate: string;
    episodeCode: string;
    season: number;
    episodeNumber: number;
}