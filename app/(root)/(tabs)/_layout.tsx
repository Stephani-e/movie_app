import {useEffect, useState} from "react";
import {Tabs} from "expo-router";
import {Image, Text, View} from "react-native";
import {BlurView} from "expo-blur";
import {useGlobalContext} from "@/lib/global-provider";
import {getNotifications} from "@/services/notifications";
import {client} from "@/lib/appwrite";
import {RealtimeResponseEvent} from "react-native-appwrite";
import {icons} from "@/constants/icons";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const NOTIFICATIONS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_NOTIFICATION_COLLECTION_ID!;

function TabIcon({ focused, icon, title, badge = 0 }: any) {
    return (
        <View className="items-center justify-center relative">
            {focused ? (
                <View className="flex-row items-center px-3 py-2 rounded-full bg-white/20 ">
                    <Image source={icon} className="w-5 h-5" tintColor="#fff" />
                    {badge > 0 && (
                        <View className="ml-2 bg-red-500 rounded-full min-w-[16px] px-1.5 py-0.5 items-center justify-center">
                            <Text className="text-white text-[10px] font-bold">{badge}</Text>
                        </View>
                    )}
                </View>
            ) : (
                <>
                    <Image source={icon} className="w-5 h-5" tintColor="#bbb" />
                    {badge > 0 && (
                        <View className="absolute -top-1 -right-3 bg-red-500 rounded-full min-w-[16px] px-1.5 py-0.5 items-center justify-center">
                            <Text className="text-white text-[10px] font-bold">{badge}</Text>
                        </View>
                    )}
                </>
            )}
        </View>
    );
}

export default function TabsLayout() {
    const { user } = useGlobalContext();
    const [unreadCount, setUnreadCount] = useState(0);

    const loadUnreadCount = async () => {
        if (!user) return;
        try {
            const notifs = await getNotifications(user.$id);
            setUnreadCount(notifs.filter((n: any) => !n.read).length);
        } catch (err) {
            console.error("Failed to fetch unread count:", err);
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
                        (e) => e.includes("create") || e.includes("update") || e.includes("delete")
                    )
                ) {
                    loadUnreadCount();
                }
            }
        );

        return () => unsubscribe();
    }, [user]);

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        position: "absolute",
                        bottom: 10,
                        left: 20,
                        right: 20,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: "transparent",
                        elevation: 0,
                    },
                    tabBarBackground: () => (
                        <BlurView
                            intensity={50}
                            tint="dark"
                            style={{
                                flex: 1,
                                borderRadius: 32,
                                overflow: "hidden",
                            }}
                        />
                    ),
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={icons.home} title="Home" />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="search"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={icons.search} title="Search" />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="saved"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={icons.save} title="Save" />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabIcon
                                focused={focused}
                                icon={icons.person}
                                title="Profile"
                                badge={unreadCount}
                            />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}
