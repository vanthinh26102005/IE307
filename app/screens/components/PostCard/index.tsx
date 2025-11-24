import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostStats from "./PostStats";
import PostActions from "./PostActions";

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

    // callback function when click btn
    const toggleLike = () => {
        setLiked(!liked);
        setLikeCount((prev) => prev + (liked ? -1 : 1));
    };

    const increaseComment = () => setCommentCount((prev) => prev + 1);
    const increaseShare = () => setShareCount((prev) => prev + 1);

    return (
        <View style={styles.card}>
            {/* Header & Content */}
            <PostHeader username={props.username} avatar={props.avatar} />
            <PostContent text={props.contentText} image={props.contentImage} />

            {/* Stats */}
            <PostStats likes={likeCount} comments={commentCount} shares={shareCount} />

            <View style={styles.divider} />

            {/* Actions - control state */}
            <PostActions
                // transfer props to child component
                liked={liked}
                onLike={toggleLike}
                onComment={increaseComment}
                onShare={increaseShare}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 8,
    },
});