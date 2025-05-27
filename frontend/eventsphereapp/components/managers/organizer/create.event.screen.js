import React, { useState } from 'react';
import {
    View, Text, TextInput, Modal, StyleSheet,
    TouchableOpacity, SafeAreaView, Platform,
    StatusBar, KeyboardAvoidingView, ScrollView,
    Keyboard, Image
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const provinces = [
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Huế',
    'Bình Dương', 'Đồng Nai', 'Nghệ An', 'Quảng Ninh', 'Lâm Đồng', 'Thanh Hóa',
];

export default function CreateEventScreen({ onEventCreated }) {
    const [event, setEvent] = useState({
        name: '',
        type: null,
        date: new Date(),
        location: '',
        price: '',
        description: '',
        image: '',
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [citySuggestions, setCitySuggestions] = useState([]);

    const [openTypeDropdown, setOpenTypeDropdown] = useState(false);
    const [typeItems, setTypeItems] = useState([
        { label: 'Âm nhạc', value: 'Âm nhạc' },
        { label: 'Hội thảo', value: 'Hội thảo' },
        { label: 'Thể thao', value: 'Thể thao' },
        { label: 'Khác', value: 'Khác' },
    ]);

    const handleChange = (key, value) => {
        setEvent(prev => ({ ...prev, [key]: value }));
        if (key === 'location') {
            const suggestions = provinces.filter(p =>
                p.toLowerCase().includes(value.toLowerCase())
            );
            setCitySuggestions(suggestions);
        }
    };

    // Hàm chọn ảnh từ thư viện ảnh điện thoại
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Bạn cần cấp quyền truy cập thư viện ảnh để chọn ảnh!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handleChange('image', result.assets[0].uri);
        }
    };

    const handleCreate = () => {
        const { name, type, date, location, price } = event;
        if (name && type && date && location && price) {
            const newEvent = {
                ...event,
                id: Date.now().toString(),
                date: date.toISOString().split('T')[0],
            };
            onEventCreated(newEvent);
            setModalMessage('Tạo sự kiện thành công!');
            setModalVisible(true);
            setEvent({
                name: '',
                type: null,
                date: new Date(),
                location: '',
                price: '',
                description: '',
                image: '',
            });
            setCitySuggestions([]);
        } else {
            setModalMessage('Vui lòng nhập đầy đủ thông tin.');
            setModalVisible(true);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Tạo sự kiện mới</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Tên sự kiện"
                        value={event.name}
                        onChangeText={text => handleChange('name', text)}
                    />

                    <View style={{ zIndex: 1000 }}>
                        <DropDownPicker
                            open={openTypeDropdown}
                            value={event.type}
                            items={typeItems}
                            setOpen={setOpenTypeDropdown}
                            setValue={val => setEvent(prev => ({ ...prev, type: val(prev.type) }))}
                            setItems={setTypeItems}
                            placeholder="Chọn loại sự kiện"
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                            onOpen={() => Keyboard.dismiss()}
                        />
                    </View>

                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        <TouchableOpacity
                            style={styles.datePicker}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateText}>
                                Ngày: {event.date.toISOString().split('T')[0]}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={event.date}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(e, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) handleChange('date', selectedDate);
                                }}
                            />
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Địa điểm"
                            value={event.location}
                            onChangeText={text => handleChange('location', text)}
                        />
                        {citySuggestions.length > 0 && (
                            <View style={styles.suggestionsContainer}>
                                {citySuggestions.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            handleChange('location', item);
                                            setCitySuggestions([]);
                                        }}
                                        style={styles.suggestion}
                                    >
                                        <Text>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Giá vé"
                            keyboardType="numeric"
                            value={event.price}
                            onChangeText={text => handleChange('price', text)}
                        />

                        {/* Nút chọn ảnh thay vì nhập link */}
                        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                            <Text style={{ color: '#007BFF' }}>Chọn ảnh sự kiện</Text>
                        </TouchableOpacity>

                        {/* Hiển thị ảnh preview nếu có */}
                        {event.image ? (
                            <Image
                                source={{ uri: event.image }}
                                style={styles.imagePreview}
                                resizeMode="cover"
                            />
                        ) : null}

                        <TextInput
                            style={styles.textArea}
                            placeholder="Mô tả"
                            value={event.description}
                            onChangeText={text => handleChange('description', text)}
                            multiline
                        />

                        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                            <Text style={styles.createButtonText}>Tạo sự kiện</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalMessage}>{modalMessage}</Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9fafd',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContainer: {
        paddingBottom: 100,
    },
    title: {
        fontSize: 24,
        marginVertical: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    dropdown: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
    },
    dropdownContainer: {
        borderRadius: 10,
    },
    datePicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    dateText: {
        color: '#333',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 15,
        height: 100,
        borderRadius: 10,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
    },
    imagePicker: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#007BFF',
        marginBottom: 15,
        alignItems: 'center',
        backgroundColor: '#e6f0ff',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    createButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    suggestionsContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        maxHeight: 100,
        borderRadius: 10,
        marginBottom: 15,
    },
    suggestion: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});
