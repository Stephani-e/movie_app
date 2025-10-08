import React, {useState} from "react";
import {
    Alert,
    Image,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {useGlobalContext} from "@/lib/global-provider";
import {images} from "@/constants/images";
import {account} from "@/lib/appwrite";
import {useNotify} from "@/hooks/useNotify";

const SUPPORT_EMAIL= "gbengaadeyemistephanie@gmail.com"
const SUPPORT_PHONE= "+2348161258480"

const EditProfile = () => {
    const { user } = useGlobalContext();
    const [name, setName] = useState(user?.name || "");
    const [modalVisible, setModalVisible] = useState(false);
    const notify = useNotify();

    const handleSave = async () => {
        try {
            if (name !== user?.name) {
                await account.updateName(name);
            }
            Alert.alert("Profile Updated", "Your profile has been updated");
            notify(
                `Updated Profile Successfully`,         // toastMessage
                `Profile edited successfully; Changed from ${user?.name} to ${name}`, // dbMessage
                "profile",
                "success"
            );
        } catch (err) {
            console.error("Profile Update Failed:", err);
            Alert.alert("Profile Update Failed", "Please try again later");
            notify(
                `Error Editing Profile`,         // toastMessage
                `Error Editing Profile; ${user?.name} still remains`, // dbMessage
                "profile",
                "error"
            );
        }
       // console.log("Updated profile:", { name });
    };

    const openEmail = () => {
        Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Support Request&body=Hi, I have a question about my account.`);
    };

    const callPhone = () => {
        Linking.openURL(`tel:${SUPPORT_PHONE}`);
    }

    return (
        <View className="flex-1 bg-primary">
            {/* Background */}
            <Image
                source={images.bg}
                className="absolute w-full h-full z-0"
                resizeMode="cover"
            />

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 100, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >

                {/* Avatar */}
                <View
                    className="items-center mb-10"
                >
                    <Image
                        source={{ uri: user?.avatar }}
                        className="w-24 h-24 rounded-full border-4 border-primary"
                    />
                    <Text className="text-white mt-3 text-sm">{user?.email}</Text>
                </View>

                {/* Full Name */}
                <View className="mt-6 mb-6">
                    <Text className="text-white mb-2 font-rubik">Full Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        placeholderTextColor="#888"
                        className="bg-inputBg text-white px-4 py-3 rounded-xl"
                        style={{
                            backgroundColor: "rgba(30,27,51,0.9)",
                            paddingLeft: 15,
                        }}
                    />
                </View>

                {/* Email */}
                <View className="mt-6 mb-6">
                    <Text className="text-white mb-2 font-rubik">Email</Text>
                    <TextInput
                        value={user?.email}
                        editable={false}
                        placeholder="Enter your email"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        className="bg-[#1E1B33] text-white px-4 py-3 rounded-xl"
                        style={{
                            backgroundColor: "#1E1B33",
                            paddingLeft: 15,
                        }}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                >
                    <Text
                        className="text-xs text-white underline"
                        style={{ marginTop: 3, marginLeft: 15 }}
                    >
                        To change your email, please contact support.
                    </Text>
                </TouchableOpacity>

                {/* Save button */}
                <TouchableOpacity
                    className="bg-darkAccent py-4 rounded-xl mt-12"
                    style={{ backgroundColor: "#AB8BFF" }}
                    onPress={handleSave}
                >
                    <Text className="text-center text-white font-bold text-lg">
                        Save Changes
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Support Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    className="flex-1 justify-center items-center bg-black/50"
                    onPress={() => setModalVisible(false)}
                >
                    <View className="bg-white p-6 rounded-xl w-80">
                        <Text className="text-lg font-bold mb-4">Contact Support</Text>
                        <Text className="mb-2">Email:</Text>
                        <TouchableOpacity onPress={openEmail}>
                            <Text className="text-blue-600 underline">{SUPPORT_EMAIL}</Text>
                        </TouchableOpacity>

                        <Text className="mt-4 mb-2">Phone:</Text>
                        <TouchableOpacity onPress={callPhone}>
                            <Text className="text-blue-600 underline">{SUPPORT_PHONE}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="mt-6 bg-gray-200 py-2 rounded-xl"
                            onPress={() => setModalVisible(false)}
                        >
                            <Text className="text-center font-bold">Close</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export default EditProfile;
