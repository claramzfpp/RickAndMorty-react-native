import { CharacterId } from '../model/CharacterId';

export interface FavoritesRepository {
    // resolves to [] when nothing has been saved yet
    getFavoriteIds(): Promise<CharacterId[]>;
    isFavorite(id: CharacterId): Promise<boolean>;
    // idempotent: adding an existing id keeps a single entry
    add(id: CharacterId): Promise<void>;
    // idempotent: removing an absent id is a no-op
    remove(id: CharacterId): Promise<void>;
}
