import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect, useRouter} from 'expo-router';
import {ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View,} from 'react-native';
import {images} from "@/constants/images";
import {Plus, Trash2} from 'lucide-react-native';
import {deleteCollection, getCollectionItems, getUserCollections} from "@/services/collections";
import {useGlobalContext} from "@/lib/global-provider";
import AddCollectionModal from "@/components/extra/AddCollectionModal";
import dayjs from "dayjs";
import {useNotify} from "@/hooks/useNotify";

const Index = () => {
    const router = useRouter();
    const {user, collectionsUpdate} = useGlobalContext();
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const notify = useNotify();

    const fetchCollections = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const userCollections = await getUserCollections(user.$id);
            const collectionsWithCounts = await Promise.all(
                userCollections.map(async (col: any) => {
                    const items = await getCollectionItems(col.$id);
                    return {...col, movieCount: items.length};
                })
            );
            setCollections(collectionsWithCounts);
        } catch (err) {
            console.error("Error fetching collections:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            fetchCollections();
        }, [user])
    );

    // Apply live updates from GlobalContext
    useEffect(() => {
        if (!collectionsUpdate) return;
        setCollections(prev =>
            prev.map(col => ({
                ...col,
                movieCount: Math.max(0, col.movieCount + (collectionsUpdate[col.$id] || 0)),
            }))
        );
    }, [collectionsUpdate]);

    // handle a new collection from modal
    const handleNewCollection = (newCol: any) => {
        setCollections(prev => [...prev, {...newCol, movieCount: 0}]);
    };

    const handleMovieAdded = (collectionId: string) => {
        setCollections((prev) =>
            prev.map((col) =>
                col.$id === collectionId
                    ? { ...col, movieCount: col.movieCount + 1 }
                    : col
            )
        );
    };

    const handleMovieRemoved = (collectionId: string) => {
        setCollections((prev) =>
            prev.map((col) =>
                col.$id === collectionId
                    ? { ...col, movieCount: Math.max(0, col.movieCount - 1) }
                    : col
            )
        );
    };

    const handleDeleteCollection = (collectionId: string, name: string) => {
        Alert.alert(
            "Delete Collection",
            `Are you sure you want to delete "${name}"? This cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteCollection(collectionId);
                            setCollections((prev) =>
                                prev.filter((col) => col.$id !== collectionId)
                            );
                            notify(
                                `Deleted a collection`,         // toastMessage
                                `${name} collection deleted`, // dbMessage
                                "collections",
                                "success"
                            );
                        } catch (err) {
                            console.error("Error deleting collection:", err);
                            Alert.alert("Error", "Failed to delete collection. Try again.");
                            notify(
                                `Error deleting collection`,         // toastMessage
                                `Error deleting ${name} collection`, // dbMessage
                                "collections",
                                "error"
                            );
                        }
                    },
                },
            ]
        );
    }

    return (
        <View className='flex-1 bg-primary'>
            <Image
                source={images.bg}
                className='flex-1 absolute w-full z-0'
                resizeMode='cover'
            />

            <FlatList
                data={collections}
                keyExtractor={(item) => item.$id}
                contentContainerStyle={{ padding: 20, paddingTop: 100 }}
                ListHeaderComponent={
                    <>
                        <Text className="text-2xl font-semibold text-white mb-8">
                            View Your Saved Movies
                        </Text>

                        {loading && <ActivityIndicator size="large" color="#fff" />}

                        {!loading && collections.length === 0 && (
                            <Text className="text-gray-300 mb-6">No collections yet.</Text>
                        )}
                    </>
                }
                renderItem={({ item }) => (
                    <View
                        className="py-4 px-4 rounded-lg mb-4"
                        style={{ backgroundColor: "white", position: "relative" }}
                    >
                        {/* Delete button */}
                        <TouchableOpacity
                            onPress={() => handleDeleteCollection(item.$id, item.name)}
                            style={{
                                position: "absolute",
                                top: 10,
                                right: 8,
                                backgroundColor: "red",
                                borderRadius: 20,
                                zIndex: 10,
                                padding: 6,
                                elevation: 3,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 2,
                            }}
                        >
                            <Trash2 size={16} color="white" />
                        </TouchableOpacity>

                        {/* Navigate area */}
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: "/saved/[collectionsId]",
                                    params: { collectionsId: item.$id },
                                })
                            }
                            activeOpacity={0.7}
                        >
                            {/* Title */}
                            <Text className="text-xl font-rubik-bold text-blue-950 pr-6">
                                {item.name}
                            </Text>

                            {/* Row with count + created date */}
                            <View className="flex-row justify-between items-center mt-4">
                                <Text className="text-blue-950 font-medium">
                                    {item.movieCount} movies
                                </Text>
                                <Text className="text-gray-400 text-xs">
                                    Created: {dayjs(item.$createdAt).format("MMM D, YYYY")}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                )}
                ListFooterComponent={
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        className="flex-row items-center justify-center py-4 bg-green-600 rounded-lg mt-6"
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 12,
                            alignSelf: "flex-start",
                        }}
                    >
                        <Plus size={20} color="#fff" />
                        <Text className="text-white text-lg font-rubik-bold ml-2">
                            Add New Collection
                        </Text>
                    </TouchableOpacity>
                }
            />
            <AddCollectionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCreated={handleNewCollection}
            />
        </View>
    );
};

export default Index;
