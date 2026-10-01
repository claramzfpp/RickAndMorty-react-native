import { Location } from "@/services/domain/model/Location";

export type LocationListUIState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | {
        status: 'loaded';
        locations: Location[];
        hasNextPage: boolean;
        isLoadingMore: boolean;
        loadMoreError?: string;
    };
