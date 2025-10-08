import React, {useEffect, useState} from "react";
import {ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View,} from "react-native";
import {getFavorites, removeFavorite} from "@/services/favorites";
import {useGlobalContext} from "@/lib/global-provider";
import {router} from "expo-router";
import dayjs from "dayjs";
import {Ionicons} from "@expo/vector-icons";
import {useNotify} from "@/hooks/useNotify";

const Favorites = () => {
    const { user } = useGlobalContext();
    const notify = useNotify();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        if (!user) return;
        try {
            const data = await getFavorites(user.$id);
            setFavorites(data);
        } catch (err) {
            console.error("Error fetching Favorites:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [user]);

    const confirmRemove = (movieId: string, title: string) => {
        Alert.alert(
            "Remove Favorite",
            `Are you sure you want to remove "${title}" from your favorites?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Remove", style: "destructive", onPress: () => handleRemove(movieId, title) },
            ]
        );
    };

    const handleRemove = async (movieId: string, movieTitle: string) => {
        try {
            // @ts-ignore
            await removeFavorite(user.$id, movieId);
            setFavorites((prev) => prev.filter((f) => f.movieId !== movieId));
            notify(
                "Removed a movie from Favorites",               // toastMessage
                `You removed ${movieTitle} from Favorites`, // dbMessage
                "favorites",
                "success"
            );
        } catch (err) {
            Alert.alert("Error", "Failed to remove from favorites. Try again.");
            console.error("Remove favorite error:", err);
            notify(
                "Removing movie from Favorites failed",               // toastMessage
                `Problem removing ${movieTitle} from Favorites`, // dbMessage
                "favorites",
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

    if (favorites.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <Text className="text-white text-lg">No favorites yet</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-primary">
           <View
               style={{
                   paddingHorizontal: 20,
                   paddingTop: 120,
                   paddingBottom: 40,
               }}
           >
               <FlatList
                   data={favorites}
                   keyExtractor={(item, index) => `${item.$id}-${index}`}
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
                                   <TouchableOpacity onPress={() => confirmRemove(item.movieId, item.title)}>
                                       <Ionicons name="heart-dislike" size={20} color="white" />
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

export default Favorites;
