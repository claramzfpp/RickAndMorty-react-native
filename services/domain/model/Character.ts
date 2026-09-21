import { CharacterId } from './CharacterId';

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

export interface Character { // 'data class'/'struct' mapeado
    id: CharacterId;
    name: string;
    status: CharacterStatus;
    origin: string;
    image: string;
    species: string;
    gender: string;
}