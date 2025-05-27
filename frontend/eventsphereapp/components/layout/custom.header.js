import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../context/user.context';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomHeader = ({ title }) => {
    const navigation = useNavigation();
    const { user } = useContext(UserContext);

    return (
        <SafeAreaView style={{ backgroundColor: '#fff' }}>
            <View
                style={{
                    height: 60,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ddd',
                }}
            >
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
                {user?.avatar && (
                    <TouchableOpacity onPress={() => navigation.navigate('UserInfo', { user })}>
                        <Image
                            source={{ uri: user.avatar }}
                            style={{ width: 32, height: 32, borderRadius: 16 }}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default CustomHeader;
