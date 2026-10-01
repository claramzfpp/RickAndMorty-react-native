import { Character } from "@/services/domain/model/Character";

export type CharacterListUIState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | {
        status: 'loaded';
        characters: Character[];
        hasNextPage: boolean;
        isLoadingMore: boolean;
        loadMoreError?: string;
    };
