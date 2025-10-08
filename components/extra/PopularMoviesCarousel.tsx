import {Dimensions, View} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import PopularCard from "../PopularCard";

interface PopularMoviesCarouselProps {
    movies: Movie[];
}

const { width: screenWidth } = Dimensions.get("window");

const PopularMoviesCarousel = ({ movies }: PopularMoviesCarouselProps) => {
    return (
        <View className="mt-5 mb-10" style={{ alignItems: 'center' }}>
            <Carousel
                loop={false}
                width={screenWidth * 0.75}      // a bit wider
                height={300}                    // adjust for PopularCard height
                data={movies}
                scrollAnimationDuration={800}
                mode="parallax"
                // panGestureHandlerProps={{
                //     activeOffsetX: [-10, 10],  // prevents accidental scroll
                // }}
                style={{ alignSelf: 'center' }}
                renderItem={({ item }) => (
                    <View style={{ marginHorizontal: 8 }}>
                        <PopularCard movie={item} />
                    </View>
                )}
            />
        </View>
    );
};

export default PopularMoviesCarousel;
