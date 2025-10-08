import React, {useState} from "react";
import {Image, ScrollView, Switch, Text, TouchableOpacity, View} from "react-native";
import * as Application from "expo-application";
import {images} from "@/constants/images";
import {useRouter} from "expo-router";
import {Link} from "lucide-react-native";

const Settings = () => {
    const router = useRouter();
    const [darkMode, setDarkMode] = useState(true); // default: dark

    return (
        <View className="flex-1 bg-primary">
            {/* Background */}
            <Image
                source={images.bg}
                className="flex-1 absolute w-full h-full z-0"
                resizeMode="cover"
            />

            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 120 }}>

                {/* Dark Mode */}
                <View className="flex-row justify-between items-center py-4 border-b border-white/20">
                    <Text className="text-lg text-white">Dark Mode</Text>
                    <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        thumbColor={darkMode ? "#AB8BFF" : "#f4f3f4"}
                        trackColor={{ false: "#767577", true: "#5A3FFF" }}
                    />
                </View>

                {/* About Section */}
                <TouchableOpacity
                    onPress={() => router.push("/profile/settings/about")}
                    className="flex-row items-center gap-1 mt-8 mb-4 "
                >
                    <Text className="text-xl font-rubik-bold text-white leading-6">About</Text>
                    <Link size={12} color="#ffffff" />
                </TouchableOpacity>

                <View className="py-4 border-b border-white/20">
                    <Text className="text-lg text-white">App Version</Text>
                    <Text className="text-sm text-gray-300 mt-1">
                        {Application.nativeApplicationVersion || "1.0.0"}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => router.push("/profile/settings/support")}
                    className="py-4 border-b border-white/20"
                >
                    <Text className="text-lg text-white">Contact Support</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="py-4 border-b border-white/20"
                    onPress={() => router.push("/profile/settings/privacy")}
                >
                    <Text className="text-lg text-white">Privacy Policy</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default Settings;
