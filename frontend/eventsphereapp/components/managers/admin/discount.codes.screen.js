import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    FlatList,
    Alert,
    Modal,
    Pressable,
    SafeAreaView,
    Platform
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const mockGroups = [
    { label: 'Tất cả', value: 'Tất cả' },
    { label: 'Sinh viên', value: 'Sinh viên' },
    { label: 'VIP', value: 'VIP' },
    { label: 'Thành viên mới', value: 'Thành viên mới' },
];

const mockList = [
    { id: '1', code: 'SV10', percentage: 10, group: 'Sinh viên' },
    { id: '2', code: 'VIP20', percentage: 20, group: 'VIP' },
    { id: '3', code: 'NEW15', percentage: 15, group: 'Thành viên mới' },
    { id: '4', code: 'ALL5', percentage: 5, group: 'Tất cả' },
    { id: '5', code: 'VIP50', percentage: 50, group: 'VIP' },
];

export default function DiscountCodeScreen() {
    const [code, setCode] = useState('');
    const [percentage, setPercentage] = useState('');
    const [group, setGroup] = useState('Tất cả');
    const [list, setList] = useState(mockList);

    const [editingId, setEditingId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const [groupOpen, setGroupOpen] = useState(false);
    const [groupItems, setGroupItems] = useState(mockGroups);

    const handleAddOrUpdate = () => {
        if (!code || !percentage) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mã và phần trăm giảm.");
            return;
        }

        const newCode = {
            id: editingId || Date.now().toString(),
            code,
            percentage: parseInt(percentage),
            group
        };

        if (editingId) {
            setList(prev =>
                prev.map(item => (item.id === editingId ? newCode : item))
            );
        } else {
            setList(prev => [newCode, ...prev]);
        }

        resetForm();
    };

    const handleSelectItem = (item) => {
        setEditingId(item.id);
        setCode(item.code);
        setPercentage(item.percentage.toString());
        setGroup(item.group);
    };

    const handleDelete = (id) => {
        setDeleteTargetId(id);
        setModalVisible(true);
    };

    const confirmDelete = () => {
        setList(prev => prev.filter(item => item.id !== deleteTargetId));
        setModalVisible(false);
        if (editingId === deleteTargetId) resetForm();
    };

    const resetForm = () => {
        setCode('');
        setPercentage('');
        setGroup('Tất cả');
        setEditingId(null);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>🎁 {editingId ? "Sửa mã giảm giá" : "Tạo mã giảm giá"}</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nhập mã"
                    value={code}
                    onChangeText={setCode}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phần trăm giảm giá (%)"
                    keyboardType="numeric"
                    value={percentage}
                    onChangeText={setPercentage}
                />

                <Text style={styles.label}>Nhóm khách hàng:</Text>
                <DropDownPicker
                    open={groupOpen}
                    value={group}
                    items={groupItems}
                    setOpen={setGroupOpen}
                    setValue={setGroup}
                    setItems={setGroupItems}
                    style={styles.dropdown}
                    dropDownContainerStyle={{ borderColor: '#ccc' }}
                    zIndex={1000}
                    zIndexInverse={1000}
                />

                <Button title={editingId ? "✅ Cập nhật mã" : "➕ Thêm mã"} onPress={handleAddOrUpdate} />

                <Text style={styles.subtitle}>📋 Danh sách mã:</Text>
                <FlatList
                    data={list}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => handleSelectItem(item)} style={styles.item}>
                            <View style={styles.itemContent}>
                                <Text style={styles.itemText}>
                                    <Text style={{ fontWeight: 'bold' }}>{item.code}</Text> - {item.percentage}% ({item.group})
                                </Text>
                                <Pressable onPress={() => handleDelete(item.id)}>
                                    <Text style={styles.deleteIcon}>🗑️</Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    )}
                />

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text>Bạn có chắc chắn muốn xóa mã này?</Text>
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
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#333' },
    subtitle: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    dropdown: {
        borderColor: '#ccc',
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    label: {
        fontWeight: '500',
        marginBottom: 6,
        color: '#444'
    },
    item: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginVertical: 6,
        borderColor: '#ddd',
        borderWidth: 1
    },
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemText: {
        fontSize: 16
    },
    deleteIcon: {
        fontSize: 18
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
