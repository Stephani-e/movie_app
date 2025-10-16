import {ActivityIndicator, FlatList, Image, Text, View,} from "react-native";
import {useRouter} from "expo-router";

import useFetch from "@/services/useFetch";
import {fetchMovies, fetchNowPlaying, fetchPopular, fetchTopRated, fetchUpcoming,} from "@/services/api";

import {images} from "@/constants/images";
import {icons} from "@/constants/icons";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import {getTrendingMovies} from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";
import UpcomingCard from "@/components/UpcomingCard";
import NowPlayingCard from "@/components/NowPlayingCard";
import PopularMoviesCarousel from "@/components/extra/PopularMoviesCarousel";
import TopRatedSection from "@/components/extra/TopRatedSection";

const Index = () => {
    const router = useRouter();

    const {
        data: trendingMovies,
        loading: trendingLoading,
        error: trendingError,
    } = useFetch(getTrendingMovies);

    const {
        data: rawUpcomingMovies,
        loading: upcomingLoading,
        error: upcomingError,
    } = useFetch(fetchUpcoming);

    const upcomingMovies = Array.isArray(rawUpcomingMovies)
        ? rawUpcomingMovies
        : rawUpcomingMovies?.results || [];

    const {
        data: nowPlayingMovies,
        loading: nowPlayingLoading,
        error: nowPlayingError,
    } = useFetch(fetchNowPlaying);

    const {
        data: popularMovies,
        loading: popularLoading,
        error: popularError,
    } = useFetch(fetchPopular);

    const {
        data: topRatedMovies,
        loading: topRatedLoading,
        error: topRatedError,
    } = useFetch(fetchTopRated);

    const {
        data: movies,
        loading: moviesLoading,
        error: moviesError,
    } = useFetch(() =>
        fetchMovies({
            query: "",
        })
    );

    const loading =
        trendingLoading ||
        moviesLoading ||
        upcomingLoading ||
        nowPlayingLoading ||
        popularLoading ||
        topRatedLoading;

    const error =
        trendingError ||
        moviesError ||
        upcomingError ||
        nowPlayingError ||
        popularError ||
        topRatedError;

    if (loading) {
        return (
            <View className="flex-1 bg-primary items-center justify-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-primary items-center justify-center">
                <Text className="text-white">
                    Error:{" "}
                    {moviesError?.message ||
                        trendingError?.message ||
                        upcomingError?.message ||
                        popularError?.message ||
                        topRatedError?.message ||
                        nowPlayingError?.message}
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute w-full" />

            <FlatList
                data={[{}]}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 40,
                }}
                renderItem={() => (
                    <View className="flex-1">
                        {/* Logo */}
                        <Image
                            source={icons.logo}
                            className="w-12 h-10 mt-20 mb-5 mx-auto"
                        />

                        {/* Search */}
                        <SearchBar
                            onPress={() => {
                                router.push("/search");
                            }}
                            placeholder="Search for a movie"
                        />

                        {/* Trending */}
                        {trendingMovies && (
                            <View className="mt-10">
                                <Text className="text-lg text-white font-bold mb-3">
                                    Trending Movies
                                </Text>

                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    ItemSeparatorComponent={() => <View className="w-1" />}
                                    data={trendingMovies}
                                    renderItem={({ item, index }) => (
                                        <TrendingCard movie={item} index={index} />
                                    )}
                                    keyExtractor={(item, index) =>
                                        `${item.movie_id || item || 'unknown'}-${index}-${Math.random().toString(36).substring(2, 9)}`
                                    }
                                />
                            </View>
                        )}

                        {/* Upcoming */}
                        {upcomingMovies.length > 0 &&  (
                            <View className="mt-10">
                                <Text className="text-lg text-white font-bold mb-3">
                                    Upcoming Movies
                                </Text>
                                <FlatList
                                    data={upcomingMovies}
                                    renderItem={({ item }) => <UpcomingCard movie={item} />}
                                    keyExtractor={(item, index) => `upcoming-${item.id}-${index}`}
                                    scrollEnabled={false} // let parent FlatList handle scrolling
                                />
                            </View>
                        )}

                        {/* Now Playing */}
                        {nowPlayingMovies?.results && (
                            <View className="mt-10">
                                <Text className="text-lg text-white font-bold mb-3">
                                    Now Playing
                                </Text>
                                <FlatList
                                    horizontal
                                    pagingEnabled
                                    data={nowPlayingMovies.results}
                                    renderItem={({ item }) => <NowPlayingCard movie={item} />}
                                    keyExtractor={(item, index) => `now-playing-${item.id}-${index}`}
                                />
                            </View>
                        )}

                        {/* Popular */}
                        {popularMovies?.results && (
                            <View className="mt-10">
                                <Text className="text-lg text-white font-bold mb-3">
                                    Popular Movies
                                </Text>
                                <PopularMoviesCarousel
                                    movies={popularMovies.results.map((m, i) => ({
                                        ...m,
                                        key: `popular-${m.id}-${i}`
                                    }))}
                                />
                            </View>
                        )}

                        {/* Top Rated */}
                        {topRatedMovies?.results && (
                            <TopRatedSection
                                topRatedMovies={{
                                    ...topRatedMovies,
                                    results: topRatedMovies.results.map((m, i) => ({
                                        ...m,
                                        key: `top-rated-${m.id}-${i}`,
                                    })),
                                }}
                            />
                        )}

                        {/* Latest */}
                        {movies && (
                            <View className="mt-10">
                                <Text className="text-lg text-white font-bold mb-3">
                                    Latest Movies
                                </Text>

                                <FlatList
                                    data={movies}
                                    renderItem={({ item }) => <MovieCard {...item} />}
                                    keyExtractor={(item, index) => `latest-${item.id}-${index}`}
                                    numColumns={3}
                                    columnWrapperStyle={{
                                        justifyContent: "space-evenly",
                                        gap: 10,
                                        paddingRight: 5,
                                        marginBottom: 10,
                                    }}
                                    scrollEnabled={false} // handled by parent FlatList
                                />
                            </View>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

export default Index;
