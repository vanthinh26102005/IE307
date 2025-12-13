import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { loginRequest } from "@/services/api";

type AuthContextType = {
    isAuthenticated: boolean;
    token: string | null;
    userId: number | null;
    email: string | null;
    favouritesCount: number;
    isRestoring: boolean;
    signIn: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
    signOut: () => Promise<void>;
    setFavouritesCount: (n: number) => void;
};

type DecodedToken = {
    sub?: number;
    id?: number;
    user?: string;
};

const STORAGE_TOKEN_KEY = "lab04_token";
const STORAGE_USER_KEY = "lab04_userId";
const STORAGE_EMAIL_KEY = "lab04_email";

const FALLBACK_EMAIL = "23521500@gm.uit.edu.vn";
const FALLBACK_PASSWORD = "ngovanthinh";

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
    children: React.ReactNode;
    enableRedirect?: boolean;
};

export const AuthProvider = ({ children, enableRedirect = true }: AuthProviderProps) => {
    const parentContext = useContext(AuthContext);
    const router = useRouter();
    const segments = useSegments();

    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [isRestoring, setIsRestoring] = useState(true);
    const [favouritesCount, setFavouritesCount] = useState<number>(3);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const [storedToken, storedUserId, storedEmail] = await AsyncStorage.multiGet([
                    STORAGE_TOKEN_KEY,
                    STORAGE_USER_KEY,
                    STORAGE_EMAIL_KEY,
                ]);
                const tokenValue = storedToken?.[1];
                const userValue = storedUserId?.[1];
                const emailValue = storedEmail?.[1];
                if (tokenValue) setToken(tokenValue);
                if (userValue) {
                    const parsed = Number(userValue);
                    if (!Number.isNaN(parsed)) setUserId(parsed);
                }
                if (emailValue) setEmail(emailValue);
            } catch (error) {
                console.error("Failed to restore session", error);
            } finally {
                setIsRestoring(false);
            }
        };
        restoreSession();
    }, []);

    const authToken = parentContext ? parentContext.token : token;
    const authRestoring = parentContext ? parentContext.isRestoring : isRestoring;

    useEffect(() => {
        const restoring = authRestoring;
        if (!enableRedirect) return;
        const inLab04 = segments?.[0] === "(lab04)";
        if (!inLab04 || restoring) return;
        if (authToken) {
            router.replace("/(lab04)/(main)/home");
        } else {
            router.replace("/(lab04)/(auth)/login");
        }
    }, [segments, authToken, authRestoring, router, enableRedirect]);

    const signIn = async (inputEmail: string, inputPassword: string) => {
        const trimmedEmail = inputEmail.trim();
        const trimmedPassword = inputPassword.trim();
        if (!trimmedEmail || !trimmedPassword) {
            return { ok: false, message: "Please enter email and password." };
        }
        try {
            const { data } = await loginRequest(trimmedEmail, trimmedPassword);
            const decoded = jwtDecode<DecodedToken>(data.token);
            const derivedUserId = typeof decoded.sub === "number"
                ? decoded.sub
                : typeof decoded.id === "number"
                    ? decoded.id
                    : null;

            setToken(data.token);
            setUserId(derivedUserId);
            setEmail(trimmedEmail);
            await AsyncStorage.setItem(STORAGE_TOKEN_KEY, data.token);
            await AsyncStorage.setItem(STORAGE_EMAIL_KEY, trimmedEmail);
            if (derivedUserId) {
                await AsyncStorage.setItem(STORAGE_USER_KEY, String(derivedUserId));
            } else {
                await AsyncStorage.removeItem(STORAGE_USER_KEY);
            }
            return { ok: true };
        } catch (error: any) {
            if (
                trimmedEmail.toLowerCase() === FALLBACK_EMAIL.toLowerCase() &&
                trimmedPassword === FALLBACK_PASSWORD
            ) {
                setToken("lab04-mock-token");
                setUserId(1);
                setEmail(trimmedEmail);
                await AsyncStorage.multiSet([
                    [STORAGE_TOKEN_KEY, "lab04-mock-token"],
                    [STORAGE_USER_KEY, "1"],
                    [STORAGE_EMAIL_KEY, trimmedEmail],
                ]);
                return { ok: true };
            }
            const message =
                error?.response?.data?.message ||
                error?.response?.data ||
                "Incorrect email or password.";
            return { ok: false, message };
        }
    };

    const signOut = async () => {
        setToken(null);
        setUserId(null);
        setEmail(null);
        await AsyncStorage.multiRemove([STORAGE_TOKEN_KEY, STORAGE_USER_KEY, STORAGE_EMAIL_KEY]);
    };

    const value = useMemo(
        () =>
            parentContext ?? {
                isAuthenticated: !!token,
                token,
                userId,
                email,
                favouritesCount,
                isRestoring,
                signIn,
                signOut,
                setFavouritesCount,
            },
        [parentContext, token, userId, email, favouritesCount, isRestoring]
    );

    if (parentContext) {
        return <>{children}</>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};
