import { LocationId } from './LocationId';

export interface Location {
    id: LocationId;
    name: string;
    type: string;
    dimension: string;
}