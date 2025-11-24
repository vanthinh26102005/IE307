import { Pressable, Text, StyleSheet } from "react-native"

type SelectButtonProps = {
  title: string
  selected: boolean
  onPress: () => void
}
export default function SelectButton({ title, selected, onPress }: SelectButtonProps) {
  return (
    <Pressable onPress={onPress} style={[styles.button, selected && styles.selectedButton]}>
      <Text style={[styles.text, selected && styles.selectedText]}>
        {selected ? "Deselect" : "Select"} {title}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 4,
  },
  selectedButton: {
    backgroundColor: "#2563EB",
  },
  text: {
    color: "#111827",
    fontWeight: "500",
  },
  selectedText: {
    color: "#fff",
  },
})
