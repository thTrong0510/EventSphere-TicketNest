import { View, Text, FlatList, StyleSheet } from 'react-native';

const notifications = [
    { id: '1', message: 'Bạn đã đặt vé thành công!', time: '1 phút trước' },
    { id: '2', message: 'Sự kiện “Tech Conference 2025” sẽ diễn ra trong 1 ngày!', time: '2 giờ trước' },
];

export default function NotificationsScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.message}</Text>
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                )}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    time: { color: '#888', fontSize: 12, marginTop: 4 },
});
