import { Character } from '../model/Character';

export interface CharacterRepository {
    characters: Character[];
    hasNextPage: boolean;
    loadNextPage(): Promise<void>;
    // resolves to an empty list if no character matches the provided name
    searchCharacters(name: string): Promise<Character[]>;
    // rejects if no character matches the provided id
    getCharacterById(id: number): Promise<Character>;
}