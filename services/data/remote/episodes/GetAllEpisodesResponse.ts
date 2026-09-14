import { RMEpisode } from "./RMEpisode";

export interface GetAllEpisodesResponseInfo {
    count: number;
    pages: number;
}

export interface GetAllEpisodesResponse {
    info: GetAllEpisodesResponseInfo;
    results: RMEpisode[];
}
