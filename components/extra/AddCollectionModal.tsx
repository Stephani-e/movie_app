import React, {useState} from "react";
import {ActivityIndicator, Alert, Modal, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {createCollection} from "@/services/collections";
import {useGlobalContext} from "@/lib/global-provider";
import {useNotify} from "@/hooks/useNotify";

interface AddCollectionModalProps {
    visible: boolean;
    onClose: () => void;
    onCreated: (newCollection: any) => void; // callback to update parent list
}

const AddCollectionModal: React.FC<AddCollectionModalProps> = ({ visible, onClose, onCreated, }) => {
    const { user } = useGlobalContext();
    const [name, setName] = useState("");
    const [creating, setCreating] = useState(false);
    const notify = useNotify();

    const handleCreate = async () => {
        if (!name.trim() || !user) {
            Alert.alert("Please enter a valid name");
            return;
        }
        setCreating(true);
        try {
            const newCol = await createCollection(user.$id, name.trim());
            onCreated(newCol); // send back to parent
            setName("");
            Alert.alert("Collection created!");
            onClose();
            notify(
                `Created a new Collection`,         // toastMessage
                `${newCol.name} Collection Created`, // dbMessage
                "collections",
                "success"
            );
        } catch (err) {
            console.error("Error creating collection:", err);
            Alert.alert("Failed to create collection.");
            notify(
                `Error Creating a new Collection`,         // toastMessage
                `Error Creating ${name} Collection`, // dbMessage
                "collections",
                "error"
            );
        } finally {
            setCreating(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 justify-center items-center bg-black/60">
                <View className="bg-white rounded-2xl p-6 w-11/12">
                    <Text className="text-xl font-bold mb-4">Create New Collection</Text>

                    <TextInput
                        placeholder="Collection name"
                        value={name}
                        onChangeText={setName}
                        className="border border-gray-300 rounded-md p-3 mb-4"
                    />

                    <TouchableOpacity
                        onPress={handleCreate}
                        disabled={creating || !name.trim()}
                        className="bg-blue-500 rounded-lg p-3 mb-3"
                    >
                        {creating ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white text-center font-bold">Create</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-gray-400 rounded-lg p-3"
                        disabled={creating}
                    >
                        <Text className="text-center text-white font-bold">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AddCollectionModal;
