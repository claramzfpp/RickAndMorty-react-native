import { CharacterId } from './CharacterId';

export interface Character { // 'data class'/'struct' mapeado
    id: CharacterId;
    name: string;
    status: string;
    origin: string;
    image: string;
    species: string;
    gender: string;
}