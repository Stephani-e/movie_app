import React from "react";
import {Image, Linking, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {images} from "@/constants/images";
import {useRouter} from "expo-router";
import {ArrowLeft} from "lucide-react-native";

const PrivacyPolicy = () => {
    const router = useRouter();
    const handleEmail = () => Linking.openURL("mailto:gbengaadeyemistephanie@gmail.com");

    return (
        <View className="flex-1 bg-primary">
            {/* Background */}
            <Image
                source={images.bg}
                className="flex-1 absolute w-full h-full z-0"
                resizeMode="cover"
            />

            <View className="flex-row items-center px-4 pt-12 pb-4 border-b border-white/10">
                {/*Back button */}
                <TouchableOpacity onPress={() => router.back()} >
                    <ArrowLeft size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
                <Text className="text-2xl font-bold text-white mb-6">🔒 Privacy Policy</Text>

                <Text className="text-base text-gray-200 leading-6 mb-4">
                    Your privacy is important to us. This Privacy Policy explains how
                    MovieApp collects, uses, and protects your information.
                </Text>

                <Text className="text-xl font-bold text-white mb-2">1. Information We Collect</Text>
                <Text className="text-base text-gray-300 leading-6 mb-4">
                    We collect basic account information (name, email) when you sign up.
                    We also store your favorites, watchlist, and history so you can access
                    them across devices.
                </Text>

                <Text className="text-xl font-bold text-white mb-2">2. How We Use Your Data</Text>
                <Text className="text-base text-gray-300 leading-6 mb-4">
                    Your data is only used to provide app features such as saving
                    favorites, watchlist, and personalization. We do not sell or share
                    your data with third parties.
                </Text>

                <Text className="text-xl font-bold text-white mb-2">3. Third-Party Services</Text>
                <Text className="text-base text-gray-300 leading-6 mb-4">
                    Movie data is provided by The Movie Database (TMDb). Your use of TMDb
                    is subject to their privacy policy.
                </Text>

                <Text className="text-xl font-bold text-white mb-2">4. Security</Text>
                <Text className="text-base text-gray-300 leading-6 mb-4">
                    We use secure authentication and storage powered by Appwrite to
                    protect your account and personal data.
                </Text>

                <Text className="text-xl font-bold text-white mb-2">5. Contact Us</Text>
                <TouchableOpacity
                    onPress={handleEmail}
                    //className="flex-row items-center mb-2 gap-1"
                >
                    <Text className="text-base text-gray-300 leading-6 mb-4">
                        If you have questions about this Privacy Policy, contact us at:
                    </Text>
                    <Text className="text-base text-gray-300">Email: support@movieapp.com</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default PrivacyPolicy;
