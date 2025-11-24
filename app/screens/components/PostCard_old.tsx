import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';

interface PostProps {
    username: string;
    avatar: any;
    contentText: string;
    contentImage: any;
    likes: number;
    comments: number;
    shares: number;
}

export default function PostCard(props: PostProps) {
    const [likeCount, setLikeCount] = useState(props.likes);
    const [commentCount, setCommentCount] = useState(props.comments);
    const [shareCount, setShareCount] = useState(props.shares);
    const [liked, setLiked] = useState(false);

    const toggleLike = () => {
        if (liked) {
            setLikeCount(likeCount - 1);
            setLiked(false);
        } else {
            setLikeCount(likeCount + 1);
            setLiked(true);
        }
    };

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={props.avatar} style={styles.avatar} />
                <Text style={styles.username}>{props.username}</Text>
            </View>

            {/* Content */}
            <Text style={styles.contentText}>{props.contentText}</Text>
            <Image source={props.contentImage} style={styles.contentImage} />

            {/* Stats */}
            <View style={styles.stats}>
                <Text>{likeCount} Likes</Text>
                <Text>{commentCount} Comments</Text>
                <Text>{shareCount} Shares</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Interaction buttons */}
            <View style={styles.actions}>
                <Pressable onPress={toggleLike} style={styles.actionBtn}>
                    <EvilIcons name="like" size={24}
                        color={liked ? "blue" : "black"}
                    />
                    <Text style={[styles.actionText, liked && styles.liked]}>Likes</Text>
                </Pressable>

                <Pressable
                    onPress={() => setCommentCount(commentCount + 1)}
                    style={styles.actionBtn}
                >
                    <EvilIcons name="comment" size={24} color="black" />
                    <Text style={styles.actionText}> Comments</Text>
                </Pressable>

                <Pressable
                    onPress={() => setShareCount(shareCount + 1)}
                    style={styles.actionBtn}
                >
                    <EvilIcons name="share-apple" size={24} color="black" />
                    <Text style={styles.actionText}>Shares</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        marginVertical: 10,
        borderRadius: 10,
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        marginHorizontal: 10
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    username: { fontWeight: "bold", fontSize: 16 },
    contentText: { marginBottom: 8 },
    contentImage: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 8,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
    },

    actionBtn: { alignItems: "center", paddingVertical: 2, flexDirection: "row" },
    actionText: { color: "#374151", fontWeight: "500" },
    liked: { color: "#2563EB" },
});
