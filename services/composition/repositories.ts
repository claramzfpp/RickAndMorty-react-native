import { EpisodeRepository } from '@/services/domain/repository/EpisodeRepository';
import { EpisodeRepositoryImpl } from '@/services/data/repositoryImplementation/EpisodeRepositoryImpl';

let episodeRepositoryInstance: EpisodeRepository | undefined;

export function getEpisodeRepository(): EpisodeRepository {
    if (episodeRepositoryInstance === undefined) {
        episodeRepositoryInstance = new EpisodeRepositoryImpl();
    }
    return episodeRepositoryInstance;
}
