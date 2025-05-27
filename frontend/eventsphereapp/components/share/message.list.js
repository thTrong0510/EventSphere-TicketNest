import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { chatUsers } from '../user/data/mockMessage';

const MessageListScreen = () => {
    const navigation = useNavigation();

    const renderItem = ({ item }) => {
        const lastMessage = item.messages[item.messages.length - 1];

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafd', paddingTop: Platform.OS === 'android' ? 25 : 0 }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Chat', { userId: item.id })}
                    style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: '#ddd' }}
                >
                    <Image
                        source={{ uri: item.avatar }}
                        style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        <Text numberOfLines={1} style={{ color: '#666' }}>
                            {lastMessage.text}
                        </Text>
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        );
    };

    return (
        <FlatList
            data={chatUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
        />
    );
};

export default MessageListScreen;
