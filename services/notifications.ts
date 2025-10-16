import {Databases, ID, Permission, Query, Role} from "react-native-appwrite";
import {client} from "@/lib/appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const NOTIFICATIONS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_NOTIFICATION_COLLECTION_ID!;

const databases = new Databases(client);

// Add notification
export const addNotification = async (
    userId: string,
    message: string,
    category: "watchlist" | "note" | "collections" | "collection_items" | "favorites" | "history" | "search" | "profile" | "login" | "logout",
    severity: "success" | "error" | "info" = "info",
    linkTo: string = ""
) => {
    try {
        const res = await databases.createDocument(
            DATABASE_ID,
            NOTIFICATIONS_COLLECTION_ID,
            ID.unique(),
            {
                userId,
                message,
                type: category,
                severity,
                linkTo,
                read: false,
            },
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        );
        return res;
    } catch (err) {
        console.error("Failed to add notification:", err);
        throw err;
    }
};

// Get all notifications for a user
export const getNotifications = async (userId: string) => {
    try {
        const res = await databases.listDocuments(
            DATABASE_ID,
            NOTIFICATIONS_COLLECTION_ID,
            [
                Query.equal("userId", userId),
                Query.orderDesc("$createdAt"),
            ]
        );
        return res.documents;
    } catch (err) {
        console.error("Failed to fetch notifications:", err);
        throw err;
    }
};

// Mark a notification as read
export const markAsRead = async (docId: string) => {
    try {
        return await databases.updateDocument(
            DATABASE_ID,
            NOTIFICATIONS_COLLECTION_ID,
            docId,
            { read: true }
        );
    } catch (err) {
        console.error("Failed to mark as read:", err);
        throw err;
    }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (userId: string) => {
    try {
        // 1. Get all unread notifications
        const res = await databases.listDocuments(
            DATABASE_ID,
            NOTIFICATIONS_COLLECTION_ID,
            [
                Query.equal("userId", userId),
                Query.equal("read", false)
            ]
        );

        // 2. Update each doc by its $id
        const updates = res.documents.map((doc) =>
            databases.updateDocument(
                DATABASE_ID,
                NOTIFICATIONS_COLLECTION_ID,
                doc.$id, // always use $id, not userId
                { read: true }
            )
        );

        // 3. Run all updates in parallel
        await Promise.all(updates);

        return true;
    } catch (err) {
        console.error("Failed to mark as read:", err);
        throw err;
    }
};

// Delete a notification
export const deleteNotification = async (docId: string) => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            NOTIFICATIONS_COLLECTION_ID,
            docId
        );
    } catch (err) {
        console.error("Failed to delete notification:", err);
        throw err;
    }
};
