import { Stack } from "expo-router";
import { Text, View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function ProfileLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: "#0F0D23",
                },
            }}
        >
            {/* Profile main page (part of Tabs layout, no extra padding) */}
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />

            {/* All other pages */}
            {[
                ["edit", "person-add", "Edit Profile"],
                ["settings", "settings", "Edit Settings"],
                ["favorites", "heart-circle-sharp", "Your Favorites"],
                ["watchlist", "list-circle", "Create Your Watchlist"],
                ["history", "time-outline", "Your Search History"],
                ["notifications", "notifications-circle", "Your Notifications"],
            ].map(([name, icon, label]) => (
                <Stack.Screen
                    key={name}
                    name={name as string}
                    options={{
                        headerShown: true,
                        headerTransparent: true,
                        headerTitle: "",
                        headerRight: () => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginRight: 10,
                                    marginTop: Platform.OS === "ios" ? 2 : 0, // light adjustment for iOS
                                }}
                            >
                                <Ionicons name={icon as any} size={18} color="white" />
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: 18,
                                        fontWeight: "700",
                                        marginLeft: 5,
                                    }}
                                >
                                    {label}
                                </Text>
                            </View>
                        ),
                        headerTintColor: "#fff",
                    }}
                />
            ))}
        </Stack>
    );
}
