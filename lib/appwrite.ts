import {Account, Avatars, Client, Databases, OAuthProvider} from "react-native-appwrite";
//import * as Linking from 'expo-linking';
import * as AuthSession from "expo-auth-session";
import {openAuthSessionAsync} from "expo-web-browser";

export const config = {
    platform: 'com.jsm.movieapp',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    collectionsTableId: process.env.EXPO_PUBLIC_APPWRITE_COLLECTIONS_ID!,
}

export const client = new Client()

client
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setPlatform(config.platform!)

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);


export async function login() {
    try {
        const redirectUri = AuthSession.makeRedirectUri({scheme: "movies"});
        //console.log("👉 Redirect URI being used:", redirectUri);

        const response = await account.createOAuth2Token(
            OAuthProvider.Google,
            redirectUri
        );

        if (!response) throw new Error('Login failed');

        const browserResult = await openAuthSessionAsync(
            response.toString(),
            redirectUri
        );
        if (browserResult.type !== 'success') throw new Error('Login failed');

        const url = new URL(browserResult.url);

        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        if (!secret || !userId) throw new Error('No failed');

        const session = await account.createSession(userId, secret);

        if (!session) throw new Error('Session failed');
        // Fetch current user details
        const currentUser = await account.get();

        // Add avatar URL for convenience
        const userAvatar = `${config.endpoint}/avatars/initials?name=${encodeURIComponent(currentUser.name)}`;

        const user = {
            ...currentUser,
            avatar: userAvatar,
        };

        // Return the full user object instead of just `true`
        return user;
    } catch (err) {
        console.log("❌ Login error:", err);
        return false;
    }
}


export async function logout() {
    try {
        await account.deleteSession('current');
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function getCurrentUser() {
    try {
        const response = await account.get();
        if (response.$id) {
            const userAvatar = `${config.endpoint}/avatars/initials?name=${encodeURIComponent(response.name)}`;

            return {
                ...response,
                avatar: userAvatar,
            }
        }
    } catch (error: any) {
        // Only log clean info for debugging
        if (error?.message?.includes("missing scopes")) {
            console.log("⚠️ No user session found — guest mode");
        } else {
            console.log("❌ Unexpected error in getCurrentUser:", error.message);
        }
        return null;
    }
}