import {Image, Text, TouchableOpacity, View} from "react-native";
import {icons} from "@/constants/icons";
import {useEffect, useState} from "react";
import {fetchMovieDetails} from "@/services/api";
import {Link} from "expo-router";

interface TopRatedCardProps {
    movie: Movie;
    rank: number;
    onPress?: () => void;
}

const TopRatedCard = ({ movie, rank, onPress }: TopRatedCardProps) => {
    const [genres, setGenres] = useState<string | null>(null);

    useEffect(() => {
        const getDetails = async () => {
            try {
                const details = await fetchMovieDetails(movie.id.toString());
                setGenres(details.genres?.map((g) => g.name).join(" • ") || null);
            } catch (err) {
                console.log("Failed to fetch movie details:", err);
            }
        };

        getDetails();
    }, [movie.id]);

    return (
        <Link
            href={`/movies/${movie.id}`}
            asChild
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                className="flex-row items-center bg-black/40 rounded-xl p-3 mb-3"
            >
                {/* Rank number */}
                <View className="w-10 items-center justify-center mr-3">
                    <Text className="text-2xl font-bold text-red-400">{rank}</Text>
                </View>

                {/* Poster */}
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}` }}
                    className="w-16 h-24 rounded-lg"
                    resizeMode="cover"
                />

                {/* Movie info */}
                <View className="flex-1 ml-3 justify-between">
                    <View>
                        <Text className="text-white font-bold text-base" numberOfLines={1}>
                            {movie.title}
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <Image source={icons.star} className="size-3 mr-1" />
                            <Text className="text-yellow-400 font-semibold text-sm">
                                {movie.vote_average.toFixed(1)}
                            </Text>
                        </View>
                    </View>

                    {genres && (
                        <Text className="text-light-300 text-xs mt-1" numberOfLines={1}>
                            {genres}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default TopRatedCard;
