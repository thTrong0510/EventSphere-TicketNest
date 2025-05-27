import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const sampleEvents = [
    {
        id: '1',
        name: 'Đêm nhạc Acoustic',
        type: 'Âm nhạc',
        date: '2025-06-01',
        location: 'Hồ Gươm, Hà Nội',
        price: 100000,
        image: 'https://i.imgur.com/QkQX8Bv.jpg',
        description: 'Chương trình nhạc nhẹ giữa lòng thủ đô.',
    },
    {
        id: '2',
        name: 'Hội thảo Công nghệ AI',
        type: 'Hội thảo',
        date: '2025-07-15',
        location: 'ĐH Bách Khoa, HCM',
        price: 0,
        image: '',
        description: 'Cập nhật xu hướng AI mới nhất.',
    },
    {
        id: '3',
        name: 'Giải bóng đá sinh viên',
        type: 'Thể thao',
        date: '2025-08-20',
        location: 'SVĐ Mỹ Đình, Hà Nội',
        price: 50000,
        image: 'https://i.imgur.com/mK5YhVb.jpg',
        description: 'Cổ vũ cho các đội bóng sinh viên xuất sắc.',
    },
    {
        id: '4',
        name: 'Lễ hội ẩm thực đường phố',
        type: 'Ẩm thực',
        date: '2025-09-10',
        location: 'Công viên Lê Văn Tám, HCM',
        price: 30000,
        image: 'https://i.imgur.com/NzjYZDU.jpg',
        description: 'Trải nghiệm ẩm thực đa dạng từ nhiều vùng miền.',
    },
];

const eventTypes = ['Tất cả', 'Âm nhạc', 'Hội thảo', 'Thể thao', 'Ẩm thực'];

function normalizeString(str) {
    return str
        .normalize('NFD') // chuẩn hóa Unicode
        .replace(/[\u0300-\u036f]/g, '') // loại bỏ dấu
        .toLowerCase();
}

export default function ManageEventsScreen() {
    const navigation = useNavigation();

    const [events, setEvents] = useState(sampleEvents);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('Tất cả');

    const filteredEvents = events.filter(event =>
        normalizeString(event.name).includes(normalizeString(search)) &&
        (filterType === 'Tất cả' || event.type === filterType)
    );

    const handleDelete = (id) => {
        setEvents(events.filter(event => event.id !== id));
    };

    const handleEdit = (id) => {
        alert(`Chức năng chỉnh sửa cho sự kiện ${id} chưa được triển khai.`);
    };

    const onHandleSaveEvent = (newEvent) => {
        setEvents(prev => [...prev, { ...newEvent, id: Date.now().toString() }]);
    };

    const handleCreateEvent = () => {
        navigation.navigate('CreateEvent', {
            onEventCreated: onHandleSaveEvent,
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafd', paddingTop: Platform.OS === 'android' ? 25 : 0 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Quản lý sự kiện</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Tìm kiếm theo tên"
                    value={search}
                    onChangeText={setSearch}
                />

                <View style={styles.filterContainer}>
                    {eventTypes.map(type => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.filterButton,
                                filterType === type && styles.activeFilter
                            ]}
                            onPress={() => setFilterType(type)}
                        >
                            <Text style={filterType === type ? styles.activeFilterText : styles.filterText}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <FlatList
                    data={filteredEvents}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => { navigation.navigate('DetailsEvent', { event: item }) }}>
                            <View style={styles.card}>
                                {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
                                <Text style={styles.name}>{item.name}</Text>
                                <Text>{item.type} - {item.date}</Text>
                                <Text>{item.location}</Text>
                                <Text>Giá vé: {item.price.toLocaleString()} VNĐ</Text>
                                <Text style={styles.description}>{item.description}</Text>
                                <View style={styles.buttonGroup}>
                                    <Button title="Sửa" onPress={() => handleEdit(item.id)} />
                                    <Button title="Xóa" onPress={() => handleDelete(item.id)} color="red" />
                                </View>
                            </View>
                        </TouchableOpacity>

                    )}
                />

                <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
                    <Text style={styles.createButtonText}>+ Tạo sự kiện</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#eee',
        margin: 4,
    },
    activeFilter: {
        backgroundColor: '#007bff',
    },
    filterText: {
        color: '#333',
    },
    activeFilterText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
    },
    image: {
        height: 150,
        width: '100%',
        borderRadius: 8,
        marginBottom: 10,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    description: {
        fontStyle: 'italic',
        marginTop: 4,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    createButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 12,
        elevation: 4,
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
