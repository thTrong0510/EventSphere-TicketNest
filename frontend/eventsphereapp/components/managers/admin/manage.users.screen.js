import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    Pressable,
    Modal,
    Button,
    SafeAreaView,
    Platform
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const initialUsers = [
    { id: '1', name: 'Nguyễn Văn A', role: 'user' },
    { id: '2', name: 'Trần Thị B', role: 'organizer' },
    { id: '3', name: 'Admin', role: 'admin' },
    { id: '4', name: 'Lê Thị C', role: 'user' },
    { id: '5', name: 'Phạm Văn D', role: 'organizer' },
];

export default function ManageUsersScreen() {
    const [users, setUsers] = useState(initialUsers);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('Tất cả');
    const [open, setOpen] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const roleOptions = [
        { label: 'Tất cả', value: 'Tất cả' },
        { label: 'User', value: 'user' },
        { label: 'Organizer', value: 'organizer' },
        { label: 'Admin', value: 'admin' },
    ];

    const filteredUsers = users.filter(user =>
        (roleFilter === 'Tất cả' || user.role === roleFilter) &&
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        setDeleteId(id);
        setModalVisible(true);
    };

    const confirmDelete = () => {
        setUsers(prev => prev.filter(user => user.id !== deleteId));
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>👤 Quản lý người dùng</Text>

                <DropDownPicker
                    open={open}
                    value={roleFilter}
                    items={roleOptions}
                    setOpen={setOpen}
                    setValue={setRoleFilter}
                    setItems={() => { }}
                    style={styles.dropdown}
                    dropDownContainerStyle={{ borderColor: '#ccc' }}
                    zIndex={1000}
                    zIndexInverse={1000}
                />

                <TextInput
                    placeholder="🔍 Tìm kiếm theo tên..."
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                />

                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.userCard}>
                            <View>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.role}>{item.role.toUpperCase()}</Text>
                            </View>
                            <Pressable onPress={() => handleDelete(item.id)}>
                                <Text style={styles.deleteIcon}>🗑️</Text>
                            </Pressable>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>Không tìm thấy người dùng</Text>
                    }
                />

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text>Bạn có chắc chắn muốn xóa người dùng này không?</Text>
                            <View style={styles.modalButtons}>
                                <Button title="Hủy" onPress={() => setModalVisible(false)} />
                                <Button title="Xóa" onPress={confirmDelete} color="red" />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f2f4f8', paddingTop: Platform.OS === 'android' ? 25 : 0 },
    container: { flex: 1, padding: 16 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    dropdown: {
        marginBottom: 10,
        borderColor: '#ccc',
        backgroundColor: '#fff'
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 12
    },
    userCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderColor: '#ddd',
        borderWidth: 1
    },
    name: {
        fontSize: 16,
        fontWeight: '500'
    },
    role: {
        fontSize: 14,
        color: '#666',
        marginTop: 2
    },
    deleteIcon: {
        fontSize: 20,
        color: '#d11a2a'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16
    }
});
