import { Location } from '@/services/domain/model/Location';
import { LocationId } from '@/services/domain/model/LocationId';
import { PagedResult } from '@/services/domain/model/PagedResult';
import { LocationRepository } from '@/services/domain/repository/LocationRepository';
import { LocationMapper } from '@/services/data/mapper/LocationMapper';
import { RMLocation } from '@/services/data/remote/locations/RMLocation';
import { GetAllLocationsResponse } from '@/services/data/remote/locations/GetAllLocationsResponse';
import { HttpError } from '@/services/data/remote/HttpError';
import { RICK_AND_MORTY_BASE_URL } from '@/services/data/remote/ApiConfig';
import { parseNextPage } from '@/services/data/pagination/parseNextPage';

export class LocationRepositoryImpl implements LocationRepository {
    private static readonly baseUrl = `${RICK_AND_MORTY_BASE_URL}/location`;

    private nextUrl: string | null = LocationRepositoryImpl.baseUrl;

    locations: Location[] = [];
    hasNextPage = true;

    private inFlight: Promise<void> | null = null;

    loadNextPage(): Promise<void> {
        if (this.inFlight !== null) {
            return this.inFlight;
        }

        if (!this.hasNextPage || this.nextUrl === null) {
            return Promise.resolve();
        }

        const url = this.nextUrl;

        const request = fetch(url)
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
            })
            .finally(() => {
                this.inFlight = null;
            });

        this.inFlight = request;
        return request;
    }

    searchLocationsByName(name: string, page = 1): Promise<PagedResult<Location>> {
        const url = `${LocationRepositoryImpl.baseUrl}/?name=${encodeURIComponent(name)}&page=${page}`;

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
            .then((data): PagedResult<Location> => {
                if (data === null) {
                    return { items: [], nextPage: null };
                }
                return {
                    items: data.results.map(LocationMapper.toDomain),
                    nextPage: parseNextPage(data.info.next),
                };
            });
    }

    getLocationById(id: LocationId): Promise<Location> {
        const url = `${LocationRepositoryImpl.baseUrl}/${id.value}`;

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
