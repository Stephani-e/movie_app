import {Alert, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {icons} from "@/constants/icons";
import {images} from "@/constants/images";
import {getCurrentUser, login} from "@/lib/appwrite";
import {useNotify} from "@/hooks/useNotify";
import {useGlobalContext} from "@/lib/global-provider";

const SignIn = () => {
    const notify = useNotify();
    const { refetch } = useGlobalContext();

    const handleLogin = async () => {
        const user = await login();
        //const user = await getCurrentUser();
        if (user) {
            Alert.alert("Login Successful", "You are now logged in");
            //console.log("Login successful!");
            notify(
                `Login Successful`,               // toastMessage
                `${user?.name} logged in successfully`, // dbMessage
                "login",
                "success"
            );

            refetch();
        } else {
            Alert.alert("Login Failed", "Please try again later");
            notify(
                `Login Failed`,               // toastMessage
                `Google Login Failed`, // dbMessage
                "login",
                "error"
            );
        }
    }

    return (
        <View className="flex-1">
            <ScrollView contentContainerClassName="h-full">
                <Image
                    source={images.bg}
                    className="w-full h-4/6"
                    resizeMode="cover"
                />

                <View className="px-10">
                    <Text className="text-base font-rubik uppercase text-black-200 text-center">Welcome To MobileSiteU</Text>
                    <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
                        Let&#39;s Get You Closer to {"\n"}
                        <Text className="text-primary-300">Your Favorite Movies</Text>
                    </Text>

                    <Text className="text-lg font-rubik text-black-200 text-center mt-12">
                        Login To MobileSiteU with Google
                    </Text>

                    <TouchableOpacity
                        onPress={handleLogin}
                        className="bg-white shadow-md shadow-zinc-300 rounded-full py-4 mt-5"
                    >
                        <View className="flex flex-row items-center justify-center">
                            <Image
                                source={icons.google}
                                className="w-5 h-5"
                                resizeMode="contain"
                            />
                            <Text className="text-lg font-rubik font-medium text-black-300 ml-2">Continue with Google</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}
export default SignIn
