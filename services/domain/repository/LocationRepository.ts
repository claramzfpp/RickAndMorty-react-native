import { Location } from '../model/Location';
import { LocationId } from '../model/LocationId';
import { PagedResult } from '../model/PagedResult';

export interface LocationRepository {
    locations: Location[];
    hasNextPage: boolean;
    loadNextPage(): Promise<void>;
    // resolves to an empty page if no location matches the provided name
    searchLocationsByName(name: string, page?: number): Promise<PagedResult<Location>>;
    // rejects if no location matches the provided id
    getLocationById(id: LocationId): Promise<Location>;
}
