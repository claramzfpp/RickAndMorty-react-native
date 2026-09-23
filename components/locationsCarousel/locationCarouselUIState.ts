import { Location } from "@/services/domain/model/Location";

export type LocationCarouselUIState =
    | { status: 'loading' }
    | { status: 'loaded'; locationsArray: Location[] }
    | { status: 'error'; message: string };
