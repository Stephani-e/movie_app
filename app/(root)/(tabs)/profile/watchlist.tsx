import {useEffect, useState} from "react";
import {ActivityIndicator, Alert, FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View,} from "react-native";
import useFetch from "@/services/useFetch";
import {fetchMovies} from "@/services/api";
import {useGlobalContext} from "@/lib/global-provider";
import {addToWatchlist, getWatchlist, removeFromWatchlist, updateWatchlistItem,} from "@/services/watchlist";
import {useNotify} from "@/hooks/useNotify";

import {images} from "@/constants/images";
import {icons} from "@/constants/icons";
import {Ionicons} from "@expo/vector-icons";

const WatchlistPage = () => {
    const { user } = useGlobalContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [noteModalVisible, setNoteModalVisible] = useState(false);
    const [pendingMovie, setPendingMovie] = useState<any>(null);
    const [noteText, setNoteText] = useState("");
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editNoteText, setEditNoteText] = useState("");
    const notify = useNotify();

    const {
        data: movies,
        loading,
        error,
        refetch: loadMovies,
        reset,
    } = useFetch(() => fetchMovies({ query: searchQuery }), false);

    useEffect(() => {
        if (user) loadWatchlist();
    }, [user]);

    const loadWatchlist = async () => {
        if (!user) return;
        try {
            const data = await getWatchlist(user.$id);
            setWatchlist(data);
        } catch (err) {
            console.error("Failed to load watchlist:", err);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            await loadMovies();
        } catch (err) {
            console.error("Search failed:", err);
        }
    };

    const openAddModal = (movie: any) => {
        setPendingMovie(movie);
        setNoteText("");
        setNoteModalVisible(true);
    };

    const confirmAdd = async (movieTitle: string) => {
        if (!user || !pendingMovie) return;
        try {
            const formattedMovie = {
                ...pendingMovie,
                poster_path: pendingMovie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${pendingMovie.poster_path}`
                    : "",
            };

            await addToWatchlist(user.$id, formattedMovie, noteText);
            await loadWatchlist();
            setNoteModalVisible(false);
            setPendingMovie(null);
            setNoteText("");
            notify(
                "Added to Watchlist",               // toastMessage
                `Added ${movieTitle} to Watchlist`, // dbMessage
                "watchlist",
                "success"
            );
        } catch (err) {
            console.error("Add failed:", err);
            notify(
                "Error Adding to Watchlist",               // toastMessage
                `${movieTitle} could not be added to Watchlist`, // dbMessage
                "watchlist",
                "error"
            );
        }
    };

    const handleRemove = async (movie: any, movieTitle: string) => {
        Alert.alert(
            "Delete Movie from Watchlist",
            "Are you sure you want to delete this movie from your watchlist?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        if (!user) return;
                        try {
                            await removeFromWatchlist(user.$id, movie.movieId);
                            await loadWatchlist();
                            notify(
                                "Removed from Watchlist",               // toastMessage
                                `Removed ${movieTitle} from Watchlist`, // dbMessage
                                "watchlist",
                                "success"
                            );
                        } catch (err) {
                            console.error("Remove failed:", err);
                            notify(
                                "Error Removing from Watchlist",               // toastMessage
                                `${movieTitle} could not be removed from Watchlist`, // dbMessage
                                "watchlist",
                                "error"
                            );
                        }
                    }
                }
            ]
        );
    };

    const isInWatchlist = (movieId: string) =>
        watchlist.some((item) => item.movieId === movieId.toString());

    const openEditNoteModal = (item: any) => {
        setEditingItem(item);
        setEditNoteText(item.notes || "");
        setEditModalVisible(true);
    };

    const confirmEditNote = async (movieTitle: string) => {
        if (!editingItem) return;

        try {
            await updateWatchlistItem(editingItem.$id, { notes: editNoteText });
            await loadWatchlist(); // refresh watchlist
            setEditModalVisible(false);
            setEditingItem(null);
            setEditNoteText("");
            notify(
                "Updated Note",               // toastMessage
                `Notes of ${movieTitle} has been updated`, // dbMessage
                "watchlist",
                "success"
            );
        } catch (err) {
            console.error("Failed to update note:", err);
            notify(
                "Error Updating Note",               // toastMessage
                `Notes of ${movieTitle} could not be updated`, // dbMessage
                "watchlist",
                "error"
            );
        }
    };

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />

            <View className="w-full flex-row justify-center mt-28 items-center">
                <Image source={icons.logo} className="w-12 h-10" />
            </View>

            {/* Search bar */}
            <View className="my-5 flex-row items-center px-5">
                <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search Movies..."
                    placeholderTextColor="#999"
                    className="flex-1 px-4 py-2 bg-white rounded-l-lg text-black"
                />
                <TouchableOpacity
                    onPress={handleSearch}
                    className="px-4 py-2 bg-white rounded-r-lg"
                >
                    <Text className="text-primary font-bold">Search</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setSearchQuery("");
                        reset();
                    }}
                    className="ml-2 px-3 py-2 bg-gray-500 rounded-lg"
                >
                    <Text className="text-white">Clear</Text>
                </TouchableOpacity>
            </View>

            {loading && (
                <ActivityIndicator size="large" color="#0000ff" className="my-3" />
            )}
            {error && (
                <Text className="text-red-500 px-5 my-3">Error: {error?.message}</Text>
            )}

            <FlatList
                data={movies}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item }) => {
                    const added = isInWatchlist(item.id);

                    return (
                        <View className="flex-row items-center px-5 py-3 bg-white/10 rounded-lg my-2">
                            {/* Poster */}
                            <Image
                                source={{
                                    uri: item.poster_path
                                        ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                                        : "https://via.placeholder.com/100x150?text=No+Image",
                                }}
                                className="w-16 h-24 rounded"
                            />

                            {/* Details */}
                            <View className="flex-1 ml-4">
                                <Text
                                    className="text-white text-sm font-semibold"
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>
                                <Text className="text-gray-300 text-xs mt-1">
                                    ⭐ {item.vote_average?.toFixed(1) || "N/A"}
                                </Text>
                            </View>

                            {/* Action button */}
                            <TouchableOpacity
                                onPress={() => added ? handleRemove(item, item.title) : openAddModal(item)}
                                className={`px-3 py-2 rounded ${
                                    added ? "bg-red-500" : "bg-green-500"
                                }`}
                            >
                                <Text className="text-white text-xs font-bold">
                                    {added ? "Remove" : "Add"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-gray-700">
                                {searchQuery.trim()
                                    ? "No movies found"
                                    : "Search for a movie"}
                            </Text>
                        </View>
                    ) : null
                }
            />

            <Text className="text-white text-lg font-bold px-5 mt-6">Your Watchlist</Text>
            <FlatList
                data={watchlist}
                keyExtractor={(item) => item.$id}
                contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
                renderItem={({ item }) => (
                    <View className="flex-row items-center px-5 py-3 bg-white/10 rounded-lg my-2">
                        <Image
                            source={{
                                uri: item.posterPath || "https://via.placeholder.com/100x150?text=No+Image",
                            }}
                            className="w-16 h-24 rounded"
                        />

                        <View className="flex-1 ml-4">
                            <Text className="text-white text-sm font-semibold" numberOfLines={1}>
                                {item.title}
                            </Text>
                            {item.notes ? (
                                <TouchableOpacity
                                    className="flex-row items-center mt-3"
                                    onPress={() => openEditNoteModal(item)}
                                >
                                    <Text className="text-gray-300 text-xs mr-0.5">{item.notes}</Text>
                                    <Ionicons
                                        name="pencil-sharp"
                                        size={7}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            ) : null}
                        </View>

                        <TouchableOpacity
                            onPress={() => handleRemove(item, item.title)}
                            className="px-3 py-2 rounded bg-red-500"
                        >
                            <Text className="text-white text-xs font-bold">Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <Text className="text-center text-gray-400 mt-4">Your watchlist is empty</Text>
                }
            />

            <Modal
                visible={noteModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setNoteModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white rounded-lg p-5 w-full">
                        <Text className="text-lg font-bold mb-3 text-black">Add a Note</Text>
                        <TextInput
                            value={noteText}
                            onChangeText={setNoteText}
                            placeholder="Type your note here..."
                            placeholderTextColor="#999"
                            className="border px-3 py-2 rounded text-black"
                        />
                        <View className="flex-row justify-end mt-4">
                            <TouchableOpacity
                                onPress={() => setNoteModalVisible(false)}
                                className="px-4 py-2 bg-gray-400 rounded mr-2"
                            >
                                <Text className="text-white">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => confirmAdd(pendingMovie.title || "Movie")}
                                className="px-4 py-2 bg-green-500 rounded"
                            >
                                <Text className="text-white">Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={editModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white rounded-lg p-5 w-full">
                        <Text className="text-lg font-bold mb-3 text-black">Edit Note</Text>
                        <TextInput
                            value={editNoteText}
                            onChangeText={setEditNoteText}
                            placeholder="Edit your note..."
                            placeholderTextColor="#999"
                            className="border px-3 py-2 rounded text-black"
                        />
                        <View className="flex-row justify-end mt-4">
                            <TouchableOpacity
                                onPress={() => setEditModalVisible(false)}
                                className="px-4 py-2 bg-gray-400 rounded mr-2"
                            >
                                <Text className="text-white">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => confirmEditNote(editingItem.title || "Note")}
                                className="px-4 py-2 bg-green-500 rounded"
                            >
                                <Text className="text-white">Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default WatchlistPage;
