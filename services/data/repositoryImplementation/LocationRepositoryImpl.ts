import { Location } from '@/services/domain/model/Location';
import { LocationRepository } from '@/services/domain/repository/LocationRepository';
import { LocationMapper } from '@/services/data/mapper/LocationMapper';
import { GetAllLocationsResponse } from '@/services/data/remote/locations/GetAllLocationsResponse';
import { HttpError } from '@/services/data/remote/HttpError';
import { RICK_AND_MORTY_BASE_URL } from '@/services/data/remote/ApiConfig';

export class LocationRepositoryImpl implements LocationRepository {
    private static readonly baseUrl = `${RICK_AND_MORTY_BASE_URL}/location`;

    locations: Location[] = [];

    loadAllLocations(): Promise<void> {
        return this.fetchPage(LocationRepositoryImpl.baseUrl);
    }

    getAllLocations(): Location[] {
        return this.locations;
    }

    getLocationById(id: number): Location | undefined {
        return this.locations.find(location => location.id === id);
    }

    searchLocationsByName(name: string): Location[] | undefined {
        if (this.locations.length === 0) {
            return undefined;
        }

        const lowerCasedName = name.toLowerCase();

        return this.locations.filter(location => location.name.toLowerCase().includes(lowerCasedName));
    }

    private fetchPage(url: string): Promise<void> {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }
                return response.json() as Promise<GetAllLocationsResponse>;
            })
            .then(data => {
                this.locations = this.locations.concat(data.results.map(rmLocation => LocationMapper.toDomain(rmLocation)));

                if (data.info.next !== null) {
                    return this.fetchPage(data.info.next);
                }
            });
    }
}
