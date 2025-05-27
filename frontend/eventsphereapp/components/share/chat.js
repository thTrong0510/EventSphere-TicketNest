import {
    View,
    TextInput,
    FlatList,
    Button,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    KeyboardEvent,
    SafeAreaView,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { chatUsers } from '../user/data/mockMessage';

const currentUserId = 'user1';

const initialMessages = [
    { id: '1', text: 'Hello bạn!', userId: 'user2', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '2', text: 'Chào bạn!', userId: 'user2', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '3', text: 'Hi!', userId: 'user1', avatar: 'https://i.pravatar.cc/150?img=5' },
];

export default function ChatScreen() {

    const [text, setText] = useState('');
    const flatListRef = useRef(null);
    const route = useRoute();
    const { userId } = route.params;

    const user = chatUsers.find(u => u.id == userId);
    const [messages, setMessages] = useState(user.messages || []);


    const sendMessage = () => {
        if (!text.trim()) return;
        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                text,
                userId: currentUserId,
                avatar: 'https://i.pravatar.cc/150?img=5'
            }
        ]);
        setText('');
    };

    // Tự động cuộn xuống cuối mỗi khi có tin nhắn mới hoặc bàn phím hiện
    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const shouldShowAvatar = (messages, index) => {
        if (index === 0) return true;
        return messages[index].userId !== messages[index - 1].userId;
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 110}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index }) => {
                            const isCurrentUser = item.userId === currentUserId;
                            const showAvatar = shouldShowAvatar(messages, index);
                            const avatarUri = isCurrentUser
                                ? 'https://i.pravatar.cc/150?img=5'
                                : user.avatar;
                            return (
                                <View
                                    style={[
                                        styles.messageRow,
                                        isCurrentUser ? styles.messageRowRight : styles.messageRowLeft,
                                    ]}
                                >
                                    {!isCurrentUser && showAvatar && (
                                        <Image source={{ uri: avatarUri }} style={styles.avatar} />
                                    )}
                                    <View
                                        style={[
                                            styles.messageBubble,
                                            isCurrentUser ? styles.messageBubbleRight : styles.messageBubbleLeft,
                                        ]}
                                    >
                                        <Text style={[styles.messageText, isCurrentUser && { color: '#fff' }]}>{item.text}</Text>
                                    </View>
                                </View>
                            );
                        }}
                        contentContainerStyle={{ paddingVertical: 10, flexGrow: 1, justifyContent: 'flex-end' }}
                        keyboardShouldPersistTaps="handled" // quan trọng
                    />
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            value={text}
                            onChangeText={setText}
                            placeholder="Nhắn tin..."
                            returnKeyType="send"
                            onSubmitEditing={sendMessage}
                            blurOnSubmit={false}
                        />
                        <Button title="Gửi" onPress={sendMessage} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messageRow: {
        flexDirection: 'row',
        marginVertical: 3,
        paddingHorizontal: 10,
        alignItems: 'flex-end',
    },
    messageRowLeft: {
        justifyContent: 'flex-start',
    },
    messageRowRight: {
        justifyContent: 'flex-end',
    },
    messageBubble: {
        maxWidth: '70%',
        padding: 10,
        borderRadius: 20,
    },
    messageBubbleLeft: {
        backgroundColor: '#e1f5fe',
        borderTopLeftRadius: 0,
        marginLeft: 5,
    },
    messageBubbleRight: {
        backgroundColor: '#0084ff',
        borderTopRightRadius: 0,
        marginRight: 5,
    },
    messageText: {
        fontSize: 16,
        color: '#000',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#fff',
    },
});
