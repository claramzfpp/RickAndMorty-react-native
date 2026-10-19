import { FavoritesView } from '@/components/favorites/FavoritesView';
import { getCharacterRepository, getFavoritesRepository } from '@/services/composition/repositories';

export default function FavoritesRoute() {
  return (
    <FavoritesView
      favoritesRepository={getFavoritesRepository()}
      characterRepository={getCharacterRepository()}
    />
  );
}
