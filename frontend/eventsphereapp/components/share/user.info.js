import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    Modal,
    Pressable,
    SafeAreaView,
    Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserContext } from '../context/user.context';

export default function UserInfoScreen() {
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();

    // Lấy user từ params hoặc mock nếu cần
    /*
    navigation.navigate('UserInfoScreen', {
    user: {
        name: 'Nguyễn Văn A',
        email: 'a@example.com',
        role: 'Người dùng'
    }
    });
    dùng để navigate khi đăng nhập thành công
    */

    const { user } = useContext(UserContext) || {
        user: {
            name: 'Nguyễn Văn A',
            email: 'a@example.com',
            role: 'Người dùng'
        }
    };

    const handleLogout = () => {
        setShowModal(true);
    };

    const confirmLogout = () => {
        setShowModal(false);
        // Reset stack và chuyển về Login
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafd', paddingTop: Platform.OS === 'android' ? 25 : 0 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Thông tin người dùng</Text>
                <Text style={styles.label}>Tên: {user.name}</Text>
                <Text style={styles.label}>Email: {user.email}</Text>
                <Text style={styles.label}>Vai trò: {user.role}</Text>

                <View style={styles.logoutButton}>
                    <Button title="Đăng xuất" color="red" onPress={handleLogout} />
                </View>

                <Modal
                    visible={showModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowModal(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>Bạn có chắc chắn muốn đăng xuất?</Text>
                            <View style={styles.modalButtons}>
                                <Pressable style={styles.modalButton} onPress={confirmLogout}>
                                    <Text style={{ color: 'white' }}>Đồng ý</Text>
                                </Pressable>
                                <Pressable style={[styles.modalButton, { backgroundColor: 'gray' }]} onPress={() => setShowModal(false)}>
                                    <Text style={{ color: 'white' }}>Hủy</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    logoutButton: {
        marginTop: 30,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    modalButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
});
