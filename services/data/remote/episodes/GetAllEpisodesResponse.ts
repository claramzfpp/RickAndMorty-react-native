import { RMEpisode } from "./RMEpisode";

export interface GetAllEpisodesResponseInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

export interface GetAllEpisodesResponse {
    info: GetAllEpisodesResponseInfo;
    results: RMEpisode[];
}
