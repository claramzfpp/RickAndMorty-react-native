import { Episode } from '../../domain/model/Episode';
import { EpisodeId } from '../../domain/model/EpisodeId';
import { RMEpisode } from '../remote/episodes/RMEpisode';

export class EpisodeMapper {
    private static readonly episodeCodeRegex = /[Ss](\d+)[Ee](\d+)/;

    static toDomain(rmEpisode: RMEpisode): Episode {
        const [season, episodeNumber] = this.parseSeasonAndEpisode(rmEpisode.episode);

        return {
            id: new EpisodeId(rmEpisode.id),
            name: rmEpisode.name,
            airDate: rmEpisode.air_date,
            episodeCode: rmEpisode.episode,
            season: season,
            episodeNumber: episodeNumber,
        };
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