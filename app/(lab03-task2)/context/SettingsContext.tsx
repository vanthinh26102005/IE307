import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSettings, initDb, saveSettings } from "../lib/db";

type SettingsContextValue = {
    darkMode: boolean;
    fontSize: number;
    toggleDarkMode: () => void;
    setFontSize: (size: number) => void;
    colors: {
        background: string;
        surface: string;
        text: string;
        border: string;
    };
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

type SettingsProviderProps = {
    children: React.ReactNode;
};

export function SettingsProvider({ children }: SettingsProviderProps) {
    const [darkMode, setDarkMode] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                await initDb();
                const stored = await getSettings();
                setDarkMode(stored.darkMode);
                setFontSize(stored.fontSize);
            } catch (err) {
                console.error("Load settings error", err);
            } finally {
                setLoaded(true);
            }
        })();
    }, []);

    useEffect(() => {
        if (!loaded) return;
        (async () => {
            try {
                await saveSettings({ darkMode, fontSize });
            } catch (err) {
                console.error("Save settings error", err);
            }
        })();
    }, [darkMode, fontSize, loaded]);

    const colors = useMemo(
        () => ({
            background: darkMode ? "#0f172a" : "#f8fafc",
            surface: darkMode ? "#1e293b" : "#ffffff",
            text: darkMode ? "#e2e8f0" : "#0f172a",
            border: darkMode ? "#334155" : "#e2e8f0",
        }),
        [darkMode]
    );

    const value = useMemo(
        () => ({
            darkMode,
            fontSize,
            toggleDarkMode: () => setDarkMode((prev) => !prev),
            setFontSize,
            colors,
        }),
        [darkMode, fontSize, colors]
    );

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) {
        throw new Error("useSettings must be used within SettingsProvider");
    }
    return ctx;
}
