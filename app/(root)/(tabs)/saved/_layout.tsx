import {Stack} from "expo-router";

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
            {/* Saved main page (shows tab bar like others) */}
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />

            {/* Collection Details Page */}
            <Stack.Screen
                name="[collectionsId]"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: "",
                    headerTintColor: "#fff", // back button color

                }}
            />
        </Stack>
    );
}
