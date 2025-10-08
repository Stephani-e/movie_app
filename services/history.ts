import {Databases, ID, Permission, Query, Role} from "react-native-appwrite";
import {client} from "@/lib/appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const HISTORY_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_HISTORY_COLLECTION_ID!;
const databases = new Databases(client);

// Add or update the search history
export const addHistoryEntry = async (userId: string, query: string, movie: any) => {
    return databases.createDocument(
        DATABASE_ID,
        HISTORY_COLLECTION_ID,
        ID.unique(),
        {
            userId,
            searchTerm: query,
            movieId: movie.id,
            title: movie.title,
            posterPath: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null,
            action: "history",
        },
        [
            Permission.read(Role.user(userId)),
            Permission.write(Role.user(userId)),
        ]
    );
};

// Get all history for a user
export const getSearchHistory = async (userId: string) => {
    const res = await databases.listDocuments(DATABASE_ID, HISTORY_COLLECTION_ID, [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
    ]);
    return res.documents; // no need to type everything
};

// Delete a history item
export const deleteHistoryItem = async (id: string) => {
    await databases.deleteDocument(DATABASE_ID, HISTORY_COLLECTION_ID, id);
};

// Clear all history for user.
export const clearHistory = async (userId: string) => {
    const items = await getSearchHistory(userId);
    await Promise.all(items.map((item) => deleteHistoryItem(item.$id)));
};
