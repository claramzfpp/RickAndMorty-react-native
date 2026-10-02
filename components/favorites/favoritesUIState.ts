import { Character } from '@/services/domain/model/Character';

export type FavoritesUIState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'empty' }
    | { status: 'loaded'; characters: Character[] };
