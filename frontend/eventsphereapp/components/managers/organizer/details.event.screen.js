import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const mockReviews = [
    {
        id: '1',
        user: 'Nguyễn Văn A',
        rating: 4,
        comment: 'Sự kiện rất tốt, âm thanh hay!',
    },
    {
        id: '2',
        user: 'Trần Thị B',
        rating: 5,
        comment: 'Không gian đẹp và tổ chức chuyên nghiệp.',
    },
    {
        id: '3',
        user: 'Lê Văn C',
        rating: 3,
        comment: 'Khá ổn, nhưng xếp hàng hơi lâu.',
    },
];

const EventDetailScreen = () => {
    const route = useRoute();
    const { event } = route.params;

    // Header component chứa tất cả thông tin sự kiện và tiêu đề section
    const renderHeader = () => (
        <>
            <Text style={styles.title}>{event.name}</Text>
            <Text style={styles.label}>Loại sự kiện:</Text>
            <Text style={styles.value}>{event.type}</Text>

            <Text style={styles.label}>Ngày diễn ra:</Text>
            <Text style={styles.value}>{event.date}</Text>

            <Text style={styles.label}>Địa điểm:</Text>
            <Text style={styles.value}>{event.location}</Text>

            <Text style={styles.label}>Số lượng vé:</Text>
            <Text style={styles.value}>{event.tickets}</Text>

            <Text style={styles.label}>Mô tả:</Text>
            <Text style={styles.value}>{event.description}</Text>

            <Text style={styles.sectionHeader}>Đánh giá từ người tham gia</Text>
        </>
    );

    return (
        <FlatList
            style={styles.container}
            data={mockReviews}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            renderItem={({ item }) => (
                <View style={styles.reviewCard}>
                    <Text style={styles.reviewer}>{item.user}</Text>
                    <Text style={styles.rating}>⭐ {item.rating} / 5</Text>
                    <Text>{item.comment}</Text>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    label: {
        fontWeight: '600',
        marginTop: 8,
    },
    value: {
        marginBottom: 4,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 8,
    },
    reviewCard: {
        padding: 12,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#f2f2f2',
    },
    reviewer: {
        fontWeight: '600',
    },
    rating: {
        color: '#f39c12',
    },
});

export default EventDetailScreen;
