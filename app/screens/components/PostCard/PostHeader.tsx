import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface PostHeaderProps {
    username: string;
    avatar: any;
}

export default function PostHeader({ username, avatar }: PostHeaderProps) {
    return (
        <View style={styles.header}>
            <Image source={avatar} style={styles.avatar} />
            <Text style={styles.username}>{username}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },
    username: {
        fontWeight: "bold",
        fontSize: 16
    },
});