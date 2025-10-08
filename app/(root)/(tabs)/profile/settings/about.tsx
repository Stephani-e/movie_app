import React from "react";
import {Image, Linking, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import {ArrowLeft, ExternalLink, Mail, Phone} from "lucide-react-native";
import {images} from "@/constants/images";

const About = () => {
    const handleEmail = () => Linking.openURL("mailto:gbengaadeyemistephanie@gmail.com");
    const handlePhone = () => Linking.openURL("tel:+2348161258480");
    const handleAppwrite = () => Linking.openURL("https://appwrite.io");
    const handleTMDb = () => Linking.openURL("https://www.themoviedb.org");

    return (
        <View className="flex-1 bg-primary">
            {/* Background */}
            <Image
                source={images.bg}
                className="flex-1 absolute w-full h-full z-0"
                resizeMode="cover"
            />

            {/* Header with Back Button */}
            <View className="flex-row items-center px-4 pt-12 pb-4 border-b border-white/10">
                <TouchableOpacity onPress={() => router.back()}>
                     <ArrowLeft size={20} color="#ffff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
                <Text className="text-2xl font-bold text-white mb-6">📱 About This App</Text>

                <Text className="text-base text-gray-200 leading-6 mb-4">
                    MobileSiteU was built to help you discover, save, and enjoy your favorite
                    movies. With a clean design and easy-to-use features, you can:
                </Text>

                {/* Indented List */}
                <View className="pl-4 mb-6">
                    <Text className="text-base text-gray-200 leading-6 mb-2">⭐ Save favorites to your profile</Text>
                    <Text className="text-base text-gray-200 leading-6 mb-2">🎬 Build your own watchlist</Text>
                    <Text className="text-base text-gray-200 leading-6 mb-2">🕒 Keep track of your viewing history</Text>
                    <Text className="text-base text-gray-200 leading-6">🔔 Get notified about updates and recommendations</Text>
                </View>

                <Text className="text-base text-gray-200 leading-6 mb-6">
                    We believe in making entertainment discovery simple, fun, and personal.
                </Text>

                <Text className="text-xl font-bold text-white mt-4 mb-4">👨‍💻 Credits</Text>
                <Text className="text-base text-gray-200 leading-6 mb-2">Developed with ❤️ by our team</Text>

                {/* Appwrite + TMDb Links */}
                <TouchableOpacity onPress={handleAppwrite} className="flex-row items-center mb-2">
                    <Text className="text-base text-blue-400 underline leading-6 mr-2">
                        Powered by Appwrite
                    </Text>
                    <ExternalLink size={16} color="#60A5FA" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleTMDb} className="flex-row items-center mb-6">
                    <Text className="text-base text-blue-400 underline leading-6 mr-2">
                        Powered by The Movie Database (TMDb)
                    </Text>
                    <ExternalLink size={16} color="#60A5FA" />
                </TouchableOpacity>

                <Text className="text-xl font-bold text-white mt-4 mb-4">📩 Contact Us</Text>
                <Text className="text-base text-gray-200 leading-6 mb-2">
                    Have feedback, questions, or suggestions?
                </Text>

                <TouchableOpacity onPress={handleEmail} className="flex-row items-center mb-2 gap-1">
                    <Mail size={16} color="#60A5FA" className="mr-5" />
                    <Text className="text-base text-blue-400 underline leading-6">
                        gbengaadeyemistephanie@gmail.com
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handlePhone} className="flex-row items-center gap-1">
                    <Phone size={16} color="#60A5FA" className="mr-2" />
                    <Text className="text-base text-blue-400 underline leading-6">
                        +234 816 125 8480
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default About;
