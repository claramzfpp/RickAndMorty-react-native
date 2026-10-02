import { EpisodeRepository } from '@/services/domain/repository/EpisodeRepository';
import { useCallback, useEffect, useState } from 'react';

import { SeasonEpisodesScreenUIState } from './seasonEpisodesScreenUIState';

export interface SeasonEpisodesScreenViewModel {
    state: SeasonEpisodesScreenUIState;
    retry: () => void;
}

export function useSeasonEpisodesScreenViewModel(
    episodeRepository: EpisodeRepository,
    season: number
): SeasonEpisodesScreenViewModel {
    const [state, setState] = useState<SeasonEpisodesScreenUIState>({ status: 'loading' });
    const [attempt, setAttempt] = useState(0);

    const retry = useCallback(() => setAttempt((current) => current + 1), []);

    useEffect(() => {
        let isCancelled = false;

        if (!Number.isInteger(season) || season < 1) {
            setState({ status: 'error', message: 'Invalid season.' });
            return;
        }

        setState({ status: 'loading' });

        (async () => {
            try {
                // loadAllEpisodes has no concurrency guard and appends duplicates if called twice.
                if (episodeRepository.episodes.length === 0) {
                    await episodeRepository.loadAllEpisodes();
                }

                const episodes = [...episodeRepository.getEpisodesBySeason(season)]
                    .sort((a, b) => a.episodeNumber - b.episodeNumber);

                if (isCancelled) {
                    return;
                }

                if (episodes.length === 0) {
                    setState({ status: 'error', message: `No episodes found for season ${season}.` });
                    return;
                }

                setState({ status: 'loaded', season, episodes });
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
    }, [episodeRepository, season, attempt]);

    return { state, retry };
}
