import { GenericCarousel } from '@/components/shared/GenericCarousel';
import { EpisodeRepository } from '@/services/domain/repository/EpisodeRepository';
import { ActivityIndicator, Text } from 'react-native';
import { SeasonCard } from './SeasonCard';
import { useSeasonEpisodesViewModel } from './seasonViewModel';

export interface SeasonEpisodesCarouselProps {
    episodeRepository: EpisodeRepository;
    onSeeAllClick?: () => void;
}

// the API only covers seasons 1-5; 6-9 exist but have no episode data, so SeasonCard renders them as unavailable
const TOTAL_KNOWN_SEASONS = 9;

export const SeasonEpisodesCarousel = ({
    episodeRepository,
    onSeeAllClick,
}: SeasonEpisodesCarouselProps) => {
    const state = useSeasonEpisodesViewModel(episodeRepository);

    if (state.status === 'loading') {
        return <ActivityIndicator />;
    }

    if (state.status === 'error') {
        return <Text>{state.message}</Text>;
    }

    const seasonNumbers = Array.from({ length: TOTAL_KNOWN_SEASONS }, (_, index) => index + 1);

    return (
        <GenericCarousel
            title="Seasons"
            onSeeAllClick={onSeeAllClick}
            content={
                <>
                    {seasonNumbers.map(seasonNumber => (
                        <SeasonCard
                            key={seasonNumber}
                            season={{
                                number: seasonNumber,
                                episodesNumber: state.episodeCountsBySeason[seasonNumber] ?? 0,
                            }}
                        />
                    ))}
                </>
            }
        />
    );
};
