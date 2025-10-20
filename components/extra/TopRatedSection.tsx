import {useState} from "react";
import {LayoutAnimation, Platform, Text, TouchableOpacity, UIManager, View} from "react-native";
import TopRatedCard from "@/components/TopRatedCard";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TopRatedSection = ({ topRatedMovies }: { topRatedMovies: MovieApiResponse }) => {
    const [visibleCount, setVisibleCount] = useState(10); // Show first 10 initially
    const isExpanded = visibleCount >= topRatedMovies.results.length;

    const toggleSeeMore = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setVisibleCount(isExpanded ? 10 : topRatedMovies.results.length);
    };

    return (
        <View className="mt-10">
            <Text className="text-lg text-white font-bold mb-3">
                Top Rated Movies
            </Text>

            {/* Instead of FlatList, just map so we don’t create another VirtualizedList */}
            {topRatedMovies.results.slice(0, visibleCount).map((item, index) => (
                <TopRatedCard key={item.id} movie={item} rank={index + 1} />
            ))}

            <TouchableOpacity
                onPress={toggleSeeMore}
                className="mt-3 py-2 bg-accent rounded-lg items-center"
            >
                <Text className="text-white font-semibold">
                    {isExpanded ? "See Less" : "See More"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default TopRatedSection;
