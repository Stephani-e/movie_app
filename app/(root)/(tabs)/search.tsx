import {useState} from "react";
import {ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View,} from 'react-native';

import useFetch from "@/services/useFetch";
import {fetchMovies} from "@/services/api";
import {useGlobalContext} from "@/lib/global-provider";
import {addHistoryEntry} from "@/services/history";


import {images} from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import {icons} from "@/constants/icons";
import {updateSearchCount, type SearchMovie} from "@/services/appwrite";
import {useNotify} from "@/hooks/useNotify";

const Search = () => {
    const { user } = useGlobalContext();
    const notify = useNotify();
    const [searchQuery, setSearchQuery] = useState('');
    const {
        data: movies,
        loading,
        error,
        refetch: loadMovies,
        reset,
    } = useFetch(() => fetchMovies({
        query: searchQuery,
    }), false);

    interface Movie {
        id: string;
        title: string;
        poster_path?: string;
        [key: string]: any; // fallback if TMDB sends extra fields
    }

    const handleSearch = async () => {
        console.log("Search Clicked with query:", searchQuery);

        if (!searchQuery.trim()) return;

        try {
            loadMovies(); // this will update the "movies" state automatically
        } catch (err) {
            console.error("Search failed:", err);
            notify(
                "Error encountered while searching",
                `Error searching for ${searchQuery}`,
                "search",
                "error"
            );
        }
    };

    const handleMovieSelect = async (movie: SearchMovie) => {
        if (!user) return;
        console.log("Movie Selected:", movie.title);

        try {
            // ✅ Update general search stats
            await updateSearchCount(searchQuery, movie);
            console.log("Movie Selected:", movie.title);
            // ✅ Add to user history
            await addHistoryEntry(user.$id, searchQuery, movie);

            notify(
                "Movie Selected",
                `You searched for ${movie.title}`,
                "search",
                "success"
            );
        } catch (err) {
            console.error("Error saving movie:", err);
            notify(
                "Failed to save movie",
                `Error searching for ${movie.title}`,
                "search",
                "error"
            );
        }
    };

    return (
        <View className='flex-1 bg-primary'>
            <Image
                source={images.bg}
                className='flex-1 absolute w-full z-0'
                resizeMode='cover'
            />

            <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} onPress={() => handleMovieSelect(item)} /> }
                keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                className='px-5'
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: 'center',
                    gap: 15,
                    marginVertical: 15
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={
                    <>
                        <View className='w-full flex-row justify-center mt-20 items-center'>
                            <Image
                                source={icons.logo}
                                className='w-12 h-10'
                            />
                        </View>

                        <View className="my-5 flex-row items-center py-10 ">
                            {/* Search input */}
                            <TextInput
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search Movies..."
                                placeholderTextColor="#999"
                                className="flex-1 px-4 py-2 bg-white rounded-l-lg text-black"
                            />

                            {/* Search button */}
                            <TouchableOpacity
                                onPress={handleSearch}
                                className="px-4 py-2 bg-white rounded-r-lg"
                                style={{
                                    borderLeftColor: "red",
                                }}
                            >
                                <Text className="text-primary font-bold">Search</Text>
                            </TouchableOpacity>

                            {/* Clear button */}
                            <TouchableOpacity
                                onPress={() => setSearchQuery("")}
                                className="ml-2 px-3 py-2 bg-gray-500 rounded-lg"
                            >
                                <Text className="text-white">Clear</Text>
                            </TouchableOpacity>
                        </View>

                        {loading && (
                            <ActivityIndicator
                                size='large'
                                color='#0000ff'
                                className='my-3 self-center'
                            />
                        )}

                        {error && (
                            <Text className='text-red-500 px-5 my-3'>
                                Error: {error?.message}
                            </Text>
                        )}

                        {
                            !loading &&
                            !error &&
                            searchQuery.trim() &&
                            movies?.length > 0 && (
                                <Text className='text-white text-xl font-bold '>Search Results for{' '}
                                    <Text className='text-accentText'>{searchQuery}</Text>
                                </Text>
                            )}
                    </>
                }
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className='mt-10 px-5'>
                            <Text className='text-center text-gray-700'>
                                {searchQuery.trim() ? 'No movies found' : 'Search for a movie' }
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}


export default Search;
