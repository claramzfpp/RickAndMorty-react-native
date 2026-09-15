import { Location } from '../model/Location';

export interface LocationRepository {
    locations: Location[];
    hasNextPage: boolean;
    loadNextPage(): Promise<void>;
    // resolves to an empty list if no location matches the provided name
    searchLocationsByName(name: string): Promise<Location[]>;
    // rejects if no location matches the provided id
    getLocationById(id: number): Promise<Location>;
}
