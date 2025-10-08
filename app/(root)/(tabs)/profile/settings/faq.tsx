import React, {useState} from "react";
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {ArrowLeft, ChevronDown, ChevronUp} from "lucide-react-native";
import {useRouter} from "expo-router";
import {images} from "@/constants/images";

const faqs = [
    {
        q: "How do I add movies to my favorites?",
        a: "Open a movie, then tap the ⭐ icon to add it to your favorites list.",
    },
    {
        q: "Can I watch movies inside this app?",
        a: "No, MovieApp helps you discover movies and track what you want to watch, but it does not stream content.",
    },
    {
        q: "Why do I need an account?",
        a: "An account helps you save favorites, watchlists, and history across devices.",
    },
    {
        q: "Is MovieApp free?",
        a: "Yes, MovieApp is completely free to use. Some features may require an internet connection.",
    },
    {
        q: "Where does the movie data come from?",
        a: "We use The Movie Database (TMDb) API to provide up-to-date movie information.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const router = useRouter();

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <View className="flex-1 bg-primary">
            {/* Background */}
            <Image
                source={images.bg}
                className="flex-1 absolute w-full h-full z-0"
                resizeMode="cover"
            />

            <View className="flex-row items-center px-4 pt-12 pb-4 border-b border-white/10">
                {/*Back button */}
                <TouchableOpacity onPress={() => router.back()} >
                    <ArrowLeft size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
                <Text className="text-2xl font-bold text-white mb-6">❓ FAQ</Text>

                {faqs.map((item, i) => (
                    <View key={i} className="mb-4 border-b border-white/20 pb-3">
                        <TouchableOpacity
                            className="flex-row justify-between items-center"
                            onPress={() => toggle(i)}
                        >
                            <Text className="text-lg text-white font-rubik">{item.q}</Text>
                            {openIndex === i ? (
                                <ChevronUp size={20} color="#fff" />
                            ) : (
                                <ChevronDown size={20} color="#fff" />
                            )}
                        </TouchableOpacity>
                        {openIndex === i && (
                            <Text className="text-base text-gray-300 mt-2 leading-6">{item.a}</Text>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default FAQ;
