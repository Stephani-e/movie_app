import {Databases, ID, Permission, Query, Role} from "react-native-appwrite";
import {client} from "@/lib/appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const WATCHLIST_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_WATCHLIST_COLLECTION_ID!;

const databases = new Databases(client);
console.log("DB:", DATABASE_ID, "Favorites:", WATCHLIST_COLLECTION_ID);

// Add a movie to the watchlist
export const addToWatchlist = async (userId: string, movie: any, notes: string = "") => {
    // 1. Check if already exists
    const existing = await databases.listDocuments(
        DATABASE_ID,
        WATCHLIST_COLLECTION_ID,
        [
            Query.equal("userId", userId),
            Query.equal("movieId", movie.id?.toString()),
        ]
    );

    if (existing.documents.length > 0) {
        return existing.documents[0]; // already in watchlist
    }

    // 2. Otherwise add new
    return await databases.createDocument(
        DATABASE_ID,
        WATCHLIST_COLLECTION_ID,
        ID.unique(),
        {
            userId,
            movieId: movie.id?.toString(),
            title: movie.title,
            posterPath: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` // ✅ full URL
                : "",
            notes,
        },
        [
            Permission.read(Role.user(userId)),   // only this user can read
            Permission.write(Role.user(userId)),  // only this user can edit/delete
        ]
    );
};

// Get all watchlist items for a user
export const getWatchlist = async (userId: string) => {
    const res = await databases.listDocuments(
        DATABASE_ID,
        WATCHLIST_COLLECTION_ID,
        [
            Query.equal("userId", userId),
            Query.orderDesc("$createdAt"),
        ]
    );
    return res.documents;
};

// Update watchlist item (e.g., add/edit notes)
export const updateWatchlistItem = async (docId: string, updates: any) => {
    try {
        const response = await databases.updateDocument(
            DATABASE_ID,
            WATCHLIST_COLLECTION_ID,
            docId,
            updates
        );
        return response;
    } catch (err) {
        console.error("Failed to update watchlist:", err);
        throw err;
    }
};

// Remove from watchlist
export const removeFromWatchlist = async (userId: string, movieId: string) => {
    const res = await databases.listDocuments(
        DATABASE_ID,
        WATCHLIST_COLLECTION_ID,
        [
            Query.equal("userId", userId),
            Query.equal("movieId", movieId),
        ]
    );

    if (res.documents.length > 0) {
        await databases.deleteDocument(
            DATABASE_ID,
            WATCHLIST_COLLECTION_ID,
            res.documents[0].$id
        );
    }
};

