import {Stack} from "expo-router";
import {Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";

export default function ProfileLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // hide default headers by default
                contentStyle: {
                    backgroundColor: "#0F0D23", // fallback background
                },
            }}
        >
            {/* Profile main page (shows tab bar like others) */}
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />

            {/* Edit Profile page (push navigation, back button, no tab bar) */}
            <Stack.Screen
                name="edit"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: "",
                    headerRight: () => (
                        <Text style={{ color: "#fff", fontSize:18, fontWeight:"700" }}>
                            <Ionicons name="person-add" size={16} color="white" /> Edit Profile
                        </Text>
                    ),
                    headerTintColor: "#fff", // back button color

                }}
            />

            {/* Settings */}
            <Stack.Screen
                name="settings"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: "",
                    headerRight: () => (
                        <Text style={{ color: "#fff", fontSize:18, fontWeight:"700" }}>
                            <Ionicons name="settings" size={16} color="white" /> Edit Settings
                        </Text>
                    ),
                    headerTintColor: "#fff", // back button color

                }}
            />

            {/* Favorites */}
            <Stack.Screen
                name="favorites"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: "",
                    headerRight: () => (
                        <Text style={{ color: "#fff", fontSize:18, fontWeight:"700" }}>
                            <Ionicons name="heart-circle-sharp" size={16} color="white" /> Your Favorites
                        </Text>
                    ),
                    headerTintColor: "#fff", // back button color

                }}
            />

            {/* Watchlist */}
            <Stack.Screen
                name="watchlist"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: "",
                    headerRight: () => (
                        <Text style={{ color: "#fff", fontSize:18, fontWeight:"700" }}>
                            <Ionicons name="list-circle" size={16} color="white" /> Create Your Watchlist
                        </Text>
                    ),
                    headerTintColor: "#fff", // back button color

                }}
            />

            {/* History */}
            <Stack.Screen
                name="history"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: "",
                    headerRight: () => (
                        <Text style={{ color: "#fff", fontSize:18, fontWeight:"700" }}>
                            <Ionicons name="time-outline" size={16} color="white" /> Your Search History
                        </Text>
                    ),
                    headerTintColor: "#fff", // back button color

                }}
            />

            {/* Notification */}
            <Stack.Screen
                name="notifications"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: "",
                    headerRight: () => (
                        <Text style={{ color: "#fff", fontSize:18, fontWeight:"700" }}>
                            <Ionicons name="notifications-circle"  size={16} color="white" /> Your Notifications
                        </Text>
                    ),
                    headerTintColor: "#fff", // back button color

                }}
            />
        </Stack>
    );
}
