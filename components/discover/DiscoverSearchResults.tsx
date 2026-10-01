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
    onRetryCharacters: () => void;
    onRetryLocations: () => void;
}

interface SectionProps<T> {
    title: string;
    section: SearchSection<T>;
    query: string;
    onRetry: () => void;
    numRows?: 1 | 2;
    renderItem: (item: T, index: number) => ReactNode;
}

const Section = <T,>({ title, section, query, onRetry, numRows, renderItem }: SectionProps<T>) => {
    switch (section.status) {
        case 'loading':
            return <SearchLoadingState />;
        case 'error':
            return <SearchErrorState message={section.message} onRetry={onRetry} />;
        case 'empty':
            return <SearchEmptyState query={query} />;
        case 'loaded':
            return <GenericCarousel title={title} numRows={numRows} content={section.items.map(renderItem)} />;
    }
};

export const DiscoverSearchResults = ({
    characters,
    locations,
    query,
    onRetryCharacters,
    onRetryLocations,
}: DiscoverSearchResultsProps) => {
    if (characters.status === 'empty' && locations.status === 'empty') {
        return <SearchEmptyState query={query} />;
    }

    return (
        <View>
            <Section
                title="Characters"
                section={characters}
                query={query}
                onRetry={onRetryCharacters}
                renderItem={(character) => (
                    <CharacterCard key={character.id.toString()} character={character} size={CharacterCellSize.Discover} />
                )}
            />
            <Section
                title="Locations"
                section={locations}
                query={query}
                onRetry={onRetryLocations}
                numRows={2}
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
