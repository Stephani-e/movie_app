import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import {router} from "expo-router";
import {images} from "@/constants/images";
import {client, getCurrentUser, logout} from "@/lib/appwrite";
import {useGlobalContext} from "@/lib/global-provider";
import {getNotifications} from "@/services/notifications";
import {RealtimeResponseEvent} from "react-native-appwrite";
import {Ionicons} from '@expo/vector-icons';
import {useNotify} from "@/hooks/useNotify";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const NOTIFICATIONS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_NOTIFICATION_COLLECTION_ID!;

const Profile = () => {
    const { user, refetch, loading } = useGlobalContext();
    const [ unreadCount, setUnreadCount ] = useState(0);
    const notify = useNotify();

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <ActivityIndicator size="large" color="#00FFB9" />
                <Text className="text-white mt-4 text-base">Loading profile...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <Text className="text-white">No user found. Please log in again.</Text>
            </View>
        );
    }

    const handleLogout = async () => {
        const result = await logout();
        if (result) {
            Alert.alert("Logout Successful", "You are now logged out");
            refetch();
            notify(
                `Logout Successful`,               // toastMessage
                `${user?.name} logged out successfully`, // dbMessage
                "logout",
                "success"
            );
        } else {
            Alert.alert("Logout Failed", "Please try again later");
            notify(
                `Logout Failed`,               // toastMessage
                `${user?.name} logged out failed`, // dbMessage
                "logout",
                "error"
            );
        }
    }
    const confirmLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", style: "destructive", onPress: handleLogout }
            ]
        );
    };

    const loadUnreadCount = async () => {
        if (!user) return;
        try {
            const notifs = await getNotifications(user.$id);
            const unread = notifs.filter((n: any) => !n.read).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    useEffect(() => {
        if (!user) return;
        loadUnreadCount();

        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${NOTIFICATIONS_COLLECTION_ID}.documents`,
            (event: RealtimeResponseEvent<any>) => {
                const payload = event.payload;
                if (payload.userId !== user.$id) return;

                if (
                    event.events.some(
                        (e) =>
                            e.includes("create") || e.includes("update") || e.includes("delete")
                    )
                ) {
                    loadUnreadCount();
                }
            }
        );

        return () => unsubscribe();
    }, [user]);

    return (
        <View className="flex-1 bg-primary">
            {/* Background */}
            <Image
                source={images.bg}
                className="flex-1 absolute w-full h-full z-0"
                resizeMode="cover"
            />

            {/* Header */}
            <View className="items-center mt-16">
                <Image
                    source={{ uri: user?.avatar }}
                    className="w-28 h-28 rounded-full border-4 border-primary-300"
                />
                <Text className="text-2xl font-rubik-bold mt-4 text-white">
                    {user?.name}
                </Text>
                <Text className="text-sm text-gray-300 mt-1">
                    {user?.email}
                </Text>
            </View>

            {/* Quick Actions */}
            <View className="flex-row justify-around mt-12 px-6">
                <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => router.push("/profile/favorites")}
                >
                    <Ionicons
                        name="star-sharp"
                        size={20}
                        color="#fff"
                        style={{ marginRight: 5 }}
                    />
                    <Text className="text-lg font-rubik text-white">Favorites</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => router.push("/profile/watchlist")}
                >
                    <Ionicons
                        name="list-outline"
                        size={18}
                        color="#fff"
                        style={{ marginRight: 5 }}
                    />
                    <Text className="text-lg font-rubik text-white">Watchlist</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => router.push("/profile/history")}
                >
                    <Ionicons
                        name="reader"
                        size={20}
                        color="#fff"
                        style={{ marginRight: 5 }}
                    />
                    <Text className="text-lg font-rubik text-white">History</Text>
                </TouchableOpacity>
            </View>

            {/* Settings & Logout */}
            <View className="mt-14 px-6">
                <TouchableOpacity
                    onPress={() => router.push("/profile/edit")}
                    className="py-4 border-b border-white/20"
                >
                    <Text className="text-lg text-white">Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="py-4 border-b border-white/20 flex-row items-center justify-between"
                    onPress={() => router.push("/profile/notifications")}
                >
                    <View
                        className="flex-row items-center gap-1"
                    >
                        <Text className="text-lg text-white">Notifications</Text>
                        <Ionicons
                            name="notifications-circle"
                            color="white"
                        />
                    </View>
                    {unreadCount > 0 && (
                        <View className="bg-red-500 rounded-full min-w-[20px] px-2 py-0.5 items-center justify-center">
                            <Text className="text-white text-xs font-bold">{unreadCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    className="py-4 border-b border-white/20"
                    onPress={() => router.push("/profile/settings")}
                >
                    <Text className="text-lg text-white">App Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="py-4 mt-6 bg-red-600 rounded-lg"
                    onPress={confirmLogout}
                >
                    <Text className="text-center text-white font-bold">Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Profile;
