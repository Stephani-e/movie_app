import {useEffect, useState} from "react";
import {Tabs} from "expo-router";
import {Image, ImageSourcePropType, Text, View} from "react-native";
import {BlurView} from "expo-blur";
import {useGlobalContext} from "@/lib/global-provider";
import {getNotifications} from "@/services/notifications";
import {client} from "@/lib/appwrite";
import {RealtimeResponseEvent} from "react-native-appwrite";
import {icons} from "@/constants/icons";
import cn from "clsx";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const NOTIFICATIONS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_NOTIFICATION_COLLECTION_ID!;

interface TabBarIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
    badge?: number;
}

const TabBarIcon = ({ focused, icon, title, badge = 0 }: TabBarIconProps) => (
    <View className="flex min-w-20 items-center justify-center min-h-full gap-1 mt-5">
        {/* Icon and label */}
        <View className="relative items-center justify-center">
            <Image
                source={icon}
                className="size-5"
                resizeMode="contain"
                tintColor={focused ? "#FFFFFF" : "#5D5F6D"}
            />
            {badge > 0 && (
                <View
                    className={cn(
                        "absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[14px] px-[4px] py-[1px] items-center justify-center",
                        focused && "bg-red-600"
                    )}
                >
                    <Text className="text-white text-[9px] font-bold">{badge}</Text>
                </View>
            )}
        </View>

        <Text
            className={cn(
                "text-xs mt-1 font-semibold",
                focused ? "text-white" : "text-white/80"
            )}
        >
            {title}
        </Text>
    </View>
)

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
                        borderTopLeftRadius: 50,
                        borderTopRightRadius: 50,
                        borderBottomLeftRadius: 50,
                        borderBottomRightRadius: 50,
                        marginHorizontal: 20,
                        height: 50,
                        position: 'absolute',
                        bottom: 40,
                        backgroundColor: 'transparent',
                        shadowColor: '#1a1a1a',
                        shadowOffset: {
                            width: 0,
                            height: 10,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 5,
                    }
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabBarIcon focused={focused} icon={icons.home} title='Home' />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="search"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabBarIcon focused={focused} icon={icons.search} title='Search' />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="saved"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabBarIcon focused={focused} icon={icons.save} title='Save' />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabBarIcon
                                focused={focused}
                                icon={icons.person}
                                badge={unreadCount}
                                title='Profile'
                            />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}
