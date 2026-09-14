import { RMCharacter } from "./RMCharacter";

export interface GetAllCharactersResponseInfo {
    count: number;
    pages: number;
}

export interface GetAllCharactersResponse {
    info: GetAllCharactersResponseInfo;
    results: RMCharacter[];
}
