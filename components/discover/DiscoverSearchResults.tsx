import { ReactNode } from 'react';
import { View } from 'react-native';
import { Character } from '@/services/domain/model/Character';
import { Location } from '@/services/domain/model/Location';
import { GenericCarousel } from '../shared/GenericCarousel';
import { CharacterCard, CharacterCellSize } from '../characters/CharacterCard';
import { LocationCard, LocationCellSize } from '../locationsCarousel/LocationCard';
import { SearchEmptyState, SearchErrorState, SearchLoadingState } from '../shared/SearchStateViews';

export type SearchSection<T> =
    | { status: 'loading' }
    | { status: 'empty' }
    | { status: 'error'; message: string }
    | { status: 'loaded'; items: T[] };

export interface DiscoverSearchResultsProps {
    characters: SearchSection<Character>;
    locations: SearchSection<Location>;
    query: string;
    onRetry: () => void;
}

interface SectionProps<T> {
    title: string;
    section: SearchSection<T>;
    query: string;
    numRows?: 1 | 2;
    onRetry: () => void;
    renderItem: (item: T, index: number) => ReactNode;
}

const Section = <T,>({ title, section, query, numRows, onRetry, renderItem }: SectionProps<T>) => {
    switch (section.status) {
        case 'loading':
            return <SearchLoadingState />;
        case 'error':
            return <SearchErrorState message={section.message} onRetry={onRetry} />;
        case 'empty':
            return <SearchEmptyState query={query} subject={title} />;
        case 'loaded':
            return <GenericCarousel title={title} numRows={numRows} content={section.items.map(renderItem)} />;
    }
};

export const DiscoverSearchResults = ({
    characters,
    locations,
    query,
    onRetry,
}: DiscoverSearchResultsProps) => {
    if (characters.status === 'empty' && locations.status === 'empty') {
        return <SearchEmptyState query={query} />;
    }

    if (characters.status === 'loading' || locations.status === 'loading') {
        return <SearchLoadingState />;
    }

    // Full-screen error only when both fail; otherwise the failed section shows inline.
    if (characters.status === 'error' && locations.status === 'error') {
        return <SearchErrorState message={characters.message} onRetry={onRetry} />;
    }

    return (
        <View>
            <Section
                title="Characters"
                section={characters}
                query={query}
                onRetry={onRetry}
                renderItem={(character) => (
                    <CharacterCard key={character.id.toString()} character={character} size={CharacterCellSize.Discover} />
                )}
            />
            <Section
                title="Locations"
                section={locations}
                query={query}
                numRows={2}
                onRetry={onRetry}
                renderItem={(location, index) => (
                    <LocationCard
                        key={location.id.toString()}
                        location={location}
                        index={index}
                        size={LocationCellSize.Discover}
                    />
                )}
            />
        </View>
    );
};
