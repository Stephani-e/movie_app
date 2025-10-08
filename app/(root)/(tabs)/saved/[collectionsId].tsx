import React, {useEffect, useState} from "react";
import {ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View,} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {getCollectionItems, getUserCollectionById, removeMovieFromCollection,} from "@/services/collections";
import dayjs from "dayjs";
import {Ionicons} from "@expo/vector-icons";
import {useGlobalContext} from "@/lib/global-provider";
import {useNotify} from "@/hooks/useNotify";

const CollectionDetails = () => {
    const { updateCollectionCount } = useGlobalContext();
    const { collectionsId } = useLocalSearchParams<{ collectionsId: string }>();
    const [collectionName, setCollectionName] = useState("");
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const notify = useNotify();

    // fetch collection name
    useEffect(() => {
        if (!collectionsId) return;
        const fetchCollection = async () => {
            try {
                const col = await getUserCollectionById(collectionsId);
                if (col) setCollectionName(col.name);
            } catch (err) {
                console.error("Error fetching collection:", err);
            }
        };
        fetchCollection();
    }, [collectionsId]);

    // fetch movies in the collection
    const fetchMovies = async () => {
        if (!collectionsId) return;
        setLoading(true);
        try {
            const items = await getCollectionItems(collectionsId);
            setMovies(items);
        } catch (err) {
            console.error("Failed to fetch movies:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [collectionsId]);

    const confirmRemove = (movieId: string, title: string, collectionName: string) => {
        Alert.alert(
            "Remove Movie",
            `Are you sure you want to remove "${title}" from this collection?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Remove", style: "destructive", onPress: () => handleRemove(movieId, title, collectionName) },
            ]
        );
    };

    const handleRemove = async (movieId: string, title: string, collectionName: string) => {
        try {
            await removeMovieFromCollection(collectionsId!, movieId);
            setMovies((prev) => prev.filter((m) => m.movieId !== movieId));
            updateCollectionCount(collectionsId!, -1);
            notify(
                `Deleted a movie from this collection`,         // toastMessage
                `${title} deleted from ${collectionName} collection `, // dbMessage
                "collection_items",
                "success"
            );
        } catch (err) {
            Alert.alert("Error", "Failed to remove movie. Try again.");
            console.error("Remove movie error:", err);
            notify(
                `Error deletimg a movie from this collection`,         // toastMessage
                `Error deleting ${title} from ${collectionName} collection `, // dbMessage
                "collection_items",
                "error"
            );
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (movies.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-primary px-4">
                <Text className="text-white text-lg text-center">
                    No movies in this collection yet
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-primary">
            <View style={{ paddingHorizontal: 20, paddingTop: 120, paddingBottom: 40 }}>
                <Text className="text-2xl font-semibold text-white mb-6">
                   Collection: {collectionName || "My Collection"}
                </Text>

                <FlatList
                    data={movies}
                    keyExtractor={(item) => item.$id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    renderItem={({ item }) => (
                        <View className="mb-5 flex-row bg-secondary/30 rounded-xl overflow-hidden shadow-lg">
                            {/* Poster */}
                            <TouchableOpacity
                                onPress={() => router.push(`/movies/${item.movieId}`)}
                            >
                                {item.posterPath ? (
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w200${item.posterPath}` }}
                                        className="w-24 h-36"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="w-24 h-36 bg-gray-700" />
                                )}
                            </TouchableOpacity>

                            {/* Info + remove */}
                            <View className="flex-1 p-4 justify-between">
                                <View className="flex-row justify-between items-start">
                                    <Text
                                        className="text-white text-lg font-semibold flex-1 mr-2"
                                        numberOfLines={2}
                                    >
                                        {item.title}
                                    </Text>

                                    {/* Remove button */}
                                    <TouchableOpacity
                                        onPress={() => confirmRemove(item.movieId, item.title, collectionName)}
                                    >
                                        <Ionicons name="trash" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>

                                <Text className="text-gray-400 text-xs mt-2">
                                    Added {dayjs(item.$createdAt).format("MMM D, YYYY")}
                                </Text>
                            </View>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

export default CollectionDetails;
