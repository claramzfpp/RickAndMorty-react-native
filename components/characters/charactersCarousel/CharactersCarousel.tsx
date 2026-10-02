import { GenericCarousel } from '@/components/shared/GenericCarousel';
import { CharacterRepository } from '@/services/domain/repository/CharacterRepository';
import { router } from 'expo-router';
import { ActivityIndicator, Text } from 'react-native';
import { CharacterCard, CharacterCellSize } from '../CharacterCard';
import { useCharacterCarouselViewModel } from './characterCarouselViewModel';

export interface CharactersCarouselProps {
    characterRepository: CharacterRepository;
    onSeeAllClick?: () => void;
}

export const CharactersCarousel = ({
    characterRepository,
    onSeeAllClick,
}: CharactersCarouselProps) => {
    const state = useCharacterCarouselViewModel(characterRepository);

    if (state.status === 'loading') {
        return <ActivityIndicator />;
    }

    if (state.status === 'error') {
        return <Text>{state.message}</Text>;
    }

    return (
        <GenericCarousel
            title="Characters"
            onSeeAllClick={onSeeAllClick}
            content={
                <>
                    {state.charactersArray.map(character => (
                        <CharacterCard
                            key={character.id.value}
                            character={character}
                            size={CharacterCellSize.Discover}
                            onPress={() => router.push(`/characters/${character.id.value}`)}
                        />
                    ))}
                </>
            }
        />
    );
};
