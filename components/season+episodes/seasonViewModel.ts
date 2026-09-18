import { EpisodeRepository } from '@/services/domain/repository/EpisodeRepository';
import { useEffect, useState } from 'react';

import { SeasonEpisodesUiState } from './seasonEpisodesUiState';

export function useSeasonEpisodesViewModel(
    episodeRepository: EpisodeRepository
): SeasonEpisodesUiState {
    const [state, setState] = useState<SeasonEpisodesUiState>({ status: 'loading' });
    // useState == @Published / MutableStateFlow,
    // ele basicamente garante que a memoria continue viva mesmo que tudo seja re-renders
    // state é a value que usaremos nas nossas views
    // enquanto o setState tem a energia de um self.state = newValue

    useEffect(() => {
        // funciona como um on appear
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
