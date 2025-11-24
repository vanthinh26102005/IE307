import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Alert, ScrollView } from "react-native";
import ToggleSwitch from "./components/ToggleSwitch";
import InputField from "./components/InputField";
import SubmitButton from "./components/SubmitButton";
import FAQItem from "./components/FAQItem";

export default function SettingAndFeedBack() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [faqList, setFaqList] = useState<string[]>([]);

    const handleSubmit = () => {
        if (!feedback.trim()) return; // do nothing when feedback is empty

        // addd feedback to list FAQs
        setFaqList((prev) => [feedback, ...prev]);
        setFeedback("");

        // if notification is enabled, show aleart when submit feedback
        if (notifications) {
            Alert.alert("Thank you for your feedback!");
        }
    };

    const themeStyles = {
        backgroundColor: isDarkMode ? "#000" : "#f2f2f2",
        color: isDarkMode ? "#fff" : "#111",
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
            <View style={styles.logoContainer}>
                <Image source={require("@/app/screens/assets/react-logo.png")} style={styles.logo} />
                <Text style={[styles.title, { color: themeStyles.color }]}>23521500 Ngô Văn Thịnh`s App</Text>
            </View>

            <View style={styles.section}>
                <ToggleSwitch label="Dark Mode" value={isDarkMode} onValueChange={setIsDarkMode} isDarkMode={isDarkMode} />
                <ToggleSwitch
                    label="Notifications"
                    value={notifications}
                    onValueChange={setNotifications}
                    isDarkMode={isDarkMode}
                />
            </View>

            <View style={styles.section}>
                <InputField
                    label="Feedback"
                    value={feedback}
                    onChangeText={setFeedback}
                    placeholder="Your feedback here..."
                    multiline
                    isDarkMode={isDarkMode}
                />
                <SubmitButton title="SEND FEEDBACK" onPress={handleSubmit} disabled={!feedback.trim()} isDarkMode={isDarkMode} />
            </View>

            <View style={styles.section}>
                <Text style={[styles.subtitle, { color: themeStyles.color }]}>Frequently Asked Questions</Text>
                {faqList.map((item, index) => (
                    <FAQItem key={index} question={item} isDarkMode={isDarkMode} />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 40,
    },
    logoContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        marginBottom: 8,
    },
    title: {
        fontSize: 22,
        fontWeight:'bold',
        // fontWeight: "700",
    },
    section: {
        marginVertical: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 12,
    },
});