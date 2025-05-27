import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StatisticsScreen from '../../managers/statistics.screen';
import DiscountCodeScreen from '../../managers/admin/discount.codes.screen';
import ManageUserScreen from '../../managers/admin/manage.users.screen';
import ChatScreen from '../../share/chat';
import MessageListScreen from '../../share/message.list';
import Icon from 'react-native-vector-icons/Ionicons';
import UserInfoScreen from '../../share/user.info';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ChatStack = createNativeStackNavigator();
function ChatStackScreen() {
    return (
        <ChatStack.Navigator>
            <ChatStack.Screen name="MessageList" component={MessageListScreen} />
            <ChatStack.Screen name="Chat" component={ChatScreen} />
        </ChatStack.Navigator>
    );
}

export default function AdminNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Statistics') {
                        iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    } else if (route.name === 'DiscountCodes') {
                        iconName = focused ? 'pricetags' : 'pricetags-outline';
                    } else if (route.name === 'ManageUsers') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'MessagesTab') {
                        iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                    } else if (route.name === 'UserInfo') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#1E90FF',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Thống kê' }} />
            <Tab.Screen name="DiscountCodes" component={DiscountCodeScreen} options={{ title: 'Mã giảm giá' }} />
            <Tab.Screen name="ManageUsers" component={ManageUserScreen} options={{ title: 'Quản lý người dùng' }} />
            <Tab.Screen name="MessagesTab" component={ChatStackScreen} />
            <Tab.Screen name="UserInfo" component={UserInfoScreen} />
        </Tab.Navigator>
    );
}
