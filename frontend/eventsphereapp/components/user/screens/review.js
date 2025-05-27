import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useState } from 'react';

export default function ReviewScreen() {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(5);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đánh giá sự kiện</Text>
            <Text>Chấm điểm (1-5):</Text>
            <TextInput
                keyboardType="numeric"
                style={styles.input}
                value={String(rating)}
                onChangeText={text => setRating(Number(text))}
            />
            <Text>Viết đánh giá:</Text>
            <TextInput
                style={[styles.input, { height: 100 }]}
                value={review}
                onChangeText={setReview}
                multiline
            />
            <Button title="Gửi đánh giá" onPress={() => alert('Đánh giá đã gửi!')} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10 },
});
