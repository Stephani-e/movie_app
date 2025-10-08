import { Redirect, Slot } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useGlobalContext } from "@/lib/global-provider";

export default function AppLayout() {
    const { loading, isLogged } = useGlobalContext();

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <ActivityIndicator size="large" color="#00FFB9" />
            </View>
        );
    }

    // 🔐 Not logged in → send to sign-in
    if (!isLogged) {
        return <Redirect href="/sign-in" />;
    }

    // ✅ Logged in → load rest of routes (tabs, movies, etc.)
    return <Slot />;
}
