import { Location } from '@/services/domain/model/Location';

export type LocationDetailsUIState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'loaded'; location: Location };
