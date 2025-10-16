import React, {useEffect, useState} from "react";
import {ActivityIndicator, Alert, SectionList, Text, TouchableOpacity, View} from "react-native";
import {useRouter} from "expo-router";
import {clearHistory, deleteHistoryItem, getSearchHistory} from "@/services/history";
import {useGlobalContext} from "@/lib/global-provider";
import dayjs from "dayjs";
import {Ionicons} from "@expo/vector-icons";
import {useNotify} from "@/hooks/useNotify";

const groupHistoryByDate = (history: any[]) => {
    const grouped: Record<string, any[]> = {};

    history.forEach(item => {
        const dateKey = dayjs(item.$createdAt).format("MMM D, YYYY"); // e.g. "Sep 29, 2025"
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(item);
    });

    // Convert to an array of sections
    return Object.keys(grouped).map(date => ({
        title: date,
        data: grouped[date],
    }));
};


const HistoryPage = () => {
    const router = useRouter();
    const { user } = useGlobalContext();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const notify = useNotify();

    // fetch user history
    const fetchHistory = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getSearchHistory(user.$id);
            setHistory(data);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const sections = groupHistoryByDate(history);

    // Clear all history
    const handleClearAll = () => {
        if (!user) return;

        Alert.alert("Clear All History", "Are you sure you want to delete all history?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Clear All",
                style: "destructive",
                onPress: async () => {
                    try {
                        await clearHistory(user.$id);
                        setHistory([]);
                        notify(
                            "Cleared History",               // toastMessage
                            `Deleted All Movies in Your History`, // dbMessage
                            "history",
                            "success"
                        );
                    } catch (err) {
                        console.error("Failed to clear history:", err);
                        notify(
                            "Error Clearing History",               // toastMessage
                            `Error Deleting All Movies in Your History`, // dbMessage
                            "history",
                            "error"
                        );
                    }
                }
            }
        ]);
    };

    const handleDelete = (id: string, movieTitle: string) => {
        Alert.alert("Delete History", "Are you sure you want to delete this item?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteHistoryItem(id);
                        setHistory(prev => prev.filter(item => item.$id !== id));
                        notify(
                            "Deleted a Movie from History",               // toastMessage
                            `Deleted ${movieTitle} from Your History`, // dbMessage
                            "history",
                            "success"
                        );
                    } catch (err) {
                        console.error("Failed to delete history item:", err);
                        notify(
                            "Error Deleting Movie",               // toastMessage
                            `Error Deleting ${movieTitle} from History`, // dbMessage
                            "history",
                            "error"
                        );
                    }
                }
            }
        ]);
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (history.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-primary px-4">
                <Text className="text-white text-lg text-center">No search history yet.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-primary">
            <View className="flex-row justify-between items-center px-6 pt-4 pb-1 mt-24">
                <TouchableOpacity onPress={handleClearAll}>
                    <Text className="text-red-500 font-semibold">Clear All</Text>
                </TouchableOpacity>
            </View>

            <SectionList
                sections={sections}
                keyExtractor={(item, index) => `${item.$id}-${index}`}
                renderSectionHeader={({ section: { title } }) => (
                    <Text key={`header-${title}`} className="text-gray-400 text-sm px-4 pt-4 pb-3">
                        {title}
                    </Text>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/movies/${item.movieId}`)}
                        className="flex-row items-center mb-2 bg-secondary/20 rounded-lg px-3 py-2"
                    >
                        <Ionicons name="time-outline" size={18} color="white" className="mr-3" />
                        <View className="flex-1">
                            <Text className="text-white font-medium">{item.searchTerm}</Text>
                        </View>
                        {item.count && item.count > 1 && (
                            <View className="bg-gray-700 px-2 py-1 rounded-full ml-2">
                                <Text className="text-white text-xs">{item.count}x</Text>
                            </View>
                        )}
                        <TouchableOpacity onPress={() => handleDelete(item.$id, item.title)} className="ml-3">
                            <Ionicons name="trash-outline" size={20} color="red" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, paddingTop: 20 }}
            />

        </View>
    );
};

export default HistoryPage;
