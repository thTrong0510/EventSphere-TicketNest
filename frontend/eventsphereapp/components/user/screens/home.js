// src/user/home.screen.js
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mockEvents } from '../data/mockEvents';

export default function HomeScreen() {
    const navigation = useNavigation();
    const joinedEvents = mockEvents.slice(0, 4); // hoặc [] nếu muốn test chưa có sự kiện

    const renderItem = (isJoined) => ({ item }) => (
        <View style={isJoined ? styles.joinedCard : styles.card}>
            {/* Avatar ở góc trên bên trái */}
            <TouchableOpacity onPress={() => navigation.navigate('EventDetail', { eventId: item.id, isJoined })}>
                <View style={{ position: 'relative' }}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <TouchableOpacity
                        style={styles.avatarWrapper}
                        onPress={() => navigation.navigate('Chat', { userId: item.ownerId })}
                    >
                        <Image source={{ uri: item.ownerAvatar }} style={styles.avatar} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.eventName}>{item.name}</Text>
                <Text style={styles.eventInfo}>{item.date} - {item.location}</Text>
                <Text style={styles.eventInfo}>Mức độ quan tâm: 1000 người</Text>
            </TouchableOpacity>



            <View style={styles.buttonGroup}>
                {isJoined && (<TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => navigation.navigate('Review', { eventId: item.id })}
                >
                    <Text style={styles.smallButtonText}>Đánh giá</Text>
                </TouchableOpacity>)}
            </View>
        </View>

    );

    return (
        <>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Sự kiện nổi bật</Text>

                <FlatList
                    data={mockEvents}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem(false)}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 4 }}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('EventsTab')}
                >
                    <Text style={styles.buttonText}>Xem tất cả sự kiện</Text>
                </TouchableOpacity>

                <Text style={[styles.title, { marginTop: 20 }]}>Sự kiện đã tham gia</Text>

                {joinedEvents.length === 0 ? (
                    <Text style={{ fontSize: 16, color: '#999', textAlign: 'center', marginTop: 10 }}>
                        Chưa từng tham gia sự kiện nào
                    </Text>
                ) : (
                    <FlatList
                        data={joinedEvents}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem(true)}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        scrollEnabled={false}
                        contentContainerStyle={{ paddingBottom: 30 }}
                    />
                )}
            </ScrollView>


        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f4f8',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    card: {
        width: 260,
        marginRight: 14,
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    joinedCard: {
        width: '48%',
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },

    image: {
        width: '100%',
        height: 120,
        borderRadius: 10,
    },
    eventName: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
    },
    eventInfo: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    smallButton: {
        flex: 1,
        backgroundColor: '#FF9800',
        paddingVertical: 8,
        borderRadius: 6,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    smallButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#3478f6',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 30,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    avatarWrapper: {
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 10,
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#fff',
        overflow: 'hidden',
        backgroundColor: '#eee',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },

});
