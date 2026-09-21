import { Character } from "@/services/domain/model/Character";

export type CharacterCarouselUIState =
    | { status: 'loading' }
    | { status: 'loaded'; charactersArray: Character[] }
    | { status: 'error'; message: string };