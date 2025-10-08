import {ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import * as Linking from "expo-linking";
import {useLocalSearchParams, useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";
import {Ionicons} from '@expo/vector-icons';
import {icons} from "@/constants/icons";
import useFetch from "@/services/useFetch";
import {fetchMovieCredits, fetchMovieDetails, fetchMovieVideos, fetchMovieExternalLinks} from "@/services/api";
import {useEffect, useState} from "react";
import {addFavorite, isFavorite, removeFavorite} from "@/services/favorites";
import {getCurrentUser} from "@/lib/appwrite";
import SaveModal from "@/components/extra/SaveModal";
import {isMovieInAnyCollection} from "@/services/collections";
import {useNotify} from "@/hooks/useNotify";
import {useToast} from "react-native-toast-notifications";
import VideoModal from "@/components/extra/ViewVideoModal";

interface MovieInfoProps {
    label: string;
    value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-300 font-normal text-sm">{label}</Text>
        <Text className="text-light-100 font-bold text-sm mt-1 leading-5">
            {value || "N/A"}
        </Text>
    </View>
);

const Details = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [modalVisible, setModalVisible] = useState(false);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [videoModalVisible, setVideoModalVisible] = useState(false);
    const notify = useNotify();
    const toast = useToast();

    const { data: movie, loading: loadingMovie } = useFetch(() =>
        fetchMovieDetails(id as string)
    );
    const { data: videos } = useFetch(() =>
        fetchMovieVideos(id as string)
    );
    const { data: externalLinks } = useFetch(() => fetchMovieExternalLinks(id as string));
    const { data: credits, loading: loadingCredits } = useFetch(() =>
        fetchMovieCredits(id as string)
    );

    // Fetch current user
    useEffect(() => {
        getCurrentUser().then(setUser);
    }, []);

    // Check if the movie is already liked
    useEffect(() => {
        if (user && movie?.id) {
            isFavorite(user.$id, movie.id.toString()).then(setLiked);
        }
    }, [user, movie?.id]);

    // Check if the movie is already saved
    useEffect(() => {
       if (!user || !movie?.id) return;

       let isMounted = true;

       const fetchSavedState = async () => {
           try {
               const isSaved = await isMovieInAnyCollection(user.$id, movie.id.toString());
               if (isMounted) setSaved(isSaved);
           } catch (err) {
               console.error("Error fetching saved state:", err);
           }
       }

       fetchSavedState();

       return () => {
           isMounted = false;
       }
    }, [user, movie?.id]);


    const handleLike = async (movieTitle: string) => {
        if (!user || !movie) return;

        if (liked) {
            await removeFavorite(user.$id, movie.id.toString());
            setLiked(false);
            notify(
                `Movie removed from Favorites`,               // toastMessage
                `${movieTitle} removed to Favorites`, // dbMessage
                "favorites",
                "success"
            );
        } else {
            await addFavorite(user.$id, movie);
            setLiked(true);
            notify(
                "Added movie to Favorites",               // toastMessage
                `${movieTitle} added to Favorites`, // dbMessage
                "favorites",
                "success"
            );
        }
    };

    if (loadingMovie || loadingCredits)
        return (
            <SafeAreaView className="bg-primary flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#fff" />
            </SafeAreaView>
        );

    const directors = credits?.crew?.filter((c) => c.job === "Director") || [];
    const writers = credits?.crew?.filter(
        (c) => c.job === "Writer" || c.department === "Writing"
    ) || [];
    const producers = credits?.crew?.filter((c) => c.job === "Producer") || [];

    return (
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Backdrop */}
                <View className="relative">
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.backdrop_path}` }}
                        className="w-full h-[300px]"
                        resizeMode="cover"
                        blurRadius={5}
                    />
                    <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.9)"]}
                        className="absolute bottom-0 left-0 right-0 h-40"
                    />

                    {/* Back button */}
                    <TouchableOpacity
                        className="absolute top-10 left-5 right-5 bg-black/59 rounded-full p-2"
                        onPress={router.back}
                    >
                        <Image source={icons.arrow} className="size-6 rotate-180" tintColor="#fff" />
                    </TouchableOpacity>

                    {/* Poster */}
                    <View className="absolute -bottom-20 left-5 rounded-2xl overflow-hidden shadow-lg shadow-black/60">
                        <Image
                            source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }}
                            className="w-32 h-48"
                            resizeMode="cover"
                        />
                    </View>

                    {/* Play button */}
                    <TouchableOpacity
                        className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center shadow-lg shadow-black/60"
                        onPress={() => setVideoModalVisible(true)}
                    >
                        <Image source={icons.play} className="w-6 h-7 ml-1" resizeMode="stretch" />
                    </TouchableOpacity>

                    {movie && (
                        <VideoModal
                            visible={videoModalVisible}
                            onClose={() => setVideoModalVisible(false)}
                            videos={videos}
                            externalLinks={externalLinks ?? undefined}
                        />
                    )}
                </View>


                {/* Main content */}
                <View className="mt-24 px-5">
                    <Text className="text-white font-bold text-2xl leading-7">{movie?.title}</Text>

                    {/* Year + runtime */}
                    <View className="flex-row items-center gap-x-3 mt-2">
                        <View className="bg-dark-100 px-2 py-1 rounded-md">
                            <Text className="text-light-200 text-xs">
                                {movie?.release_date?.split("-")[0]}
                            </Text>
                        </View>
                        <View className="bg-dark-100 px-2 py-1 rounded-md">
                            <Text className="text-light-200 text-xs">{movie?.runtime}m</Text>
                        </View>
                    </View>

                    {/* Rating */}
                    <View className="flex-row items-center bg-dark-100 px-3 py-1.5 rounded-md gap-x-2 mt-3 self-start">
                        <Image source={icons.star} className="size-4" />
                        <Text className="text-white font-bold text-sm">
                            {Math.round(movie?.vote_average ?? 0)}/10
                        </Text>
                        <Text className="text-light-300 text-xs">({movie?.vote_count} votes)</Text>
                    </View>

                    {/* Like + Save buttons */}
                    <View className="flex-row justify-start mt-5">
                        <TouchableOpacity
                            className="flex-row items-center px-4 py-2 rounded-lg w-[25%]"
                            onPress={() => handleLike(movie?.title ?? "Movie")}
                        >
                            <Ionicons
                                name={liked ? "heart" : "heart-outline"}
                                size={20}
                                color="#fff"
                                style={{ marginRight: 5 }}
                            />
                            <Text className="text-white font-bold">{liked ? "Liked" : "Like"}</Text>
                        </TouchableOpacity>

                        {/* Save button (bookmark style) */}
                        <TouchableOpacity
                            className="flex-row items-center px-4 py-2 rounded-lg w-[35%]"
                            onPress={() => setModalVisible(true)}
                        >
                            <Ionicons
                                name={saved ? "bookmark" : "bookmark-outline"}
                                size={20}
                                color={saved ? "gold" : "#fff"}
                                style={{ marginRight: 5 }}
                            />
                            <Text className="text-white font-bold">{saved ? "Saved" : "Save"}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Save Modal */}
                    {movie && user && (
                        <SaveModal
                            visible={modalVisible}
                            onClose={() => setModalVisible(false)}
                            movie={{
                                id: movie.id,
                                title: movie.title,
                                poster_path: movie.poster_path,
                            }}
                            onUpdatedSaved={setSaved}
                        />
                    )}

                    {/* Overview + Genres */}
                    <MovieInfo label="Overview" value={movie?.overview} />
                    <MovieInfo label="Genres" value={movie?.genres?.map(g => g.name).join(" • ")} />

                    {/* Budget & Revenue */}
                    <View className="flex flex-row gap-10 w-full mt-5">
                        <MovieInfo
                            label="Budget"
                            value={
                              movie?.budget && movie.budget > 0
                                ? `$${(movie?.budget ?? 0) / 1_000_000}M`
                                : "Available After Release"
                            }
                        />
                        <MovieInfo
                            label="Revenue"
                            value= {
                              movie?.revenue && movie.revenue > 0
                                  ? `$${Math.round((movie?.revenue ?? 0) / 1_000_000)}M`
                                  :  "Available After Release"
                        }
                        />
                    </View>

                    <MovieInfo
                        label="Production Companies"
                        value={movie?.production_companies?.map(c => c.name).join(" • ") || "N/A"}
                    />

                    {/* Crew */}
                    {(directors.length > 0 || writers.length > 0 || producers.length > 0) && (
                        <View className="mt-8">
                            <Text className="text-white font-bold text-lg mb-3">Crew</Text>
                            {directors.length > 0 && (
                                <Text className="text-light-200 text-sm mb-1">
                                    Director:{" "}
                                    <Text className="text-white font-medium">{directors.map(d => d.name).join(", ")}</Text>
                                </Text>
                            )}
                            {writers.length > 0 && (
                                <Text className="text-light-200 text-sm mb-1">
                                    Writer(s):{" "}
                                    <Text className="text-white font-medium">{writers.map(w => w.name).join(", ")}</Text>
                                </Text>
                            )}
                            {producers.length > 0 && (
                                <Text className="text-light-200 text-sm">
                                    Producer(s):{" "}
                                    <Text className="text-white font-medium">{producers.map(p => p.name).join(", ")}</Text>
                                </Text>
                            )}
                        </View>
                    )}

                    {/* Cast */}
                    {credits?.cast && (
                        <View className="mt-8">
                            <Text className="text-white font-bold text-lg mb-3">Top Cast</Text>
                            <FlatList
                                data={credits.cast.slice(0, 10)}
                                keyExtractor={(item) => item.id.toString()}
                                horizontal
                                scrollEnabled={false}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <View className="mr-4 items-center w-20">
                                        <Image
                                            source={{
                                                uri: item.profile_path
                                                    ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
                                                    : "https://placehold.co/100x150/1a1a1a/ffffff.png",
                                            }}
                                            className="w-16 h-16 rounded-full mb-2"
                                        />
                                        <Text className="text-white text-xs text-center" numberOfLines={1}>
                                            {item.name}
                                        </Text>
                                        <Text className="text-light-300 text-[10px] text-center" numberOfLines={1}>
                                            {item.character}
                                        </Text>
                                    </View>
                                )}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default Details;
