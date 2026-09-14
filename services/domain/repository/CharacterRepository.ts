import { Character } from '../model/Character';

export interface CharacterRepository {
    characters: Character[];
    // returns a character or undefined if no character matches the provided id
    getCharacterById(id: number): Character | undefined;
    getAllCharacters(): Character[];
    // returns a list of characters or undefined if no character matches the provided name
    searchCharactersByName(name: string): Character[] | undefined;
}