export enum CharacterStatus {
    ALIVE = 'Alive',
    DEAD = 'Dead',
    UNKNOWN = 'unknown'
}

export interface CharacterOrigin {
    name: string;
    url: string;
}

export interface RMCharacter { // 'data class'/'struct' mapeado
    id: number;          // 'Int' vira 'number'
    name: string;
    status: CharacterStatus;
    origin: CharacterOrigin;
    image: string;
    species: string;
    gender: string;
}
