import { Character } from '../Character';
import { CharacterId } from '../CharacterId';

export const mockCharacter: Character = {
    id: new CharacterId(1),
    name: 'Rick Sanchez',
    status: 'Unknown',
    origin: 'Earth (C-137)',
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    species: 'Human',
    gender: 'Male',
};

export const mockCharacters: Character[] = [
    mockCharacter,
    {
        id: new CharacterId(2),
        name: 'Morty Smith',
        status: 'Dead',
        origin: 'unknown',
        image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
        species: 'Human',
        gender: 'Male',
    },
    {
        id: new CharacterId(3),
        name: 'Summer Smith',
        status: 'Dead',
        origin: 'Earth (Replacement Dimension)',
        image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
        species: 'Human',
        gender: 'Female',
    },
];
