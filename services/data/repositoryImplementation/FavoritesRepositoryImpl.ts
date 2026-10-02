import AsyncStorage from '@react-native-async-storage/async-storage';

import { CharacterId } from '../../domain/model/CharacterId';
import { FavoritesRepository } from '../../domain/repository/FavoritesRepository';

export class FavoritesRepositoryImpl implements FavoritesRepository {
    private static readonly storageKey = 'favorites:characters:v1';

    // Add/remove are read-modify-write; chaining them prevents two quick calls from losing an update.
    private writeChain: Promise<void> = Promise.resolve();

    async getFavoriteIds(): Promise<CharacterId[]> {
        const ids = await this.readIds();
        return ids.map(id => new CharacterId(id));
    }

    async isFavorite(id: CharacterId): Promise<boolean> {
        const ids = await this.readIds();
        return ids.includes(id.value);
    }

    add(id: CharacterId): Promise<void> {
        return this.enqueueWrite(ids => (ids.includes(id.value) ? ids : [...ids, id.value]));
    }

    remove(id: CharacterId): Promise<void> {
        return this.enqueueWrite(ids => ids.filter(stored => stored !== id.value));
    }

    private enqueueWrite(update: (ids: number[]) => number[]): Promise<void> {
        const operation = this.writeChain.then(async () => {
            const ids = await this.readIds();
            await AsyncStorage.setItem(
                FavoritesRepositoryImpl.storageKey,
                JSON.stringify(Array.from(new Set(update(ids))))
            );
        });
        // A failed write must not poison the chain for later writes; the caller still receives the rejection.
        this.writeChain = operation.catch(() => undefined);
        return operation;
    }

    private async readIds(): Promise<number[]> {
        const raw = await AsyncStorage.getItem(FavoritesRepositoryImpl.storageKey);
        if (raw === null) {
            return [];
        }

        let parsed: unknown;
        try {
            parsed = JSON.parse(raw);
        } catch {
            // Corrupt storage must not crash the app: treat it as an empty list.
            return [];
        }

        if (!Array.isArray(parsed) || !parsed.every(FavoritesRepositoryImpl.isPositiveInteger)) {
            return [];
        }
        return Array.from(new Set(parsed));
    }

    private static isPositiveInteger(value: unknown): value is number {
        return typeof value === 'number' && Number.isInteger(value) && value > 0;
    }
}
