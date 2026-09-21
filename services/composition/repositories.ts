import { EpisodeRepository } from '@/services/domain/repository/EpisodeRepository';
import { EpisodeRepositoryImpl } from '@/services/data/repositoryImplementation/EpisodeRepositoryImpl';
import { CharacterRepository } from '@/services/domain/repository/CharacterRepository';
import { CharacterRepositoryImpl } from '@/services/data/repositoryImplementation/CharacterRepositoryImpl';

let episodeRepositoryInstance: EpisodeRepository | undefined;

export function getEpisodeRepository(): EpisodeRepository {
    if (episodeRepositoryInstance === undefined) {
        episodeRepositoryInstance = new EpisodeRepositoryImpl();
    }
    return episodeRepositoryInstance;
}

let characterRepositoryInstance: CharacterRepository | undefined;

export function getCharacterRepository(): CharacterRepository {
    if (characterRepositoryInstance === undefined) {
        characterRepositoryInstance = new CharacterRepositoryImpl();
    }
    return characterRepositoryInstance;
}
