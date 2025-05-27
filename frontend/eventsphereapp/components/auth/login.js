import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { UserContext } from '../context/user.context';

const fakeLoginApi = ({ email, password }) => {
    const users = [
        {
            email: 'user@example.com',
            password: 'password',
            name: 'Nguyễn Văn A',
            role: 'user',
        },
        {
            email: 'admin@example.com',
            password: 'adminpass',
            name: 'Trần Quản Trị',
            role: 'admin',
        },
        {
            email: 'organizer@example.com',
            password: 'organizerpass',
            name: 'Lê Tổ Chức',
            role: 'organizer',
        },
    ];

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const found = users.find(
                (u) => u.email === email && u.password === password
            );
            if (found) {
                resolve(found);
            } else {
                reject('Invalid credentials');
            }
        }, 1500);
    });
};

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { setUser } = useContext(UserContext); // ✅ Dùng context

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const user = await fakeLoginApi({ email, password });

            // ✅ Set user trong context
            setUser({
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: `https://i.pravatar.cc/150?u=${user.email}`, // Avatar theo email
            });

            navigation.replace('AppNavigator'); // ✅ Không quay lại màn login
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <Text style={styles.title}>Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <Button title="Login" onPress={handleLogin} />
                )}
                <Text
                    style={styles.link}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    Don't have an account? Sign up
                </Text>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 8,
        borderRadius: 5,
    },
    error: { color: 'red', textAlign: 'center', marginVertical: 4 },
    link: { color: 'blue', textAlign: 'center', marginTop: 16 },
});
