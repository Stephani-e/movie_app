import {Image, Text, TouchableOpacity, View} from "react-native";
import {Link} from "expo-router";

interface UpcomingMovieProps {
    movie: Movie;
    onPress?: () => void;
}

const UpcomingCard = ({ movie, onPress }: UpcomingMovieProps) => {
    // Full formatted date for "Releases Sep 19, 2025"
    const releaseDate = new Date(movie.release_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    // Manual month mapping to ensure 3-letter abbreviation
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const releaseDay = new Date(movie.release_date).getDate();
    const releaseMonth = monthNames[new Date(movie.release_date).getMonth()];

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
                {/* Release Date Box */}
                <View className="w-20 items-center justify-center mr-3">
                    <Text className="text-base font-bold text-red-400">
                        {releaseDay}
                    </Text>
                    <Text className="text-xs text-gray-400 uppercase">
                        {releaseMonth}
                    </Text>
                </View>

                {/* Poster + Info */}
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}` }}
                    className="w-16 h-24 rounded-lg"
                    resizeMode="cover"
                />

                <View className="flex-1 ml-3">
                    <Text
                        className="text-white font-semibold text-base"
                        numberOfLines={1}
                    >
                        {movie.title}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1">
                        Releases {releaseDate}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default UpcomingCard;
