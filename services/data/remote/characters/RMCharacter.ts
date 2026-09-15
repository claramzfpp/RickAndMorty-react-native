// 1. Definindo o Enum para o Status do Personagem
export enum CharacterStatus {
    ALIVE = 'Alive',
    DEAD = 'Dead',
    UNKNOWN = 'unknown'
}

// 2. Definindo a Interface para a Origem do Personagem
export interface CharacterOrigin {
    name: string;
    url: string;
}

// 3. O modelo principal mapeado do Data Class
export interface RMCharacter { // 'data class'/'struct' mapeado
    id: number;          // 'Int' vira 'number'
    name: string;
    status: CharacterStatus;
    origin: CharacterOrigin;
    image: string;
    species: string;
    gender: string;
}
