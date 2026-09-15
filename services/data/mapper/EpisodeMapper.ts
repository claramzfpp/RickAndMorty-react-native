import { Episode } from '../../domain/model/Episode';
import { EpisodeId } from '../../domain/model/EpisodeId';
import { RMEpisode } from '../remote/episodes/RMEpisode';

export class EpisodeMapper {
    static toDomain(rmEpisode: RMEpisode): Episode {
        return Episode.fromCode(
            new EpisodeId(rmEpisode.id),
            rmEpisode.name,
            rmEpisode.air_date,
            rmEpisode.episode
        );
    }
}
