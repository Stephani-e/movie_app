import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {getCurrentUser} from "./appwrite";
import {useAppwrite} from "./useAppwrite";
import {ActivityIndicator, View, Text} from "react-native";

interface GlobalContextType {
    isLogged: boolean;
    user: User | null;
    loading: boolean;
    refetch: () => void;
    collectionsUpdate: Record<string, number>;
    updateCollectionCount: (collectionId: string, delta: number) => void;
}

interface User {
    $id: string;
    name: string;
    email: string;
    avatar: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const {
        data: user,
        loading,
        refetch,
    } = useAppwrite({
        fn: getCurrentUser,
    });

    const isLogged = !!user;
    const [collectionsUpdate, setCollectionsUpdate] = useState<Record<string, number>>({});

    const updateCollectionCount = (collectionId: string, delta: number) => {
        setCollectionsUpdate((prev) => ({
            ...prev,
            [collectionId]: (prev[collectionId] || 0) + delta,
        }))
    }

    useEffect(() => {
        console.log("🔎 GlobalProvider user:", JSON.stringify(user, null, 2));
    }, [user]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <ActivityIndicator size="large" color="#00FFB9" />
                <Text className="text-white mt-4 text-base">Loading app...</Text>
            </View>
        );
    }

    const normalizedUser: User | null = user ?? null;

    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                user: normalizedUser,
                loading,
                refetch,
                collectionsUpdate,
                updateCollectionCount,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);
    if (!context)
        throw new Error("useGlobalContext must be used within a GlobalProvider");

    return context;
};

export default GlobalProvider;
