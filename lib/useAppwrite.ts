import {Alert} from "react-native";
import {useCallback, useEffect, useState} from "react";

// Simple in-memory cache object
const appwriteCache = new Map<string, any>();

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
    fn: (params: P) => Promise<T>;
    params?: P;
    skip?: boolean;
    cacheKey?: string; // optional: identify what data to cache
    cacheTime?: number;
}

interface UseAppwriteReturn<T, P> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (newParams?: P) => Promise<void>;
}

export const useAppwrite = <T, P extends Record<string, string | number>>({ fn, params = {} as P, skip = false, cacheKey, cacheTime = 5 * 60 * 1000, }: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!skip);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(
        async (fetchParams: P, force = false) => {
            // ✅ Check cache first
            if (cacheKey && !force) {
                const cached = appwriteCache.get(cacheKey);
                if (cached && Date.now() - cached.timestamp < cacheTime) {
                    setData(cached.data);
                    setLoading(false);
                    return;
                }
            }
            setLoading(true);
            setError(null);

            try {
                const result = await fn(fetchParams);
                setData(result ?? null);

                // ✅ Save to cache
                if (cacheKey) {
                    appwriteCache.set(cacheKey, {
                        data: result ?? null,
                        timestamp: Date.now(),
                    });
                }
            } catch (err: unknown) {
                const errorMessage =
                    err instanceof Error ? err.message : "An unknown error occurred";
                setError(errorMessage);
                setData(null);
                Alert.alert("Error", errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [fn, cacheKey, cacheTime]
    );

    useEffect(() => {
        if (!skip) {
            fetchData(params);
        }
    }, []);

    const refetch = async (newParams?: P) => await fetchData(newParams ?? params, true);

    return { data, loading, error, refetch };
};