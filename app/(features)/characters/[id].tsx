import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';

import { CharacterDetailsView } from '@/components/characters/details/CharacterDetailsView';
import { useCharacterDetailsViewModel } from '@/components/characters/details/characterDetailsViewModel';
import { FavoriteButton, headerFavoriteButtonItem } from '@/components/characters/details/FavoriteButton';
import { headerBackButtonItem } from '@/components/shared/HeaderBackButton';
import { getCharacterRepository, getFavoritesRepository } from '@/services/composition/repositories';

export default function CharacterDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, toggleFavorite, retry } = useCharacterDetailsViewModel(
    getCharacterRepository(),
    getFavoritesRepository(),
    id
  );

  const onToggleFavorite = () => {
    toggleFavorite().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Could not update favorites', message);
    });
  };

  return (
    <>
      <Stack.Screen options={{
        title: '',
        headerTransparent: true,
        unstable_headerLeftItems: () => [headerBackButtonItem(() => router.back())],
        unstable_headerRightItems: () => state.status === 'loaded'
          ? [headerFavoriteButtonItem(state.isFavorite, onToggleFavorite)]
          : [],
        // Fallback for platforms that ignore `unstable_headerRightItems`; keep both in sync.
        headerRight: () => state.status === 'loaded'
          ? <FavoriteButton isFavorite={state.isFavorite} onPress={onToggleFavorite} />
          : null,
      }} />
      <CharacterDetailsView state={state} onRetry={retry} />
    </>
  );
}
