import { Location } from '../model/Location';
import { LocationId } from '../model/LocationId';

export interface LocationRepository {
    locations: Location[];
    hasNextPage: boolean;
    loadNextPage(): Promise<void>;
    // resolves to an empty list if no location matches the provided name
    searchLocationsByName(name: string): Promise<Location[]>;
    // rejects if no location matches the provided id
    getLocationById(id: LocationId): Promise<Location>;
}
