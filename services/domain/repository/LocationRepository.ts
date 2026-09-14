import { Location } from '../model/Location';

export interface LocationRepository {
    locations: Location[];

    loadAllLocations(): Promise<void>;
    getLocationById(id: number): Location | undefined;
    getAllLocations(): Location[];
    searchLocationsByName(name: string): Location[] | undefined;
}