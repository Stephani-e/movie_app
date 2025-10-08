import {Databases, ID, Permission, Query, Role} from "react-native-appwrite";
import {client} from "@/lib/appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const FAVORITES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID!;

const databases = new Databases(client);
console.log("DB:", DATABASE_ID, "Favorites:", FAVORITES_COLLECTION_ID);


// Add to favorites
export const addFavorite = async (userId: string, movie: any) => {
    // Check if it already exists
    const existing = await databases.listDocuments(
        DATABASE_ID,
        FAVORITES_COLLECTION_ID,
        [
            Query.equal("userId", userId),
            Query.equal("movieId", movie.id.toString()),
        ]
    );

    if (existing.documents.length > 0) {
        // Already in favorites → just return it
        return existing.documents[0];
    }

    // Otherwise create new
    return databases.createDocument(
        DATABASE_ID,
        FAVORITES_COLLECTION_ID,
        ID.unique(),
        {
            userId,
            movieId: movie.id.toString(),
            title: movie.title,
            posterPath: movie.poster_path,
        },
        [
            Permission.read(Role.user(userId)),
            Permission.write(Role.user(userId)),
        ]
    );
};

// Remove from favorites
export const removeFavorite = async (userId: string, movieId: string) => {
    const res = await databases.listDocuments(
        DATABASE_ID,
        FAVORITES_COLLECTION_ID,
        [
            Query.equal("userId", userId),
            Query.equal("movieId", movieId),
        ]
    );

    if (res.documents.length > 0) {
        await databases.deleteDocument(
            DATABASE_ID,
            FAVORITES_COLLECTION_ID,
            res.documents[0].$id
        );
    }
};

// Check if a movie is in favorites
export const isFavorite = async (userId: string, movieId: string) => {
    const res = await databases.listDocuments(
        DATABASE_ID,
        FAVORITES_COLLECTION_ID,
        [
            Query.equal("userId", userId),
            Query.equal("movieId", movieId),
        ]
    );
    return res.documents.length > 0;
};

// Get all favorites for a user
export const getFavorites = async (userId: string) => {
    const res = await databases.listDocuments(
        DATABASE_ID,
        FAVORITES_COLLECTION_ID,
        [Query.equal("userId", userId)]
    );
    return res.documents;
};
