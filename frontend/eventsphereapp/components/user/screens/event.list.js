import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import EventCard from '../components/EventCard';
import { mockEvents } from '../data/mockEvents';
import removeAccents from '../../../assets/utils/removeAccents';

const PAGE_SIZE = 10;

export default function EventListScreen({ navigation }) {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('Tất cả');
    const [page, setPage] = useState(1);
    const [visibleEvents, setVisibleEvents] = useState([]);

    const eventTypes = ['Tất cả', 'Âm nhạc', 'Hội thảo', 'Thể thao', 'Ẩm thực', 'Triển lãm'];

    useEffect(() => {
        loadMoreEvents();
    }, [page]);

    useEffect(() => {
        setPage(1);
        loadMoreEvents(1);
    }, [search, filterType]);

    const loadMoreEvents = (targetPage = page) => {
        const normalizedSearch = removeAccents(search).toLowerCase();

        const filtered = mockEvents.filter(e => {
            const matchType = filterType === 'Tất cả' || e.type === filterType;
            const matchSearch = removeAccents(e.name).toLowerCase().includes(normalizedSearch);
            return matchType && matchSearch;
        });

        const newEvents = filtered.slice(0, targetPage * PAGE_SIZE);
        setVisibleEvents(newEvents);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadMoreEvents(nextPage);
    };

    const handleSearchChange = (text) => {
        setSearch(text);
    };

    const handleFilterChange = (type) => {
        setFilterType(type);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Tìm kiếm sự kiện..."
                style={styles.search}
                value={search}
                onChangeText={handleSearchChange}
                keyboardType='default'
                autoComplete='false'
            />

            <View style={styles.filterRow}>
                {eventTypes.map(type => (
                    <TouchableOpacity
                        key={type}
                        style={[styles.filterButton, filterType === type && styles.activeFilter]}
                        onPress={() => handleFilterChange(type)}
                    >
                        <Text style={filterType === type ? styles.activeFilterText : styles.filterText}>
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={visibleEvents}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <EventCard
                        event={item}
                        onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
                    />
                )}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingRight: 10, paddingLeft: 10, paddingBottom: 10 },
    search: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#eee',
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    filterText: {
        fontSize: 14,
        color: '#333',
    },
    activeFilter: {
        backgroundColor: '#3478f6',
    },
    activeFilterText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});