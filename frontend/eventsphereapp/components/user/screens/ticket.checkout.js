import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    FlatList,
    Pressable,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';

const discountCodes = [
    { code: 'DISCOUNT10', percent: 10 },
    { code: 'SAVE20', percent: 20 },
    { code: 'EVENT30', percent: 30 },
];

const paymentMethods = ['MoMo', 'VNPay', 'ZaloPay', 'Thanh toán khi nhận vé'];

export default function TicketCheckoutScreen({ route }) {
    const { event } = route.params;
    const [method, setMethod] = useState('MoMo');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);

    const originalPrice = event.price;
    const discountAmount = selectedDiscount
        ? (originalPrice * selectedDiscount.percent) / 100
        : 0;
    const finalPrice = originalPrice - discountAmount;

    const handleConfirm = () => {
        Alert.alert('Đặt vé thành công', `Bạn đã chọn thanh toán qua ${method}.`);
        // Redirect hoặc xử lý tiếp...
    };

    const handleSelectDiscount = (code) => {
        if (selectedDiscount?.code === code.code) {
            setSelectedDiscount(null); // Bỏ chọn
        } else {
            setSelectedDiscount(code); // Chọn mới
        }
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafd' }}>
            <View style={styles.container}>
                <Text style={styles.title}>Thanh toán cho: {event.name}</Text>

                <View style={styles.rowBetween}>
                    <View>
                        <Text style={styles.label}>Giá vé gốc:</Text>
                        <Text style={styles.originalPrice}>{originalPrice.toLocaleString()}đ</Text>
                        {selectedDiscount && (
                            <Text style={styles.discountText}>
                                -{discountAmount.toLocaleString()}đ ({selectedDiscount.code})
                            </Text>
                        )}
                        <Text style={styles.finalPrice}>
                            Tổng cộng: {finalPrice.toLocaleString()}đ
                        </Text>
                    </View>

                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Text style={styles.discountButton}>🎁 Chọn mã giảm giá</Text>
                    </TouchableOpacity>
                </View>

                <Text style={{ marginTop: 30, marginBottom: 8 }}>Chọn phương thức thanh toán:</Text>
                <View style={styles.paymentContainer}>
                    {paymentMethods.map((m) => (
                        <TouchableOpacity
                            key={m}
                            style={[styles.paymentOption, method === m && styles.paymentSelected]}
                            onPress={() => setMethod(m)}
                        >
                            <Text style={method === m ? styles.paymentTextSelected : styles.paymentText}>
                                {m}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                    <Text style={styles.confirmText}>Xác nhận đặt vé</Text>
                </TouchableOpacity>

                {/* Modal chọn mã giảm giá */}
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Chọn mã giảm giá</Text>
                                    <FlatList
                                        data={discountCodes}
                                        keyExtractor={(item) => item.code}
                                        renderItem={({ item }) => (
                                            <Pressable
                                                style={styles.discountItem}
                                                onPress={() => handleSelectDiscount(item)}
                                            >
                                                <Text style={styles.discountCode}>{item.code}</Text>
                                                <Text>{item.percent}% giảm</Text>
                                            </Pressable>
                                        )}
                                    />
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <Text style={styles.closeModal}>Đóng</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

// ...styles giữ nguyên như cũ
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    label: {
        fontSize: 16,
        color: '#555',
    },
    originalPrice: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    finalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e63946',
        marginTop: 8,
    },
    discountText: {
        fontSize: 16,
        color: '#2a9d8f',
        marginTop: 4,
    },
    discountButton: {
        fontSize: 14,
        color: '#007aff',
        marginTop: 4,
        fontWeight: '500',
        textAlign: 'right',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    confirmButton: {
        backgroundColor: '#007aff',
        marginTop: 32,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    confirmText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    discountItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    discountCode: {
        fontWeight: '600',
    },
    closeModal: {
        marginTop: 16,
        textAlign: 'center',
        color: '#007aff',
        fontWeight: '500',
    },

    // Payment Styles
    paymentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
    },
    paymentOption: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#f2f2f2',
    },
    paymentSelected: {
        backgroundColor: '#007aff',
        borderColor: '#007aff',
    },
    paymentText: {
        color: '#333',
        fontSize: 14,
    },
    paymentTextSelected: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});