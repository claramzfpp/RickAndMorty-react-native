import { Location } from '@/services/domain/model/Location';
import { LocationRepository } from '@/services/domain/repository/LocationRepository';
import { LocationMapper } from '@/services/data/mapper/LocationMapper';
import { RMLocation } from '@/services/data/remote/locations/RMLocation';
import { GetAllLocationsResponse } from '@/services/data/remote/locations/GetAllLocationsResponse';
import { HttpError } from '@/services/data/remote/HttpError';
import { RICK_AND_MORTY_BASE_URL } from '@/services/data/remote/ApiConfig';

export class LocationRepositoryImpl implements LocationRepository {
    private static readonly baseUrl = `${RICK_AND_MORTY_BASE_URL}/location`;

    private nextUrl: string | null = LocationRepositoryImpl.baseUrl;

    locations: Location[] = [];
    hasNextPage = true;

    loadNextPage(): Promise<void> {
        if (!this.hasNextPage || this.nextUrl === null) {
            return Promise.resolve();
        }

        const url = this.nextUrl;

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }
                return response.json() as Promise<GetAllLocationsResponse>;
            })
            .then(data => {
                this.nextUrl = data.info.next;
                this.hasNextPage = data.info.next !== null;

                this.locations = this.locations.concat(data.results.map(LocationMapper.toDomain));
            });
    }

    searchLocationsByName(name: string): Promise<Location[]> {
        const url = `${LocationRepositoryImpl.baseUrl}/?name=${encodeURIComponent(name)}&page=1`;

        return fetch(url)
            .then(response => {
                if (response.status === 404) {
                    return null;
                }
                if (!response.ok) {
                    throw new HttpError(response.status);
                }
                return response.json() as Promise<GetAllLocationsResponse>;
            })
            .then(data => {
                if (data === null) {
                    return [];
                }
                return data.results.map(LocationMapper.toDomain);
            });
    }

    getLocationById(id: number): Promise<Location> {
        const url = `${LocationRepositoryImpl.baseUrl}/${id}`;

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }
                return response.json() as Promise<RMLocation>;
            })
            .then(LocationMapper.toDomain);
    }
}
