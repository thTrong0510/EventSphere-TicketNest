import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PaymentMethodSelector({ selected, onSelect }) {
    const methods = ['MoMo', 'VNPAY'];
    return (
        <View style={styles.container}>
            {methods.map(method => (
                <TouchableOpacity
                    key={method}
                    style={[styles.button, selected === method && styles.selected]}
                    onPress={() => onSelect(method)}
                >
                    <Text style={styles.text}>{method}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
    button: { padding: 12, borderWidth: 1, borderRadius: 8, borderColor: '#ccc' },
    selected: { backgroundColor: '#007bff', borderColor: '#007bff' },
    text: { color: '#fff' },
});
