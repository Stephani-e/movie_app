import React from "react";
import {Image, Linking, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useRouter} from "expo-router";
import {ArrowLeft} from "lucide-react-native";
import {images} from "@/constants/images";

const Support = () => {
    const router = useRouter();

    const handleEmail = () => {
        Linking.openURL("mailto:gbengaadeyemistephanie@gmail.com");
    };

    const handlePhone = () => {
        Linking.openURL("tel:+2348021273929");
    };

    const handleFAQ = () => {
        router.push("/profile/settings/faq");
    };

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
                {/* Title */}
                <Text className="text-2xl font-bold text-white mb-6">💬 Support</Text>

                {/* Intro */}
                <Text className="text-base text-gray-200 leading-6 mb-6">
                    Need help with MovieApp? We’re here to make your experience smooth and enjoyable.
                    Choose one of the options below:
                </Text>

                {/* Support options */}
                <TouchableOpacity onPress={handleFAQ} className="py-4 border-b border-white/20">
                    <Text className="text-lg text-white">📖 Frequently Asked Questions</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleEmail} className="py-4 border-b border-white/20">
                    <Text className="text-lg text-white">📩 Email Support</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handlePhone} className="py-4 border-b border-white/20">
                    <Text className="text-lg text-white">📞 Call Support</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default Support;
