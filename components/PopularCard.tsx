import {Image, Text, TouchableOpacity, View} from "react-native";
import {icons} from "@/constants/icons";
import {useEffect, useState} from "react";
import {fetchMovieDetails} from "@/services/api";
import {Link} from "expo-router";

interface PopularCardProps {
    movie: Movie;
    onPress?: () => void;
}

const PopularCard = ({ movie, onPress }: PopularCardProps) => {
    const [tagline, setTagline] = useState<string | null>(null);

    useEffect(() => {
        const getDetails = async () => {
            try {
                const details = await fetchMovieDetails(movie.id.toString());
                setTagline(details.tagline);
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
                className="w-64 h-96 rounded-2xl overflow-hidden bg-gray-900 shadow-lg"
            >
                {/* Poster */}
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                    className="w-full h-full"
                    resizeMode="cover"
                />

                {/* Info panel */}
                <View className="absolute bottom-0 left-0 right-0 bg-black/70 p-3 justify-center items-center rounded-b-2xl">
                    <Text className="text-white font-bold text-center text-base" numberOfLines={1}>
                        {movie.title}
                    </Text>

                    {tagline && (
                        <Text className='text-gray-300 font-extrabold text-center text-xs italic mt-1'> "{tagline}" </Text>
                    )}
                </View>

                {/* Rating badge top-right */}
                <View
                    className='absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md flex-row items-center'
                >
                    <Image
                        source={icons.star}
                        className='size-2 mr-1'
                    />
                    <Text
                        className='text-xs font-bold text-yellow-400'
                    >
                        {movie.vote_average.toFixed(1)}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>

    );
};

export default PopularCard;
