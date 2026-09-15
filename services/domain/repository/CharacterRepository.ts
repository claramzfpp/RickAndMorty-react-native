import { Character } from '../model/Character';
import { CharacterId } from '../model/CharacterId';

export interface CharacterRepository {
    characters: Character[];
    hasNextPage: boolean;
    loadNextPage(): Promise<void>;
    // resolves to an empty list if no character matches the provided name
    searchCharacters(name: string): Promise<Character[]>;
    // rejects if no character matches the provided id
    getCharacterById(id: CharacterId): Promise<Character>;
}