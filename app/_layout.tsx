import './globals.css';
import { Stack } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { GlobalProvider } from '@/lib/global-provider';
import { ToastProvider } from 'react-native-toast-notifications';

export default function RootLayout() {
    return (
        <GlobalProvider>
            <ToastProvider
                placement="top"
                duration={3000}
                animationType="slide-in"
                successColor="green"
                dangerColor="red"
                warningColor="orange"
                offsetTop={60}
                z-index={10000}
            >
                <StatusBar style="light" translucent backgroundColor="transparent" />
                <Stack screenOptions={{ headerShown: false }} />
            </ToastProvider>
        </GlobalProvider>
    );
}
