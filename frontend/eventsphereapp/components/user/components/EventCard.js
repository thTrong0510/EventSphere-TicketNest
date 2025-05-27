import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function EventCard({ event, onPress }) {
    return (
        <TouchableOpacity onPress={() => onPress(event)} style={styles.card}>
            <Image source={{ uri: event.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{event.name}</Text>
                <Text>{event.date} - {event.location}</Text>
                <Text style={styles.interest}>{event.interestCount || 0} người quan tâm</Text>

                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{event.price ? event.price.toLocaleString() : '0'}đ</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        marginBottom: 12,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    image: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    info: {
        padding: 10,
        flex: 1,
        position: 'relative',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    interest: {
        marginTop: 4,
        color: '#666',
        fontSize: 13,
    },
    priceContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    price: {
        color: '#ff4500',
        fontWeight: '600',
    },
});
