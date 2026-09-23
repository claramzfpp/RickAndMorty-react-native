import { Location } from '../Location';
import { LocationId } from '../LocationId';

export const mockLocation: Location = {
    id: new LocationId(1),
    name: 'Earth (C-137)',
    type: 'Planet',
    dimension: 'Dimension C-137',
};

export const mockLocations: Location[] = [
    mockLocation,
    {
        id: new LocationId(2),
        name: 'Abadango',
        type: 'Cluster',
        dimension: 'Unknown',
    },
    {
        id: new LocationId(3),
        name: 'Citadel of Ricks',
        type: 'Space station',
        dimension: 'Unknown',
    },
    {
        id: new LocationId(4),
        name: 'Interdimensional Cable',
        type: 'TV',
        dimension: 'Unknown',
    },
    {
        id: new LocationId(5),
        name: 'Purge Planet',
        type: 'Planet',
        dimension: 'Replacement Dimension',
    },
];
