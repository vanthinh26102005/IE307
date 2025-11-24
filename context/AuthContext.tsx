import React, { createContext, useContext, useMemo, useState } from "react";

// mock email  data
const STUDENT_EMAIL = "23521500@gm.uit.edu.vn";
const STUDENT_PASSWORD = "ngovanthinh";

// contex value type definition
type AuthContextType = {
    isAuthenticated: boolean;
    email: string | null;
    favouritesCount: number;
    signIn: (
        email: string,
        password: string
    ) => Promise<{ ok: boolean; message?: string }>;
    signOut: () => void;
    setFavouritesCount: (n: number) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const [favouritesCount, setFavouritesCount] = useState<number>(3); // default is 3

    // Handle sign-in logic
    const signIn = async (inputEmail: string, inputPassword: string) => {
        // Normalize strings: trim whitespace + ignore case sensitivity
        if (
            inputEmail.trim().toLowerCase() === STUDENT_EMAIL.toLowerCase() &&
            inputPassword.trim().toLowerCase() === STUDENT_PASSWORD.toLowerCase()
        ) {
            setIsAuthenticated(true);
            setEmail(inputEmail.trim().toLowerCase());
            return { ok: true };
        }

        return { ok: false, message: "Incorrect email or password." };
    };

    // Handle sign-out
    const signOut = () => {
        setIsAuthenticated(false);
        setEmail(null);
    };

    // Memoize the value to prevent unnecessary re-renders
    const value = useMemo(
        () => ({
            isAuthenticated,
            email,
            favouritesCount,
            signIn,
            signOut,
            setFavouritesCount,
        }),
        [isAuthenticated, email, favouritesCount]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for consuming auth context
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};