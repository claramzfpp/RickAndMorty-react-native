import { Location } from '../../domain/model/Location';
import { LocationId } from '../../domain/model/LocationId';
import { RMLocation } from '../remote/locations/RMLocation';

export class LocationMapper {
    static toDomain(rmLocation: RMLocation): Location {
        return {
            id: new LocationId(rmLocation.id),
            name: rmLocation.name,
            type: rmLocation.type,
            dimension: capitalizeFirstLetter(rmLocation.dimension)
        };
    }
}

function capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}
