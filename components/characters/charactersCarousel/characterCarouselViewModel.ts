import { CharacterRepository } from '@/services/domain/repository/CharacterRepository';
import { CharacterCarouselUIState } from './characterCarouselUIState';
import { useCharacterListViewModel } from './characterListViewModel';

const CAROUSEL_MAX_ITEMS = 10;

export function useCharacterCarouselViewModel(
    characterRepository: CharacterRepository
): CharacterCarouselUIState {
    const { state } = useCharacterListViewModel(characterRepository);

    if (state.status === 'loaded') {
        return { status: 'loaded', charactersArray: state.characters.slice(0, CAROUSEL_MAX_ITEMS) };
    }
    return state;
}
