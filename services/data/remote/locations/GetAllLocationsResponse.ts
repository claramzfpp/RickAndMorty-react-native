import { RMLocation } from "./RMLocation";

export interface GetAllLocationsResponseInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

export interface GetAllLocationsResponse {
    info: GetAllLocationsResponseInfo;
    results: RMLocation[];
}
