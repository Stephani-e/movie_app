import React from "react";
import { Modal, View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface VideoModalProps {
    visible: boolean;
    onClose: () => void;
    videos?: any[];
    externalLinks?: {
        homepage?: string | null;
        imdb_id?: string | null;
    };
}

const ViewVideoModal: React.FC<VideoModalProps> = ({ visible, onClose, videos, externalLinks }) => {
    // Get the trailer/teaser links from TMDB video data
    const trailer = videos?.find((v) => v.type === "Trailer" && v.site === "YouTube");
    const teaser = videos?.find((v) => v.type === "Teaser" && v.site === "YouTube");

    const homepage = externalLinks?.homepage;
    const imdb = externalLinks?.imdb_id
        ? `https://www.imdb.com/title/${externalLinks.imdb_id}`
        : null;

    const openLink = async (url: string | null) => {
        if (!url) return;
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) Linking.openURL(url);
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/80 justify-center items-center px-6">
                <View className="bg-dark-200 w-full rounded-2xl p-6">
                    <Text className="text-white text-lg font-bold mb-4 text-center">
                        Watch Options
                    </Text>

                    {/* Trailer */}
                    <TouchableOpacity
                        className={`flex-row items-center justify-center py-3 mb-3 rounded-lg ${
                            trailer ? "bg-green-600" : "bg-dark-100 opacity-50"
                        }`}
                        disabled={!trailer}
                        onPress={() =>
                            openLink(trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null)
                        }
                    >
                        <Ionicons name="play-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text className="text-white font-semibold">
                            {trailer ? "Watch Trailer" : "Trailer Not Available"}
                        </Text>
                    </TouchableOpacity>

                    {/* Teaser */}
                    <TouchableOpacity
                        className={`flex-row items-center justify-center py-3 mb-3 rounded-lg ${
                            teaser ? "bg-green-600" : "bg-dark-100 opacity-50"
                        }`}
                        disabled={!teaser}
                        onPress={() =>
                            openLink(teaser ? `https://www.youtube.com/watch?v=${teaser.key}` : null)
                        }
                    >
                        <Ionicons name="videocam" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text className="text-white font-semibold">
                            {teaser ? "Watch Teaser" : "Teaser Not Available"}
                        </Text>
                    </TouchableOpacity>

                    {/* Official Website */}
                    <TouchableOpacity
                        className={`flex-row items-center justify-center py-3 mb-3 rounded-lg ${
                            homepage ? "bg-green-600" : "bg-dark-100 opacity-50"
                        }`}
                        disabled={!homepage}
                        onPress={() => openLink(homepage ?? null)}
                    >
                        <Ionicons name="globe-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text className="text-white font-semibold">
                            {homepage ? "Visit Official Website" : "Website Not Available"}
                        </Text>
                    </TouchableOpacity>

                    {/* IMDb Link */}
                    <TouchableOpacity
                        className={`flex-row items-center justify-center py-3 mb-3 rounded-lg ${
                            imdb ? "bg-green-600" : "bg-dark-100 opacity-50"
                        }`}
                        disabled={!imdb}
                        onPress={() => openLink(imdb ?? null)}
                    >
                        <Ionicons name="film-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text className="text-white font-semibold">
                            {imdb ? "View on IMDb" : "IMDb Link Not Available"}
                        </Text>
                    </TouchableOpacity>

                    {/* Close Button */}
                    <TouchableOpacity
                        className="mt-4 py-3 bg-red-500 rounded-lg flex-row items-center justify-center"
                        onPress={onClose}
                    >
                        <Ionicons name="close" size={20} color="#fff" style={{ marginRight: 6 }} />
                        <Text className="text-white font-semibold">Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ViewVideoModal;
