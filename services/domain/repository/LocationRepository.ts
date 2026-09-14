import { Location } from '../model/Location';

export interface LocationRepository {
    locations: Location[];

    getLocationById(id: number): Location | undefined;
    getAllLocations(): Location[];
    searchLocationsByName(name: string): Location[] | undefined;
}