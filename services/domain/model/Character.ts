export interface Character { // 'data class'/'struct' mapeado
    id: number;          // 'Int' vira 'number'
    name: string;
    status: string;
    origin: string;
    image: string;
    species: string;
    gender: string;
}