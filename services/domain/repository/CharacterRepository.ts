import { Character } from '../model/Character';
import { CharacterId } from '../model/CharacterId';
import { PagedResult } from '../model/PagedResult';

export interface CharacterRepository {
    characters: Character[];
    hasNextPage: boolean;
    loadNextPage(): Promise<void>;
    // resolves to an empty page if no character matches the provided name
    searchCharacters(name: string, page?: number): Promise<PagedResult<Character>>;
    // rejects if no character matches the provided id
    getCharacterById(id: CharacterId): Promise<Character>;
    // resolves to [] for an empty list without any request; ids unknown to the API are omitted
    getCharactersByIds(ids: CharacterId[]): Promise<Character[]>;
}