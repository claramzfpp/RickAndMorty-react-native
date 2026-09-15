import { Character } from '../../domain/model/Character';
import { CharacterId } from '../../domain/model/CharacterId';
import { CharacterRepository } from '../../domain/repository/CharacterRepository';
import { CharacterMapper } from '../mapper/CharacterMapper';
import { RMCharacter } from '../remote/characters/RMCharacter';
import { GetAllCharactersResponse } from '../remote/characters/GetAllCharactersResponse';
import { HttpError } from '../remote/HttpError';
import { RICK_AND_MORTY_BASE_URL } from '../remote/ApiConfig';

export class CharacterRepositoryImpl implements CharacterRepository {
    private static readonly baseUrl = `${RICK_AND_MORTY_BASE_URL}/character`;

    private nextUrl: string | null = CharacterRepositoryImpl.baseUrl;

    characters: Character[] = [];
    hasNextPage = true;

    loadNextPage(): Promise<void> {
        if (!this.hasNextPage || this.nextUrl === null) {
            return Promise.resolve();
        }

        const url = this.nextUrl;

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }
                return response.json() as Promise<GetAllCharactersResponse>;
            })
            .then(data => {
                this.nextUrl = data.info.next;
                this.hasNextPage = data.info.next !== null;

                this.characters = this.characters.concat(data.results.map(CharacterMapper.toDomain));
            });
    }

    searchCharacters(name: string): Promise<Character[]> {
        const url = `${CharacterRepositoryImpl.baseUrl}/?name=${encodeURIComponent(name)}&page=1`;

        return fetch(url)
            .then(response => {
                if (response.status === 404) {
                    return null;
                }
                if (!response.ok) {
                    throw new HttpError(response.status);
                }
                return response.json() as Promise<GetAllCharactersResponse>;
            })
            .then(data => {
                if (data === null) {
                    return [];
                }
                return data.results.map(CharacterMapper.toDomain);
            });
    }

    getCharacterById(id: CharacterId): Promise<Character> {
        const url = `${CharacterRepositoryImpl.baseUrl}/${id.value}`;

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }
                return response.json() as Promise<RMCharacter>;
            })
            .then(CharacterMapper.toDomain);
    }
}
