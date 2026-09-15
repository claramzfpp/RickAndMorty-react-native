import { EpisodeId } from './EpisodeId';

export class Episode { // 'data class'/'struct' mapeado
    private static readonly episodeCodeRegex = /[Ss](\d+)[Ee](\d+)/;

    readonly id: EpisodeId;
    readonly name: string;
    readonly airDate: string;
    readonly episodeCode: string;
    readonly season: number;
    readonly episodeNumber: number;

    private constructor(id: EpisodeId, name: string, airDate: string, episodeCode: string, season: number, episodeNumber: number) {
        this.id = id;
        this.name = name;
        this.airDate = airDate;
        this.episodeCode = episodeCode;
        this.season = season;
        this.episodeNumber = episodeNumber;
    }

    static fromCode(id: EpisodeId, name: string, airDate: string, episodeCode: string): Episode {
        const [season, episodeNumber] = this.parseSeasonAndEpisode(episodeCode);

        return new Episode(id, name, airDate, episodeCode, season, episodeNumber);
    }

    private static parseSeasonAndEpisode(episodeCode: string): [number, number] {
        const match = this.episodeCodeRegex.exec(episodeCode);

        // Se não encontrar o padrão na Regex, retorna [0, 0]
        if (!match) {
            return [0, 0];
        }

        // match[1] captura o primeiro grupo (\d+) e match[2] o segundo (\d+)
        const season = parseInt(match[1], 10);
        const episodeNumber = parseInt(match[2], 10);

        return [season, episodeNumber];
    }
}
