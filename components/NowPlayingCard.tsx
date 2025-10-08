import {Image, TouchableOpacity} from "react-native";
import {Link} from "expo-router";

interface NowPlayingCardProps {
    movie: Movie;
    onPress?: () => void;
}

const NowPlayingCard = ({ movie, onPress }: NowPlayingCardProps) => {
    return (
        <Link
            href={`/movies/${movie.id}`}
            asChild
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                className="w-[350px] h-[500px] mx-2 rounded-2xl overflow-hidden"
            >
                {/* Poster */}
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                    className="w-full h-full"
                    resizeMode="cover"
                />

                {/*/!* Dark overlay with title + release date *!/*/}
                {/*<View className="absolute bottom-0 left-0 right-0 p-4 bg-black/60">*/}
                {/*    <Text className="text-xl font-bold text-white text-center" numberOfLines={1}>*/}
                {/*        {movie.title}*/}
                {/*    </Text>*/}
                {/*    <Text className="text-gray-300 text-sm text-center">*/}
                {/*        {movie.release_date}*/}
                {/*    </Text>*/}
                {/*</View>*/}
            </TouchableOpacity>
        </Link>
    );
};

export default NowPlayingCard;
