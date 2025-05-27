import {
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { mockEvents } from '../data/mockEvents';
import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

export default function EventDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { eventId, isJoined } = route.params;

    const event = mockEvents.find((e) => e.id == eventId);

    // Dropdown state
    const [open, setOpen] = useState(false);
    const [ticketType, setTicketType] = useState('normal');
    const [items, setItems] = useState([
        { label: 'Thường', value: 'normal' },
        { label: 'VIP (+20%)', value: 'vip' },
        { label: 'Sinh viên (-50%)', value: 'student' },
    ]);

    const discountMap = {
        normal: 0,
        vip: -0.2,
        student: 0.5,
    };

    if (!event) {
        return (
            <SafeAreaView style={styles.centered}>
                <Text style={styles.errorText}>Sự kiện không tồn tại</Text>
            </SafeAreaView>
        );
    }

    const originalPrice = event.price || 0;
    const finalPrice =
        ticketType === 'vip'
            ? originalPrice * 1.2
            : originalPrice * (1 - (discountMap[ticketType] || 0));

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafd' }}>
            <View style={styles.container}>
                <Image source={{ uri: event.image }} style={styles.image} />
                <Text style={styles.title}>{event.name}</Text>

                <View style={styles.metaContainer}>
                    <Text style={styles.metaText}>📅 {event.date}</Text>
                    <Text style={styles.metaText}>📍 {event.location}</Text>
                </View>

                <Text style={styles.description}>{event.description}</Text>
                {!isJoined && (<>
                    <Text style={styles.label}>Chọn loại vé:</Text>
                    <DropDownPicker
                        open={open}
                        value={ticketType}
                        items={items}
                        setOpen={setOpen}
                        setValue={setTicketType}
                        setItems={setItems}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={1000}
                    /></>)}
            </View>

            {!isJoined && (
                <View style={styles.fixedButtonContainer}>
                    <Text style={styles.fixedPrice}>Tổng tiền: {finalPrice.toLocaleString()}đ</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Checkout', { event, ticketType })}
                    >
                        <Text style={styles.buttonText}>Đặt vé ngay</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#888',
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    metaContainer: {
        marginBottom: 16,
    },
    metaText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    description: {
        fontSize: 16,
        color: '#444',
        lineHeight: 22,
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    dropdown: {
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 24,
    },
    dropdownContainer: {
        borderColor: '#ccc',
        borderRadius: 10,
    },
    fixedButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fixedPrice: {
        fontSize: 18,
        fontWeight: '600',
        color: '#e63946',
    },
    button: {
        backgroundColor: '#007aff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
});
