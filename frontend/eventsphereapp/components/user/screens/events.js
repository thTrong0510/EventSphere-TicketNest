import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const generateMockEvents = (startId, count) => {
    const events = [];
    for (let i = 0; i < count; i++) {
        const id = startId + i;
        events.push({
            id,
            name: `Sự kiện ${id}`,
            image: 'https://i.imgur.com/8Km9tLL.jpg',
            date: `0${(id % 30) + 1}/06/2025`,
            location: ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng'][id % 3],
        });
    }
    return events;
};

export default function EventScreen() {
    const navigation = useNavigation();
    const [events, setEvents] = useState(generateMockEvents(1, 10));
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadMoreEvents = useCallback(() => {
        if (loading || !hasMore) return;
        setLoading(true);

        setTimeout(() => {
            const newEvents = generateMockEvents(page * 10 + 1, 10);
            if (newEvents.length === 0) {
                setHasMore(false);
            } else {
                setEvents(prev => [...prev, ...newEvents]);
                setPage(prev => prev + 1);
            }
            setLoading(false);
        }, 1000); // simulate network delay
    }, [loading, page, hasMore]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>{item.date} - {item.location}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={loadMoreEvents}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && <ActivityIndicator size="small" color="#3478f6" />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 12,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    details: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});
