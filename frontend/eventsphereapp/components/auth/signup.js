// screens/SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const fakeSignUpApi = ({ email, password, role }) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email && password && role) resolve();
            else reject('Missing information');
        }, 1500);
    });
};

export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('participant');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setLoading(true);
        setError('');
        try {
            await fakeSignUpApi({ email, password, role });
            navigation.replace('Login');
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                <Text style={styles.title}>Sign Up</Text>
                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={role} onValueChange={(itemValue) => setRole(itemValue)}>
                        <Picker.Item label="Admin" value="admin" />
                        <Picker.Item label="Organizer" value="organizer" />
                        <Picker.Item label="Participant" value="participant" />
                    </Picker>
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                {loading ? <ActivityIndicator /> : <Button title="Sign Up" onPress={handleSignUp} />}
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Already have an account? Log in</Text>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 8, borderRadius: 5 },
    pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginVertical: 8 },
    error: { color: 'red', textAlign: 'center', marginVertical: 4 },
    link: { color: 'blue', textAlign: 'center', marginTop: 16 },
});