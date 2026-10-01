import { useCallback } from 'react';

import { usePaginatedSearch } from '@/hooks/usePaginatedSearch';
import { Character } from '@/services/domain/model/Character';
import { CharacterRepository } from '@/services/domain/repository/CharacterRepository';

export function useCharacterSearchViewModel(characterRepository: CharacterRepository, query: string) {
    const fetchPage = useCallback(
        (name: string, page: number) => characterRepository.searchCharacters(name, page),
        [characterRepository]
    );
    return usePaginatedSearch<Character>(fetchPage, query);
}
