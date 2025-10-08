import {Link} from "expo-router";
import {Image, Text, TouchableOpacity, View} from "react-native";

interface TrendingCardProps {
    movie: {
        movie_id: number;
        title: string;
        poster_url: string;
    };
    index: number;
}

const TrendingCard = ({ movie: { movie_id, title, poster_url }, index }: TrendingCardProps) => {
    return (
        <Link href={`/movies/${movie_id}`} asChild>
            <TouchableOpacity
                style={{
                    width: 100,
                    marginHorizontal: 6,
                }}
            >
                {/* Poster */}
                <View style={{ position: 'relative' }}>
                    <Image
                        source={{ uri: poster_url }}
                        style={{ width: 77, height: 115, borderRadius: 12 }}
                        resizeMode="cover"
                    />

                    {/* Ranking Number */}
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 4,
                            left: 4,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 6,
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                            #{index + 1}
                        </Text>
                    </View>
                </View>

                {/* Title */}
                <Text
                    style={{ color: '#e5e5e5', fontWeight: 'bold', fontSize: 12, marginTop: 4 }}
                    numberOfLines={2}
                >
                    {title}
                </Text>
            </TouchableOpacity>
        </Link>
    );
};

export default TrendingCard;
