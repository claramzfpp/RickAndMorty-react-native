import { Episode } from '@/services/domain/model/Episode';
import { EpisodeRepository } from '@/services/domain/repository/EpisodeRepository';
import { EpisodeMapper } from '@/services/data/mapper/EpisodeMapper';
import { GetAllEpisodesResponse } from '@/services/data/remote/episodes/GetAllEpisodesResponse';
import { HttpError } from '@/services/data/remote/HttpError';
import { RICK_AND_MORTY_BASE_URL } from '@/services/data/remote/ApiConfig';

export class EpisodeRepositoryImpl implements EpisodeRepository {
    private static readonly baseUrl = `${RICK_AND_MORTY_BASE_URL}/episode`;

    episodes: Episode[] = [];

    loadAllEpisodes(): Promise<void> {
        return this.fetchPage(EpisodeRepositoryImpl.baseUrl);
    }

    getEpisodesBySeason(season: number): Episode[] {
        return this.episodes.filter(episode => episode.season === season);
    }

    getEpisodeCountsBySeason(): { [season: number]: number } {
        const counts: { [season: number]: number } = {};
        for (const episode of this.episodes) {
            counts[episode.season] = (counts[episode.season] || 0) + 1;
        }
        return counts;
    }

    private fetchPage(url: string): Promise<void> {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }
                return response.json() as Promise<GetAllEpisodesResponse>;
            })
            .then(data => {
                this.episodes = this.episodes.concat(data.results.map(rmEpisode => EpisodeMapper.toDomain(rmEpisode)));

                if (data.info.next !== null) {
                    return this.fetchPage(data.info.next);
                }
            });
    }
}
