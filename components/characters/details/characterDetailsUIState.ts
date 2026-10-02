import { Character } from '@/services/domain/model/Character';

export type CharacterDetailsUIState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'loaded'; character: Character; isFavorite: boolean };
