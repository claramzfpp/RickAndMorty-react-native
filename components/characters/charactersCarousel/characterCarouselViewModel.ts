import { CharacterRepository } from '@/services/domain/repository/CharacterRepository';
import { CharacterCarouselUIState } from './characterCarouselUIState';
import { useCharacterListViewModel } from './characterListViewModel';

export function useCharacterCarouselViewModel(
    characterRepository: CharacterRepository
): CharacterCarouselUIState {
    const { state } = useCharacterListViewModel(characterRepository);

    if (state.status === 'loaded') {
        return { status: 'loaded', charactersArray: state.characters };
    }
    return state;
}
