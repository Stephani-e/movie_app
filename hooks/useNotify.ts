import {useToast} from "react-native-toast-notifications";
import {addNotification} from "@/services/notifications";
import {useGlobalContext} from "@/lib/global-provider";

export function useNotify() {
    const toast = useToast();
    const { user } = useGlobalContext();

    const notify = async (
        toastMessage: string,
        message: string,
        category:
            "watchlist"
            | "note"
            | "collections"
            | "collection_items"
            | "favorites"
            | "history"
            | "search"
            | "profile"
            | "login"
            | "logout",
        severity:
            "success"
            | "error"
            | "info" = "info"
    ) => {
        // 1. Show toast immediately
        toast.show(
            toastMessage, {
            type: severity,
            duration: 3000,
            animationType: "slide-in",
        });

        // 2. Save to Appwrite notifications table
        if (user) {
            try {
                await addNotification(user.$id, message, category, severity);
            } catch (err) {
                console.error("Failed to save notification:", err);
            }
        }
    };

    return notify;
}
