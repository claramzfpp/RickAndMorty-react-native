import { EpisodeRepository } from '@/services/domain/repository/EpisodeRepository';
import { EpisodeRepositoryImpl } from '@/services/data/repositoryImplementation/EpisodeRepositoryImpl';
import { CharacterRepository } from '@/services/domain/repository/CharacterRepository';
import { CharacterRepositoryImpl } from '@/services/data/repositoryImplementation/CharacterRepositoryImpl';
import { LocationRepository } from '@/services/domain/repository/LocationRepository';
import { LocationRepositoryImpl } from '@/services/data/repositoryImplementation/LocationRepositoryImpl';
import { FavoritesRepository } from '@/services/domain/repository/FavoritesRepository';
import { FavoritesRepositoryImpl } from '@/services/data/repositoryImplementation/FavoritesRepositoryImpl';

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

let locationRepositoryInstance: LocationRepository | undefined;

export function getLocationRepository(): LocationRepository {
    if (locationRepositoryInstance === undefined) {
        locationRepositoryInstance = new LocationRepositoryImpl();
    }
    return locationRepositoryInstance;
}

let favoritesRepositoryInstance: FavoritesRepository | undefined;

export function getFavoritesRepository(): FavoritesRepository {
    if (favoritesRepositoryInstance === undefined) {
        favoritesRepositoryInstance = new FavoritesRepositoryImpl();
    }
    return favoritesRepositoryInstance;
}
