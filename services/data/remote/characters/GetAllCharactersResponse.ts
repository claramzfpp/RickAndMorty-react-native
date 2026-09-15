import { RMCharacter } from "./RMCharacter";

export interface GetAllCharactersResponseInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

export interface GetAllCharactersResponse {
    info: GetAllCharactersResponseInfo;
    results: RMCharacter[];
}
