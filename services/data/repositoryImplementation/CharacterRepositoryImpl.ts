import { Character } from '../../domain/model/Character';
import { CharacterId } from '../../domain/model/CharacterId';
import { PagedResult } from '../../domain/model/PagedResult';
import { CharacterRepository } from '../../domain/repository/CharacterRepository';
import { CharacterMapper } from '../mapper/CharacterMapper';
import { RMCharacter } from '../remote/characters/RMCharacter';
import { GetAllCharactersResponse } from '../remote/characters/GetAllCharactersResponse';
import { HttpError } from '../remote/HttpError';
import { RICK_AND_MORTY_BASE_URL } from '../remote/ApiConfig';
import { parseNextPage } from '../pagination/parseNextPage';

export class CharacterRepositoryImpl implements CharacterRepository {
    private static readonly baseUrl = `${RICK_AND_MORTY_BASE_URL}/character`;

    private nextUrl: string | null = CharacterRepositoryImpl.baseUrl;

    characters: Character[] = [];
    hasNextPage = true;

    private inFlight: Promise<void> | null = null;

    loadNextPage(): Promise<void> {
        if (this.inFlight !== null) {
            return this.inFlight;
        }

        if (!this.hasNextPage || this.nextUrl === null) {
            return Promise.resolve();
        }

        const url = this.nextUrl;

        const request = fetch(url)
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
            })
            .finally(() => {
                this.inFlight = null;
            });

        this.inFlight = request;
        return request;
    }

    searchCharacters(name: string, page = 1): Promise<PagedResult<Character>> {
        const url = `${CharacterRepositoryImpl.baseUrl}/?name=${encodeURIComponent(name)}&page=${page}`;

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
            .then((data): PagedResult<Character> => {
                if (data === null) {
                    return { items: [], nextPage: null };
                }
                return {
                    items: data.results.map(CharacterMapper.toDomain),
                    nextPage: parseNextPage(data.info.next),
                };
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

    async getCharactersByIds(ids: CharacterId[]): Promise<Character[]> {
        const uniqueValues = Array.from(new Set(ids.map(id => id.value)));
        if (uniqueValues.length === 0) {
            return [];
        }

        const response = await fetch(`${CharacterRepositoryImpl.baseUrl}/${uniqueValues.join(',')}`);
        if (response.status === 404) {
            return [];
        }
        if (!response.ok) {
            throw new HttpError(response.status);
        }

        // The API returns a bare object (not an array) when a single id is requested.
        const data = (await response.json()) as RMCharacter | RMCharacter[];
        const characters = (Array.isArray(data) ? data : [data]).map(CharacterMapper.toDomain);

        // The API sorts by id and ignores the requested order, so restore it here.
        const byId = new Map(characters.map(character => [character.id.value, character]));
        return uniqueValues.flatMap(value => {
            const character = byId.get(value);
            return character === undefined ? [] : [character];
        });
    }
}
