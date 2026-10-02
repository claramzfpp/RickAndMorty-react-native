import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EpisodeRow } from '@/components/season+episodes/EpisodeRow';
import { useSeasonEpisodesScreenViewModel } from '@/components/season+episodes/seasonEpisodesScreenViewModel';
import { headerBackButtonItem } from '@/components/shared/HeaderBackButton';
import { SearchErrorState, SearchLoadingState } from '@/components/shared/SearchStateViews';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { HEADER_CONTENT_HEIGHT, isIOS } from '@/constants/Header';
import { getEpisodeRepository } from '@/services/composition/repositories';

export default function SeasonEpisodesScreen() {
  const { season: seasonParam } = useLocalSearchParams<{ season: string }>();
  const season = Number(seasonParam);
  const colors = Colors[useColorScheme()];
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const contentTopPadding = isIOS ? headerHeight : 0;
  const { state, retry } = useSeasonEpisodesScreenViewModel(getEpisodeRepository(), season);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.gray,
          paddingTop: isIOS ? 0 : insets.top + HEADER_CONTENT_HEIGHT,
        },
      ]}
    >
      <Stack.Screen options={{
        title: '',
        headerTransparent: true,
        unstable_headerLeftItems: () => [headerBackButtonItem(() => router.back())],
      }} />

      {state.status === 'loading' && <SearchLoadingState topOffset={contentTopPadding} />}
      {state.status === 'error' && (
        <View style={[styles.stateWrapper, { marginTop: contentTopPadding }]}>
          <SearchErrorState message={state.message} onRetry={retry} />
        </View>
      )}
      {state.status === 'loaded' && (
        <FlatList
          data={state.episodes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <EpisodeRow episode={item} />}
          ListHeaderComponent={
            <View style={[styles.header, { paddingTop: contentTopPadding }]}>
              <Text style={[styles.title, { color: colors.green }]}>{`Season ${state.season}`}</Text>
              <Text style={styles.subtitle}>
                {`${state.episodes.length} ${state.episodes.length === 1 ? 'episode' : 'episodes'}`}
              </Text>
            </View>
          }
          style={styles.list}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          scrollIndicatorInsets={isIOS ? { top: headerHeight } : undefined}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stateWrapper: {
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  list: {
    alignSelf: 'stretch',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgb(95, 99, 100)',
  },
});
