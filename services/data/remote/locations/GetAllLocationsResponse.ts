import { RMLocation } from "./RMLocation";

export interface GetAllLocationsResponseInfo {
    count: number;
    pages: number;
}

export interface GetAllLocationsResponse {
    info: GetAllLocationsResponseInfo;
    results: RMLocation[];
}
