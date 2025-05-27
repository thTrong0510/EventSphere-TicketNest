import { Platform } from 'react-native';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const myTickets = [
    { id: '1', eventName: 'Music Festival 2025', date: '20/06/2025', status: 'Đã thanh toán' },
    { id: '2', eventName: 'Tech Conference 2025', date: '12/07/2025', status: 'Đã check-in' },
];

export default function TicketScreen({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafd' }}>
            <View style={styles.container}>
                <FlatList
                    data={myTickets}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.ticket}
                            onPress={() => navigation.navigate('TicketDetail', { ticket: item })}
                        >
                            <Text style={styles.name}>{item.eventName}</Text>
                            <Text>{item.date}</Text>
                            <Text style={styles.status}>{item.status}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, paddingRight: 16, paddingLeft: 16, paddingBottom: 16, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    ticket: { backgroundColor: '#f1f1f1', padding: 16, marginBottom: 10, borderRadius: 10 },
    name: { fontSize: 16, fontWeight: '600' },
    status: { color: 'green', marginTop: 4 },
});
