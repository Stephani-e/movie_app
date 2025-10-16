import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Link, router} from 'expo-router'
import {icons} from "@/constants/icons";

const MovieCard = ({ id, poster_path, title, vote_average, release_date, original_language, onPress }: Movie & { onPress?: () => void }) => {

    return (
            <Link
                href={`/movies/${id}`}
                asChild
            >
                <TouchableOpacity
                    className='w-[30%] mb-5 activeOpacity:{0.8}'
                    onPress={() => {
                        if (onPress) onPress();

                        router.push(`/movies/${id}`);
                    }}
                >
                    <View className='relative'>
                        <Image
                            source={{
                                uri: poster_path
                                    ? `https://image.tmdb.org/t/p/w500${poster_path}`
                                    : `https://placehold.co/600/1a1a1a/ffffff.png`
                            }}
                            className='w-full h-52 rounded-lg'
                            resizeMode='cover'
                        />

                        {/* Rating Badge */}
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
                                {vote_average.toFixed(1)}
                            </Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text
                        className='mt-2 text-sm font-bold text-white'
                        numberOfLines={1}
                    >
                        {title}
                    </Text>

                    {/* Release year + genres */}
                    <View className="flex-row items-center mt-1">
                        <Text className="text-xs text-light-300 font-medium">
                            {release_date?.split("-")[0]}
                        </Text>
                        <Text className="text-xs text-light-300 mx-1">•</Text>
                        <Text className="text-xs text-light-300 font-medium">
                            {original_language.toUpperCase()}
                        </Text>
                    </View>
                </TouchableOpacity>
            </Link>
        );
}

export default MovieCard;