import { Location } from '../../domain/model/Location';
import { RMLocation } from '../remote/locations/RMLocation';

export class LocationMapper {
    static toDomain(rmLocation: RMLocation): Location {
        return {
            id: rmLocation.id,
            name: rmLocation.name,
            type: rmLocation.type,
            dimension: rmLocation.dimension
        };
    }
}
