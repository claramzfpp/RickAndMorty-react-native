import { EpisodeRepository } from '@/services/domain/repository/EpisodeRepository';
import { useEffect, useState } from 'react';
import { SeasonEpisodesUiState } from './seasonEpisodesUiState';

export function useSeasonEpisodesViewModel(
    episodeRepository: EpisodeRepository
): SeasonEpisodesUiState {
    const [state, setState] = useState<SeasonEpisodesUiState>({ status: 'loading' });

    useEffect(() => {
        let isCancelled = false;
        setState({ status: 'loading' });

        (async () => {
            try {
                if (episodeRepository.episodes.length === 0) {
                    await episodeRepository.loadAllEpisodes();
                }

                const episodeCountsBySeason = episodeRepository.getEpisodeCountsBySeason();

                if (!isCancelled) {
                    setState({ status: 'loaded', episodeCountsBySeason });
                }
            } catch (error) {
                if (!isCancelled) {
                    const message = error instanceof Error ? error.message : 'Unknown error';
                    setState({ status: 'error', message });
                }
            }
        })();

        return () => {
            isCancelled = true;
        };
    }, [episodeRepository]);

    return state;
}
