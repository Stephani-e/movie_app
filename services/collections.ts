import {Databases, ID, Permission, Query, Role} from "react-native-appwrite";
import {client} from "@/lib/appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTIONS_COLLECTION_ID =
    process.env.EXPO_PUBLIC_APPWRITE_COLLECTIONS_ID!;
const COLLECTIONS_ITEMS_COLLECTION_ID =
    process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ITEMS_ID!;

const databases = new Databases(client);

/** Get all collections for a user */
export const getUserCollections = async (userId: string) => {
    const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS_COLLECTION_ID, [
        Query.equal("userId", userId),
    ]);
    return res.documents;
};

/** Create a new collection (folder) */
export const createCollection = async (
    userId: string,
    name: string,
    description = ""
) => {
    const res = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS_COLLECTION_ID,
        ID.unique(),
        {
            userId,
            name,
            description,
        },
        [
            Permission.read(Role.user(userId)),
            Permission.write(Role.user(userId)),
            Permission.update(Role.user(userId)),
            Permission.delete(Role.user(userId))
        ]
    );
    return res;
};

/** Delete a collection by id */
export const deleteCollection = async (collectionId: string) => {
    await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS_COLLECTION_ID, // the collection table ID
        collectionId
    );
    return true;
};

/** Get a single collection by ID */
export const getUserCollectionById = async (collectionId: string) => {
    try {
        const res = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS_COLLECTION_ID,
            collectionId
        );
        return res;
    } catch (error) {
        console.error("Error fetching collection:", error);
        return null;
    }
};


/** Add a movie to a collection (relies on unique index for duplicates) */
export const addMovieToCollection = async (
    collectionId: string,
    movie: any,
    userId: string
) => {
    try {
        const res = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS_ITEMS_COLLECTION_ID,
            ID.unique(),
            {
                collectionId,
                movieId: movie.id.toString(),
                title: movie.title,
                posterPath: movie.poster_path ?? null,
                createdAt: new Date().toISOString(),
            },
            [
                Permission.read(Role.user(userId)),
                Permission.write(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        );

        return res;
    } catch (err: any) {
        if (err.code === 409) {
            // duplicate because of unique index
            console.warn("Movie already exists in this collection");
            return null;
        }
        console.error("Error adding movie:", err);
        throw err;
    }
};


/** Remove a movie from a collection */
export const removeMovieFromCollection = async (collectionId: string, movieId: string) => {
    const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS_ITEMS_COLLECTION_ID,
        [
            Query.equal("collectionId", collectionId),
            Query.equal("movieId", movieId),
        ]
    );

    if (res.documents.length > 0) {
        await databases.deleteDocument(
            DATABASE_ID,
            COLLECTIONS_ITEMS_COLLECTION_ID,
            res.documents[0].$id
        );
        return true;
    }

    return false;
};

/** Get all items in a collection */
export const getCollectionItems = async (collectionId: string) => {
    const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS_ITEMS_COLLECTION_ID,
        [Query.equal("collectionId", collectionId)]
    );
    return res.documents;
};

// Check if a movie is in saved
export const isMovieInAnyCollection = async (userId: string, movieId: string) => {
    try {
        const userCollections = await getUserCollections(userId);
        if (userCollections.length === 0) return false;

        const collectionsIds = userCollections.map((collection: any) => collection.$id);

        const res = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS_ITEMS_COLLECTION_ID,
            [
                Query.equal("movieId", movieId.toString()),
                Query.contains("collectionId", collectionsIds),
            ]
        );

        return res.documents.length > 0;
    } catch (err) {
        console.error("Error checking movie in collection:", err);
        return false;
    }
};
