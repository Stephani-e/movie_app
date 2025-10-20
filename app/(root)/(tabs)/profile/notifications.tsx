import {useEffect, useState} from "react";
import {ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";

import {useGlobalContext} from "@/lib/global-provider";
import {deleteNotification, getNotifications, markAllNotificationsRead, markAsRead,} from "@/services/notifications";
import {green} from "react-native-reanimated/lib/typescript/Colors";

const NotificationPage = () => {
    const { user } = useGlobalContext();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) loadNotifications();
    }, [user]);

    const loadNotifications = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const data = await getNotifications(user.$id);

            const ids = data.map(n => n.$id);
            const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
            if (duplicates.length) {
                console.warn("⚠️ Duplicate notification IDs found:", duplicates);
            }

            setNotifications(data);
        } catch (err) {
            console.error("Failed to load notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notif: any) => {
        try {
            await markAsRead(notif.$id);
            loadNotifications();
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const handleMarkAll = async () => {
        if (!user) return;
        await markAllNotificationsRead(user.$id);
        loadNotifications();
    };

    const handleDelete = async (notif: any) => {
        Alert.alert(
            "Delete Notification",
            "Are you sure you want to delete this notification?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteNotification(notif.$id);
                            loadNotifications();
                        } catch (err) {
                            console.error("Failed to delete notification:", err);
                        }
                    },
                },
            ]
        );
    };

    const handleClearAll = () => {
        Alert.alert(
            "Clear All Notifications",
            "Are you sure you want to delete all notifications?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear All",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await Promise.all(
                                notifications.map((notif) => deleteNotification(notif.$id))
                            );
                            setNotifications([]);
                        } catch (err) {
                            console.error("Failed to clear notifications:", err);
                            Alert.alert("Error", "Failed to clear notifications. Try again.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <View className="flex-1 bg-primary px-5 pt-12">
            <View className="flex-row justify-between items-center mb-4 mt-24">
                <TouchableOpacity onPress={handleMarkAll}>
                    <Text className="text-blue-400 text-sm">Mark all as read</Text>
                </TouchableOpacity>

                {notifications.length > 0 && (
                    <TouchableOpacity
                        onPress={handleClearAll}
                        className="bg-red-500 px-3 py-2 rounded-lg"
                    >
                        <Text className="text-white font-semibold text-xs">Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : notifications.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-400 text-lg">No notifications yet</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.$id}
                    renderItem={({ item }) => {
                        //console.log("Notification item:", item);
                        return (
                            <View
                                className={`flex-row justify-between items-center px-4 py-3 rounded-lg mb-2 ${
                                    item.read ? "bg-white/10" : "bg-white/20"
                                }`}
                            >
                                <View className="flex-1 mr-3">
                                    <Text
                                        style={{
                                            fontWeight: 500,
                                            color:
                                                item.severity === "success" ? "green"
                                                    : item.severity === "error" ? "red"
                                                            : "blue",
                                        }}
                                    >
                                        {item.message}
                                    </Text>
                                    <Text className="text-gray-500 text-xs mt-1">
                                        {new Date(item.$createdAt).toLocaleString()}
                                    </Text>
                                </View>

                                {/* Actions */}
                                <View className="flex-row items-center space-x-3">
                                    {!item.read && (
                                        <TouchableOpacity onPress={() => handleMarkAsRead(item)}>
                                            <Ionicons name="checkmark-done" size={18} color="lime" />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={() => handleDelete(item)}>
                                        <Ionicons name="trash" size={18} color="red" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
};

export default NotificationPage;
