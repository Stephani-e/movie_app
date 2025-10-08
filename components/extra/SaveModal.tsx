import React, {useEffect, useState} from "react";
import {ActivityIndicator, Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, View,} from "react-native";
import Checkbox from "expo-checkbox";
import {useGlobalContext} from "@/lib/global-provider";
import {
    addMovieToCollection,
    createCollection,
    getCollectionItems,
    getUserCollections,
    removeMovieFromCollection,
} from "@/services/collections";
import {useNotify} from "@/hooks/useNotify";

interface SaveModalProps {
    visible: boolean;
    onClose: () => void;
    movie: {
        id: number;
        title: string;
        poster_path: string | null;
    };
    onUpdatedSaved: (saved: boolean) => void;
    onMovieAdded?: (collectionId: string) => void;
    onMovieRemoved?: (collectionId: string) => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ visible, onClose, movie, onUpdatedSaved, onMovieAdded, onMovieRemoved }) => {
    const { user } = useGlobalContext();
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const notify = useNotify();

    // Update "Saved" button state in details page
    useEffect(() => {
        onUpdatedSaved(selected.length > 0);
    }, [selected]);

    // Fetch collections and mark which already contain this movie
    useEffect(() => {
        if (!visible || !user) return;

        const fetchCollections = async () => {
            setLoading(true);
            try {
                const userCollections = await getUserCollections(user.$id);

                const withMembership = await Promise.all(
                    userCollections.map(async (col: any) => {
                        const items = await getCollectionItems(col.$id);
                        const inCollection = items.some(
                            (it: any) => it.movieId === movie.id.toString()
                        );
                        return { ...col, inCollection };
                    })
                );

                setCollections(withMembership);
                setSelected(
                    withMembership.filter((c) => c.inCollection).map((c) => c.$id)
                );
            } catch (err) {
                console.error("Error fetching collections:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, [visible, user, movie]);

    // Create a new collection
    const handleCreateCollection = async () => {
        if (!newCollectionName.trim() || !user) return;

        setCreating(true);
        try {
            const newCol = await createCollection(user.$id, newCollectionName.trim());
            setCollections((prev) => [...prev, { ...newCol, inCollection: false }]);
            setNewCollectionName("");
            Alert.alert(`Collection "${newCol.name}" created!`);
            notify(
                `Created a new collection`,         // toastMessage
                `${newCol.name} collection created`, // dbMessage
                "collections",
                "success"
            );
        } catch (err) {
            console.error("Error creating collection:", err);
            Alert.alert("Failed to create collection.");
            notify(
                `Error Creating a New Collection`,               // toastMessage
                `Error Creating ${newCollectionName} Collection`, // dbMessage
                "collections",
                "error"
            );
        } finally {
            setCreating(false);
        }
    };

    // Toggle movie in/out of a collection
    const toggleCollection = async (
        collectionId: string,
        checked: boolean,
        movieTitle: string,
        collectionName: string
    ) => {
        if (!user) return;
        setSaving(true);
        try {
            if (checked) {
                await addMovieToCollection(collectionId, movie, user.$id);
                setSelected((prev) => [...prev, collectionId]);
                onMovieAdded?.(collectionId);
                notify(
                    `Added movie to ${collectionName} Collection`,               // toastMessage
                    `${movieTitle} added to ${collectionName} Collection`, // dbMessage
                    "collection_items",
                    "success"
                );
            } else {
                await removeMovieFromCollection(collectionId, movie.id.toString());
                setSelected((prev) => prev.filter((id) => id !== collectionId));
                onMovieRemoved?.(collectionId);
                notify(
                    `Removed movie from ${collectionName} Collection`,               // toastMessage
                    `${movieTitle} removed from ${collectionName} Collection`, // dbMessage
                    "collection_items",
                    "success"
                );
            }
        } catch (err) {
            console.error("Error updating collection:", err);
            Alert.alert("Failed to update collection.");
            notify(
                `Error adding/removing movie from ${collectionName} Collection`,               // toastMessage
                `${movieTitle} could not added/removed from ${collectionName} Collection`, // dbMessage
                "collection_items",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 justify-end bg-black/60">
                <View className="bg-white rounded-t-2xl p-6 max-h-[90%]">
                    <Text className="text-xl font-bold mb-4">
                        Save "{movie.title}" to Collections
                    </Text>

                    {loading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <>
                            <FlatList
                                data={collections}
                                keyExtractor={(item) => item.$id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        className="flex-row items-center justify-between py-3 border-b border-gray-200"
                                        onPress={() =>
                                            toggleCollection(
                                                item.$id,
                                                !selected.includes(item.$id),
                                                movie.title,
                                                item.name
                                            )
                                        }
                                        disabled={saving}
                                    >
                                        <Text className="text-lg">{item.name}</Text>
                                        <Checkbox
                                            value={selected.includes(item.$id)}
                                            onValueChange={(val) => toggleCollection(
                                                item.$id,
                                                val,
                                                movie.title,
                                                item.name
                                            )
                                        }
                                            color={
                                                selected.includes(item.$id) ? "#3B82F6" : undefined
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <Text className="text-gray-500 text-center mt-6">
                                        You don’t have any collections yet.
                                    </Text>
                                }
                            />

                            {/* Add a new collection */}
                            <View className="mt-4">
                                <TextInput
                                    placeholder="New collection name"
                                    value={newCollectionName}
                                    onChangeText={setNewCollectionName}
                                    className="border border-gray-300 rounded-md p-2 mb-2"
                                />
                                <TouchableOpacity
                                    onPress={handleCreateCollection}
                                    disabled={creating || !newCollectionName.trim()}
                                    className="bg-blue-500 rounded-md p-3"
                                >
                                    <Text className="text-white text-center font-bold">
                                        {creating ? "Creating..." : "+ Add New Collection"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    {/* Close button */}
                    <TouchableOpacity
                        className="mt-6 bg-red-500 rounded-xl p-3"
                        onPress={onClose}
                        disabled={saving || creating}
                    >
                        <Text className="text-center text-white text-lg">Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default SaveModal;
