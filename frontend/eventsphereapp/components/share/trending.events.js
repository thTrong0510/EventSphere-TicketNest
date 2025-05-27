// screens/admin/TrendingEventsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const mockTrendingEvents = [
    {
        id: '1',
        name: 'Lễ hội âm nhạc Mùa Hè',
        interest: 1500,
        image: 'https://source.unsplash.com/600x400/?concert'
    },
    {
        id: '2',
        name: 'Tech Conference 2025',
        interest: 1200,
        image: 'https://source.unsplash.com/600x400/?conference'
    },
    {
        id: '3',
        name: 'Giải chạy Marathon Thành phố',
        interest: 950,
        image: 'https://source.unsplash.com/600x400/?marathon'
    }
];

export default function TrendingEventsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sự kiện hot hiện tại</Text>
            <FlatList
                data={mockTrendingEvents}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.interest}>Lượt quan tâm: {item.interest}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    card: { marginBottom: 16, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f9f9f9', elevation: 2 },
    image: { width: '100%', height: 180 },
    info: { padding: 12 },
    name: { fontSize: 18, fontWeight: 'bold' },
    interest: { color: '#888', marginTop: 4 }
});
